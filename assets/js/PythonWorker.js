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
importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.1/full/pyodide.js");


// Maximium allowable print statements before we throw an exception to prevent browser hangs
const MAX_OUTPUT = 3000;

// Python namespaces, etc organized by gadget id
const context = new Map();  // Map<string, CellContext>

// ideally used to get synchronous input from the user (currently not working)...
let stdinResponse = null;

// resolves when pyodide is loaded
let pyodideReadyPromise = null;


/**
 * boot up pyodide and load tunepad environment
 */
async function loadPython(pythonPath) {

    // loadPyodide is part of the pyodide.js distribution
    self.pyodide = await loadPyodide({ stdout: stdout });
    self.pyodide.setStdin({ stdin: () => self.stdin() });

    // load tunepad builtin packages
    // create a directory and files in the pyodide virtual filesystem
    self.pyodide.FS.mkdir('tunepad');
    await loadPythonModule(`${pythonPath}/tunepad/__init__.py`, 'tunepad/__init__.py');
    await loadPythonModule(`${pythonPath}/tunepad/chords.py`, 'tunepad/chords.py');
    await loadPythonModule(`${pythonPath}/tunepad/constants.py`, 'tunepad/constants.py');
    await loadPythonModule(`${pythonPath}/tunepad/drawing.py`, 'tunepad/drawing.py');

    // run a python command to print out the current python version number
    let results = await self.pyodide.runPythonAsync("import sys\nsys.version\n");
    if (typeof results === "string") {
        console.log("Python pyodide " + results.split('[')[0]);
        self.postMessage({ 'action' : 'init', 'python' : results.split('[')[0].split(' (')[0] });
    }
}


/** 
 * places files into the virtual pyodide filesystem (FS) so that they can be imported
 */
async function loadPythonModule(url, filename) {
    let response = await fetch(url);
    let text = await response.text();
    self.pyodide.FS.writeFile(filename, text);
}


/** capture all python print statements into an output buffer */
function stdout(o) {
    // should never be called
    console.log('stdout!!', o);
    //active_cell && active_cell.stdout(o);
}

/** 
 * Get user input (note this is an async version of python's input function that works in a web context).
 * Because we are in a web worker we can't directly call window.prompt()
 */
function stdin() {
    /*
    self.stdinResponse = undefined;
    self.postMessage("stdin-prompt");

    // still can't seem to get SharedArrayBuffers working for security reasons
    //const sleep = milliseconds => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
    const sleep = ms => false;

    while (!self.stdinResponse) sleep(30);
    return self.stdinResponse;
    */
    return undefined;
}



/**
 * Just mirror of what's in runtime.ts.
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
        this.canvas = "";       // canvas object associated with this cell (if any)
        this.namespace = null;  // pyodide PyDict global namespace
        this.dependencies = []; // list of other cell names imported into this cell
        this.output = [];       // list of strings from python print statements stdout
        this.errors = [];       // list of PythonError objects
    }


    clear() {
        this.code = "";
        this.canvas = "";
        this.dependencies = [];
        this.output = [];
        this.errors = [];
        this.namespace && this.namespace.destroy();
        this.namespace = null;
    }


    //-------------------------------------------------------------------
    // run a snippet of python code in the context of the cells runtime
    //-------------------------------------------------------------------
    runCode(request_id, pythonCode, newCanvas) {
        const py = self.pyodide;
        let result = undefined;

        this.errors = [];

        this.canvas = newCanvas;

        // make sure there was a previous compile
        if (!this.namespace) return;

        try {
            // redirect stdout to this cell
            py.setStdout({ batched: (msg) => this.stdout(msg) });

            // reset tunepad module global variables
            // this lets us call things like playNote from event handler functions
            py.runPython("start_tunepad_trace()\n", { globals: this.namespace });

            // give python access to the canvas name for drawing...
            py.runPython(`setDefaultCanvas("${this.canvas}")`, { globals: this.namespace });

            // run the python code
            result = py.runPython(pythonCode, { globals: this.namespace });

             // copy updated tunepad playhead and trace object into the namespace
            py.runPython("playhead = getPlayhead()\n", { globals: this.namespace });
            py.runPython("__tunepad_trace = getTrace()\n", { globals: this.namespace });
        }
        catch (error) {
            this._processError(error);
        }
        return {
            id: request_id,
            uuid: this.uuid,
            action: 'run-code',
            output: this.output,
            globals: this._exportNamespace(),
            result: result,
            errors: this.errors,
            dependencies: this.dependencies
        };
    }


    //-------------------------------------------------------------------
    // recompile code from this python cell
    //-------------------------------------------------------------------
    async compileCode(request_id, pythonCode, newName, newCanvas) {


        // erase data from previous compile
        this.clear();
        this.code = pythonCode;
        this.canvas = newCanvas;

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
                this._clearPythonCache();

                this.name = newName;
            }

            // place python code into the virtual filesystem to 
            // allow code cells to import one another
            if (this.name !== "__main__") {
                const path = this.name + ".py";
                py.FS.writeFile(path, "from tunepad import *\n" + this.code);
                py.FS.writeFile(path, "from tunepad.drawing import *\n" + this.code);
                //console.log(py.FS.readdir('.'));
                //console.log(py.FS.readFile(path, { encoding: 'utf8' }));
            }

            // load any packages
            await py.loadPackagesFromImports(this.code);

            // auto import tunepad functions
            py.runPython("from tunepad import *\n", { globals: this.namespace });
            py.runPython("from tunepad.drawing import *\n", { globals: this.namespace });

            // reset tunepad module global variables
            py.runPython("start_tunepad_trace()\n", { globals: this.namespace });

            // if there was a previous output overflow, we have to clean up after calling
            // sys.sys.stdout.flush() in start_tunepad_trace()
            this.output = [];

            // redirect stdout to this cell
            py.setStdout({ batched: (msg) => this.stdout(msg) });

            // place reference to tunepad trace into local namespace
            py.runPython("__tunepad_trace = getTrace()\n", { globals: this.namespace });

            // give python access to the canvas name for drawing...
            py.runPython(`setDefaultCanvas("${this.canvas}")`, { globals: this.namespace });

            // add the python code for this cell to the namespace
            this.namespace.set("__tunepad_code", this.code);

            // add python output to the namespace as well
            this.namespace.set("__tunepad_output", this.output);

            // run the actual python code from the cell
            await py.runPythonAsync(this.code, { globals: this.namespace });

            // copy tunepad playhead and trace object into local module namespace
            py.runPython("playhead = getPlayhead()\n", { globals: this.namespace });

            // call all unit test functions (start with __test)
            /*
            for (const key of this.namespace) {
                if (key.startsWith('__test')) {
                    let func = this.namespace.get(key);
                    if (func instanceof pyodide.ffi.PyCallable) {
                        func();
                    }
                }
            }
            */

            // find dependencies to generate future warnings
            let depends = py.runPython(
                "from pyodide.code import find_imports\n" +
                "find_imports(__tunepad_code)\n",
                { globals: this.namespace });

            for (let d of depends) { this.dependencies.push(d); }

            // delete any existing cached copy of this module
            this._clearPythonCache();

            // flush output in case a print statement didn't have a trailing newline
            py.runPython("print('<eof>')", { globals: this.namespace });
            if (this.output.at(-1) === '<eof>') this.output.pop();
        }
        catch (error) {
            this._processError(error);
        }
        return {
            id: request_id,
            uuid: this.uuid,
            action: 'compile',
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
    preload(request_id, pythonCode) {

        const py = self.pyodide;
        this.code = pythonCode;

        try {
            if (this.name !== "__main__") {
                const path = this.name + ".py";
                py.FS.writeFile(path, "from tunepad import *\n" + this.code);
                py.FS.writeFile(path, "from tunepad.drawing import *\n" + this.code);
            }
        }
        catch (error) {
            this._processError(error);
        }
        return {
            id: request_id,
            uuid: this.uuid,
            action: 'preload',
            output: this.output,
            globals: new Map(),
            errors: this.errors,
            dependencies: this.dependencies
        };
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
    _clearPythonCache() {
        if (this.name === '__main__') return;
        try {
            self.pyodide.runPython(
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


            for (let [key, value] of Object.entries(this.namespace)) {

                let type = typeof value;

                if (["number", "string", "boolean", "undefined"].includes(type)) {
                    globals.set(key, { name: key, type, value });
                }
                else if (key === "__tunepad_trace") {
                    const trace = value.toJs().map(v => new Map(Object.entries(v)));
                    globals.set(key, { name: key, type, value : trace});
                }
                else {
                    globals.set(key, { name: key, type });
                }
            }
        }
        return globals;
    }
}


/**
 * Listen for messages from PythonRuntime.
 */
self.onmessage = async (event) => {

    // we have to boot up pyodide before we can do anything else...
    if (event.data.action === 'init') {
        pyodideReadyPromise = loadPython(event.data.pythonPath);
        return;
    } else if (pyodideReadyPromise === null) {
        return;
    }

    // make sure loading is done
    await pyodideReadyPromise;


    // actions related to file and canvas cells
    switch (event.data.action) {

        case 'mkdir':
            self.pyodide.FS.mkdir(event.data.path);
            return;

        case 'read-file':
            const data = self.pyodide.FS.readFile(event.data.path);
            self.postMessage({ action : 'read-file', path : event.data.path, data : data });
            return;

        case 'write-file':
            self.pyodide.FS.writeFile(event.data.file, event.data.data);
            return;

        case 'delete-file':
            self.pyodide.FS.unlink(event.data.file);
            return;

        case 'move-file':
            self.pyodide.FS.rename(event.data.file, event.data.target);
            return;

        case 'register-canvas':
            if (event.data.canvas instanceof OffscreenCanvas) {
                self._canvasMap.set(event.data.name, event.data.canvas);
            }
            return;

        case 'unregister-canvas':
            self._canvasMap.delete(event.data.name);
            return;
    }

    // actions related to python cells
    const { id, uuid, name, action, code, canvas } = event.data;

    // get or create the active cell
    const active_cell = context.has(uuid) ? context.get(uuid) : new CellContext(uuid, name);
    context.set(uuid, active_cell);

    switch (action) {
        case 'init':
            self.loadPython();
            break;
            
        case 'compile':
            self.postMessage(await active_cell.compileCode(id, code, name, canvas));
            break;

        case 'run-code':
            self.postMessage(active_cell.runCode(id, code, canvas));
            break;

        case 'preload':
            self.postMessage(active_cell.preload(id, code));
            break;

        case 'delete':
            active_cell.destroy();
            context.delete(uuid);
            active_cell = null;
            break;
    }
}


_canvasMap = new Map();


function _getCanvasContext(c = undefined) {
    if (c) {
        return _canvasMap.get(c)?.getContext('2d');
    } else if (_canvasMap.size > 0) {
        return _canvasMap.entries().next().value;
    } else {
        return undefined;
    }
}

