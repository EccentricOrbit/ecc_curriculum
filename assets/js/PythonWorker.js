/*
 * TunePad
 * Northwestern University
 * michael-horn@northwestern.edu
 *
 * This project was funded by the National Science Foundation (grant DRL-1612619).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");


// Maximium allowable print statements before we throw an exception to prevent browser hangs
const MAX_OUTPUT = 2000;

// Python namespaces, etc organized by gadget id
const context = new Map();  // Map<string, CellContext>

// cell currently being compiled or acted on
let active_cell = null;

// boot up pyodide and load tunepad environment
async function loadPython() {

    // loadPyodide is part of the pyodide.js distribution
    self.pyodide = await loadPyodide({ stdout: stdout });

    // load tunepad builtin packages
    // create a directory and files in the pyodide virtual filesystem
    self.pyodide.FS.mkdir('tunepad');
    await loadPythonModule('/python/tunepad/__init__.py', 'tunepad/__init__.py');
    await loadPythonModule('/python/tunepad/chords.py', 'tunepad/chords.py');
    await loadPythonModule('/python/tunepad/constants.py', 'tunepad/constants.py');
    await loadPythonModule('/python/tunepad/draw.py', 'tunepad/draw.py');

    // run a python command to print out the current python version number
    let results = await self.pyodide.runPythonAsync("import sys\nsys.version\n");
    if (typeof results === "string") {
        console.log("Python pyodide " + results.split('[')[0]);
    }
}

// pyodide is loaded when this promise is returned
let pyodideReadyPromise = loadPython();


// places files into the virtual pyodide filesystem (FS) so that they can be imported
async function loadPythonModule(url, filename) {
    let response = await fetch(url);
    let text = await response.text();
    self.pyodide.FS.writeFile(filename, text);
}

/**
 * Just mirror of what's in PythonRuntime.ts.
 * Ideally we wouldn't have to declare this interface twice. : ((
  */
class PythonError {
    constructor(name, message, line = -1) {
        /// name (python type) of the syntax or runtime error
        this.name = name;

        /// description of the error
        this.message = message;

        /// details like stack trace, etc
        this.details = '';

        /// line number of the error (-1 means no line number information available)
        this.line = line;

        /// target cell that this error applies to. ("" means the current cell)
        this.target = "";

        /// source cell that generated this error or warning
        this.source = "";
    }
}


/**
 * Instances of CellContext correspond to tunepad cells and store 
 * information for pyodide runs
 */
class CellContext {

    constructor(uuid, name) {
        this.uuid = uuid;       // string, gadget_id (never changes)
        this.name = name;       // string, cell name (can change)
        this.code = "";         // most recent python code from this cell
        this.namespace = null;  // pyodide PyDict global namespace
        this.dependencies = []; // list of other cell names imported into this cell
        this.output = [];       // list of strings from python print statements stdout
        this.errors = [];       // list of PythonError objects
        this.canvas = null;     // OffscreenCanvas (optional)
        this.isRunning = false; // some callbacks only happen when a cell is running
    }


    clear() {
        this.code = "";
        this.dependencies = [];
        this.output = [];
        this.errors = [];
        this.namespace && this.namespace.destroy();
        this.namespace = null;
        this.isRunning = false;
    }


    //-------------------------------------------------------------------
    // used for callback functions
    //-------------------------------------------------------------------
    async runCode(pythonCode) {

        const py = self.pyodide;

        // make sure there was a previous compile
        if (!this.namespace) {
            this.namespace = self.pyodide.globals.get("dict")();
            this.namespace.set("__name__", this.name);
            console.log('No existing namespace for ' + this.name + '.');
        }

        try {
            // run the python code
            await py.runPythonAsync(this.code, { globals: this.namespace });

            // copy updated tunepad playhead and trace object into the namespace
            await py.runPythonAsync("playhead = getPlayhead()\n", { globals: this.namespace });
            await py.runPythonAsync("__tunepad_trace = getTrace()\n", { globals: this.namespace });
        }
        catch (error) {
            this._processError(error);
        }
        return {
            uuid: this.uuid,
            output: this.output,
            globals: this._exportNamespace(),
            errors: this.errors,
            dependencies: this.dependencies
        };
    }


    //-------------------------------------------------------------------
    // recompile code from this python cell
    //-------------------------------------------------------------------
    async compileCode(pythonCode, newName) {

        // erase data from previous compile
        this.clear();
        this.code = pythonCode;

        const py = self.pyodide;


        // create an empty global namespace for this cell
        this.namespace = self.pyodide.globals.get("dict")();
        this.namespace.set("__name__", newName);

        try {

            // rename this cell?
            if (this.name !== newName) {

                // delete old file (if exists)
                let path = this.name + ".py";
                if (py.FS.analyzePath(path).exists) py.FS.unlink(path);

                // remove old name from python's sys cache
                await this._clearPythonCache();

                this.name = newName;
            }

            // place python code into the virtual filesystem to 
            // allow code cells to import one another
            if (this.name !== "__main__") {
                const path = this.name + ".py";
                py.FS.writeFile(path, "from tunepad import *\n" + this.code);
                //console.log(py.FS.readdir('.'));
                //console.log(py.FS.readFile(path, { encoding: 'utf8' }));
            }

            // load any packages
            await py.loadPackagesFromImports(this.code);

            // auto import tunepad functions and start trace
            await py.runPythonAsync("from tunepad import *\n", { globals: this.namespace });

            // reset tunepad module global variables
            await py.runPythonAsync("start_tunepad_trace()\n", { globals: this.namespace });

            // if there was a previous output overflow, we have to clean up after calling
            // sys.sys.stdout.flush() in start_tunepad_trace()
            this.output = [];

            // place reference to tunepad trace into local namespace
            await py.runPythonAsync("__tunepad_trace = getTrace()\n", { globals: this.namespace });

            // add the python code for this cell to the namespace
            this.namespace.set("__tunepad_code", this.code);

            // run the actual python code from the cell
            await py.runPythonAsync(this.code, { globals: this.namespace });

            // copy tunepad playhead and trace object into local module namespace
            await py.runPythonAsync("playhead = getPlayhead()\n", { globals: this.namespace });

            // call all unit test functions (start with __test)
            for (const key of this.namespace) {
                if (key.startsWith('__test')) {
                    let func = this.namespace.get(key);
                    if (func instanceof pyodide.ffi.PyCallable) {
                        func();
                    }
                }
            }

            // find dependencies to generate future warnings
            let depends = await py.runPythonAsync(
                "from pyodide.code import find_imports\n" +
                "find_imports(__tunepad_code)\n",
                { globals: this.namespace });

            for (let d of depends) { this.dependencies.push(d); }

            // delete any existing cached copy of this module
            this._clearPythonCache();
        }
        catch (error) {
            this._processError(error);
        }
        return {
            uuid: this.uuid,
            output: this.output,
            globals: this._exportNamespace(),
            errors: this.errors,
            dependencies: this.dependencies
        };
    }

    //-------------------------------------------------------------------
    // don't run or compile any code yet. just put the cell's code into
    // the virtual filesystem
    //-------------------------------------------------------------------
    async preload(pythonCode) {

        const py = self.pyodide;
        this.code = pythonCode;

        try {
            if (this.name !== "__main__") {
                const path = this.name + ".py";
                py.FS.writeFile(path, "from tunepad import *\n" + this.code);
            }
            //console.log(py.FS.readdir('.'));
            return true;
        }
        catch (error) {
            this._processError(error);
        }
        return {
            uuid: this.uuid,
            output: this.output,
            globals: new Map(),
            errors: this.errors,
            dependencies: this.dependencies
        };
    }

    //-------------------------------------------------------------------
    play() {
        this.isRunning = true;
        requestAnimationFrame((t) => this.animate());
        return true;
    }

    //-------------------------------------------------------------------
    pause() {
        this.isRunning = false;
        return true;
    }

    //-------------------------------------------------------------------
    //-------------------------------------------------------------------
    animate() {
        if (this.namespace == null) return;
        const func = this.namespace.get('animate');
        if (func instanceof pyodide.ffi.PyCallable) {
            try {
                func();
            }
            catch (error) {
                console.log(error);
                this._processError(error);
            }
        }
        if (this.isRunning) {
            requestAnimationFrame((t) => this.animate());
        }
    }


    //-------------------------------------------------------------------
    // TODO: Make canvas local to a cell or addressable
    //-------------------------------------------------------------------
    setCanvas(canvas) {
        registerDrawingModule(canvas);
    }

    //-------------------------------------------------------------------
    // the global stdout function (below) calls this to channel output into a cell
    //-------------------------------------------------------------------
    stdout(out) {
        if (this.output.length >= MAX_OUTPUT) throw "Infinite Loop";
        this.output.push(out);
    }


    //-------------------------------------------------------------------
    // clear objects and cleanup namespace. remove module.
    // WARNING: UNTESTED Code below!!
    //-------------------------------------------------------------------
    async destroy() {
        let path = this.name + ".py";
        const py = self.pyodide;
        this.clear();

        // delete file (if exists)
        if (py.FS.analyzePath(path).exists) py.FS.unlink(path);

        // remove from python system cache
        this._clearPythonCache();
    }


    //-------------------------------------------------------------------
    // remove this module from the python system cache
    //-------------------------------------------------------------------
    async _clearPythonCache() {
        if (this.name === '__main__') return;
        try {
            await self.pyodide.runPythonAsync(
                `import sys\nif '${this.name}' in sys.modules: del sys.modules['${this.name}']\n`
            );
        }
        catch (error) {
            console.log('Error clearing system cache.');
        }
    }


    //-------------------------------------------------------------------
    // Handle exceptions from running python code
    //-------------------------------------------------------------------
    _processError(error) {

        // deal with "infinite loops" or print output overflows
        if (this.output.length >= MAX_OUTPUT) {
            this.errors.push(
                new PythonError(
                    "Infinite Loop?",
                    "Your code might have an infinite loop."
                )
            );
        }

        // pyodide generated python exceptions
        else if (error instanceof self.pyodide.ffi.PythonError) {
            // reformat_exception is in the tunepad/__init__.py file
            let reformat_exception = this.namespace.get("reformat_exception");
            if (reformat_exception instanceof self.pyodide.ffi.PyCallable) {
                const e = reformat_exception();
                if (e.type === "dict") {
                    const o = Object.fromEntries(e.toJs());
                    const pe = new PythonError(o.name, o.message, o.line);
                    pe.details = o.details;
                    this.errors.push(pe);
                }
                e.destroy();
            }
        }

        // any other errors (e.g. type "classmethod" on a line by itself and see what happens)
        else {
            this.errors.push(new PythonError(error.name, error.message));
        }
    }


    // converts the python namespace (PyProxy object) into a map
    _exportNamespace() {
        let globals = new Map();
        if (this.namespace !== null) {
            // refactor? cleanup proxy objects with destroy
            // see also https://pyodide.org/en/stable/usage/api/js-api.html#pyodide.ffi.PyProxy.destroy

            // refactor? do this without the toJs call?
            let map = this.namespace.toJs();

            for (let [key, value] of map) {
                let type = typeof value;
                if (["number", "string", "boolean", "undefined"].includes(type)) {
                    globals.set(key, { name: key, type, value });
                } else if (value instanceof Array || value instanceof Map) {
                    if (key === "__tunepad_trace") {
                        globals.set(key, { name: key, type, value });
                    }
                } else {
                    globals.set(key, { name: key, type });
                }
            }
        }
        return globals;
    }
}


// capture all python print statements into an output buffer
function stdout(o) {
    active_cell && active_cell.stdout(o);
}


// listen for messages from PythonRuntime
self.onmessage = async (event) => {

    // make sure loading is done
    await pyodideReadyPromise;

    const { uuid, name, action, code } = event.data;

    // get or create the active cell
    if (context.has(uuid)) {
        active_cell = context.get(uuid);
    } else {
        active_cell = new CellContext(uuid, name);
        context.set(uuid, active_cell);
    }

    switch (action) {
        case 'compile':
            self.postMessage(await active_cell.compileCode(code, name));
            break;

        case 'run':
            self.postMessage(await active_cell.runCode(code));
            break;

        case 'preload':
            self.postMessage(await active_cell.preload(code));
            break;

        case 'canvas':
            return active_cell.setCanvas(event.data.canvas);

        case 'delete':
            active_cell.destroy();
            context.delete(uuid);
            active_cell = null;
            return;

        case 'play': return active_cell.play();

        case 'pause': return active_cell.pause();
    }
}

function registerDrawingModule(canvas) {
    if (canvas instanceof OffscreenCanvas) {
        const ctx = canvas.getContext('2d');
        const DrawingModule = {
            rect: function (x, y, w, h) {
                ctx.fillRect(x, y, w, h);
            },

            circle: function (cx, cy, diam) {
                ctx.beginPath();
                ctx.arc(cx, cy, diam * 0.5, 0, Math.PI * 2);
                ctx.fill();
            },

            fill: function (color) {
                ctx.fillStyle = color;
            },

            clear: function () {
                ctx.clearRect(0, 0, this.width, this.height);
            },
            width: canvas.width,
            height: canvas.height
        };
        pyodide.registerJsModule("tunepad_draw", DrawingModule);
    }
}

