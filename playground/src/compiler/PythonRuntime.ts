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
import { MusicTrace } from "../core/trace";


/**
 * TypeScript facing interface for Pyodide. The actual pyodide runtime is 
 * loaded in a web worker (/assets/js/PythonWorker.js)
 */
export class PythonRuntime {

    /// singleton pattern
    private static instance : (PythonRuntime | null) = null;

    /// worker thread interfaces with Pyodide
    private readonly worker: Worker;

    /// waiting list for python compile requests
    private readonly queue = new Array<CompileRequest>();

    /// keeps track of previously compiled results
    private readonly cache = new Map<string, CompileResponse>();

    /// list of all python cells in a playbook known to the runtime
    private readonly modules = new Map<string, PythonCell>();

    /// current request being processed
    private active: CompileRequest | null = null;

    /// current list of dependency warnings
    private warnings = new Array<PythonError>();


    /// start the single python runtime
    /// safe to call multiple times
    public static init() : PythonRuntime {
        if (PythonRuntime.instance === null) {
            PythonRuntime.instance = new PythonRuntime();
        }
        return PythonRuntime.instance;
    }

    /// private constructor for singleton pattern
    private constructor() {

        this.worker = new Worker("/jslib/PythonWorker.js");

        // service any pending runtime requests in our queue
        setTimeout(() => { PythonRuntime.instance?.processQueue(); }, 50);

        // convert worker responses into CompileResponse objects and send to callbacks
        this.worker.onmessage = (event) => {
            const data = event.data;
            const request = this.active;

            if (request && request.uuid === data.uuid) {

                // have any newer requests with updated code been added?
                // if so, throw away this request
                for (let r of this.queue) {
                    if (r.uuid === request.uuid && r.action === request.action && r.code !== request.code) {
                        this.active = null;
                        return;
                    }
                }

                let response = new CompileResponse(request);
                response.output = data.output;
                response.globals = data.globals;
                response.errors = data.errors;
                response.dependencies = data.dependencies;

                // clear warnings for this cell
                this.warnings = this.warnings
                    .filter((w) => (w.target !== response.uuid) && (w.source !== response.uuid));

                // cell updated dependency warnings
                for (const [key, resp] of this.cache) {
                    if (key !== response.uuid && resp.dependencies.includes(response.name)) {
                        this.warnings.push({
                            name: "Dependency Warning",
                            message: `Cell '${response.name}' has been updated.`,
                            details: "", line: -1,
                            target: resp.uuid,
                            source: response.uuid
                        });
                    }
                }

                // cell renamed dependency warnings
                for (let [key, resp] of this.cache) {
                    if (key === response.uuid) continue;
                    for (let dep of resp.dependencies) {
                        let resolved = (dep === response.name);
                        for (let [key2, resp2] of this.cache) {
                            if (key !== key2 && resp2.name === dep) {
                                resolved = true;
                            }
                        }
                        if (!resolved) {
                            this.warnings.push({
                                name: "Dependency Warning",
                                message: `Cell '${dep}' does not exist.`,
                                details: "", line: -1,
                                target: resp.uuid,
                                source: response.uuid
                            });
                        }
                    }
                }

                // provide tunepad trace object
                if (response.globals.has('__tunepad_trace')) {
                    response.trace.fromPython(
                    response.globals.get('__tunepad_trace').value
                );}

                // cache result of compile
                if (response.hasNoErrors()) {
                    this.cache.set(response.uuid, response);
                }

                // callback
                request.callback(response);
            }
            this.active = null;
        }
    }


    /// should be called when parent component unmounts
    public static destroy() {
        if (PythonRuntime.instance) {
            const rt = PythonRuntime.instance;
            rt.worker.terminate();
            rt.active = null;
            rt.cache.clear();
            rt.modules.clear();
        }
    }


    /// Schedule a python compile
    /// If force is true, force a recompile even if the code hasn't changed
    public static compile(cell: PythonCell, force: boolean = false): Promise<CompileResponse> {
        return new Promise((callback: PythonCallback) => {
            PythonRuntime.instance?.queue.push(new CompileRequest(cell, "compile", callback, force));
        });
    }


    /// Run code after compiling (e.g. event handler or unit test)
    public static run(cell: PythonCell): Promise<CompileResponse> {
        return new Promise((callback: PythonCallback) => {
            PythonRuntime.instance?.queue.push(new CompileRequest(cell, "run", callback));
        });
    }


    /// Preload cells as modules in the virutal pyodided filesystem
    public static preload(cells: Array<PythonCell>): Promise<boolean> {
        const rt = PythonRuntime.instance;
        return new Promise(async (success) => {
            for (const cell of cells) {
                rt?.queue.push(new CompileRequest(cell, "preload", (response: CompileResponse) => {
                    console.log('preload response for ' + response.name);
                }));
            }
            success(true);
        });
    }


    private static _timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /// Send offscreen canvas to webworker
    /*
    public static setCanvas(uuid : string, canvas : HTMLCanvasElement) {
      if (canvas != null) {
        const offscreen = canvas.transferControlToOffscreen();
        const python = PythonRuntime.getInstance();
        python.worker.postMessage({ 
          uuid, name: "", code: "", action: "canvas", canvas: offscreen
        }, [offscreen]);
      }
    }
    */


    /// Play button pressed
    public static playCell(cell: PythonCell) {
        PythonRuntime.instance?.worker.postMessage({ ...cell, action: "play" });
    }

    /// Pause button pressed
    public static pauseCell(cell: PythonCell) {
        PythonRuntime.instance?.worker.postMessage({ ...cell, action: "pause" });
    }

    /// delete a cell
    public static deleteCell(cell: PythonCell) {
        const rt = PythonRuntime.instance;
        if (rt) {
            rt.modules.delete(cell.uuid);
            rt.cache.delete(cell.uuid);
            rt.worker.postMessage({ ...cell, action: "delete" });

            // cell deleted dependency warnings
            for (const [key, resp] of rt.cache) {
                if (key !== cell.uuid) {
                    if (resp.dependencies.includes(cell.name)) {
                        rt.warnings.push({
                            name: "Dependency Warning",
                            message: `Cell '${cell.name}' was deleted.`,
                            details: "", line: -1,
                            target: key,
                            source: cell.uuid
                        });
                    }
                }
            }
        }
    }


    public static getWarnings() {
        return PythonRuntime.instance?.warnings;
    }


    private equivalentCode(a: string, b: string) {
        function clip(c: string) {
            return c
                .split('\n')
                .filter((l) => (l !== '' && !l.startsWith('#')))
                .join('\n');
        }
        return clip(a) === clip(b);
    }

    private equivalent(request: CompileRequest, response: CompileResponse) {
        return (
            !request.force &&
            request.name === response.name &&
            request.action === response.action &&
            this.equivalentCode(request.code, response.code)
        );
    }


    /// fired by the timer to process any pending compile requests
    private async processQueue() {

        if (this.queue.length > 0 && this.active === null) {

            // get the first request in the queue
            let request = this.queue.shift() as CompileRequest;

            // update our list of python modules
            this.modules.set(request.uuid, request.cell);

            // pre-cached?
            let response = this.cache.get(request.uuid);
            if (response && response.code && this.equivalent(request, response)) {
                request.callback(response);
            }

            // no cached result, so call the webworker
            else {
                // indicate that we're currently compiling to prevent simultaneous calls
                this.active = request;

                // delete any previously saved results
                this.removeFromCache(request.uuid);

                // ask the worker to compile our source code
                this.worker.postMessage({
                    uuid: request.uuid,
                    name: request.name,
                    action: request.action,
                    code: request.code
                });
            }
        }
        setTimeout(() => { PythonRuntime.instance?.processQueue(); }, 50);
    }


    private removeFromCache(uuid: string) {
        this.cache.get(uuid)?.close();
        this.cache.delete(uuid);
    }


    /// convert a string into a python identifier
    /// append a numerical suffix as many times as needed until unique
    public static makePythonSafe(name: string, uuid: string) {
        let result = '';
        for (const char of name) {
            let c = char.charCodeAt(0);
            if ((c >= 48 && c <= 57) ||    // 0-9
                (c >= 97 && c <= 199) ||   // a-z
                (c >= 65 && c <= 90) ||    // A-Z
                (c === 95))                // '_'
            {
                result += char;
            }
            else if (c === 32) { // SPACE
                result += '_';
            }
        }

        if (result === '') {
            result = 'new_cell';
        }

        // python identifiers can't start with a number
        if (result.charCodeAt(0) >= 48 && result.charCodeAt(0) <= 57) {
            result = '_' + result;
        }

        // can't be a python keyword
        if (_python_keywords.includes(result)) {
            result = '_' + result;
        }

        // make sure name is unique
        let original = result;
        let counter = 2;
        while (PythonRuntime.instance?.duplicateName(result, uuid)) {
            result = original + "_" + counter;
            counter++;
        }
        return result;
    }

    private duplicateName(name: string, uuid: string) {
        for (const [key, cell] of this.modules) {
            if (uuid !== key && cell.name === name) return true;
        }
        return false;
    }
}


export type PythonCallback = (response: CompileResponse) => void;


/**
 * A PythonCell is one unit of a notebook. It has a name and python code.
 * Cells act like individual python files in a module that can be imported from
 * one cell to another.
 */
export interface PythonCell {
    /// use this as primary key (crypto.randomUUID())
    uuid: string;

    /// unique cell name (must be a python identier)
    name: string;

    /// python code
    code: string;
}


/**
 * Interface for requesting compiles
 */
class CompileRequest {

    constructor(cell: PythonCell, action: string, callback: PythonCallback, force: boolean = false) {
        this.cell = cell;
        this.action = action;
        this.callback = callback;
        this.force = force;
    }

    public readonly cell: PythonCell;

    /// resource id for this request (e.g. gadget id)
    public get uuid(): string { return this.cell.uuid; }

    /// name of the tunepad cell
    public get name(): string { return this.cell.name; }

    /// python source code
    public get code(): string { return this.cell.code; }

    /// action requested ("compile", "run", "play", "pause", "rename", "canvas")
    public readonly action: string;

    /// stores promise callback while waiting for pyodide to run
    public readonly callback: PythonCallback;

    /// force a recompile even if code hasn't changed?
    public force: boolean = false;
}


export class CompileResponse {

    /// immutable resource id for this response
    readonly uuid: string;

    /// python source code that generated this response
    readonly code: string;

    /// name of python cell that generated this response
    readonly name: string;

    /// action requested ("compile", "run", "play", "pause", "rename", "canvas")
    public readonly action: string;

    /// list of python standard out (from print statements)
    public output: string[] = [];

    /// trace object generated by the tunepad python api
    public trace = new MusicTrace();

    /// list of python errors resulting from compile
    public errors: PythonError[] = [];

    /// a list of other cell names that this cell imports
    public dependencies: string[] = [];

    /// Python global functions, variables, objects
    public globals: any;


    constructor(request: CompileRequest) {
        this.uuid = request.uuid;
        this.code = request.code;
        this.name = request.name;
        this.action = request.action;
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public hasNoErrors(): boolean {
        return this.errors.length === 0;
    }

    /// cleanup any resources associated with this response
    public close(): void { }

}


export interface PythonError {

    /// name (python type) of the syntax or runtime error
    name: string,

    /// description of the error
    message: string,

    /// details like stack trace, etc
    details: string,

    /// line number of the error (-1 means no line number information available)
    line: number,

    /// target cell ID that this error or warning applies to (-1 means the current cell)
    target: string,

    /// cell ID that generated this error or warning
    source: string
}


// list of python reserved words to make sure cells have valid python identifier names
const _python_keywords = [
    'and',
    'as',
    'assert',
    'break',
    'class',
    'continue',
    'def',
    'del',
    'elif',
    'else',
    'except',
    'exec',
    'False',
    'finally',
    'for',
    'from',
    'global',
    'if',
    'import',
    'in',
    'is',
    'lambda',
    'None',
    'nonlocal',
    'not',
    'or',
    'pass',
    'raise',
    'return',
    'True',
    'try',
    'while',
    'with',
    'yield'
];
