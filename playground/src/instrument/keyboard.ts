/*
 * TunePad
 *
 * Michael S. Horn
 * Northwestern University
 * michael-horn@northwestern.edu
 *
 * This project was funded by the National Science Foundation (grant DRL-1612619).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */
import styles from './keyboard.module.css' with {type: 'css'};
import html from './keyboard.module.html';

import { MIDISource, MIDIEvent } from '../core/midi';

/**
 * Piano keyboard custom element
 * 
 * <piano-keyboard 
 *      note-hints = "true"   // show note names on keys
 *      midi-hints = "true"   // show midi note numbers on keys
 *      armed = "false"       // listen for keyboard events
 *      min-octave = "0"      // lowest octave available
 *      max-octave = "7"      // highest octave available
 *      key-range = "28"      // how many keys to show at one time
 *      focus-octave = "2">   // focus (left-most) octave showing 
 * </piano-keyboard>
 * 
 * The piano generates custom events "note-on", "note-off", "pitch-bend"
 */

interface PianoKeyboardProps {
    noteHints : boolean,
    midiHints : boolean,
    armed : boolean,
    minOctave : number,
    maxOctave : number,
    keyRange : number,
    focusOctave : number
}

export class PianoKeyboard extends HTMLElement {

    static observedAttributes = [ 
        "note-hints",  // show note names ("true" | "false")
        "midi-hints",  // show midi note numbers ("true" | "false")
        "armed",       // accepts keyboard input ("true" | "false")
        "min-octave",  // lowest octave (0)
        "max-octave",  // highest key (7)
        "key-range",   // how many keys to show at one time
        "focus-octave" // left-most octave showing
    ];

    static readonly ELEMENT = "piano-keyboard";

    /// attribute set
    props : PianoKeyboardProps = {
        noteHints: true,
        midiHints: true,
        armed: false,
        minOctave: 0,
        maxOctave: 7,
        keyRange: 24,
        focusOctave: 2
    };

    /// all of the HTML elements for the instrument are contained within a shadow DOM
    root : ShadowRoot;

    /// <svg> tag that contains the instrument
    container : SVGSVGElement | null = null;

    /// group that contains all of the visual elements
    parent : SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    /// group that contains all the keys
    allKeys = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  
    /// array of piano keys
    keys : PianoKey[] = [];

    /// size of the containing element
    width : number = 700;
    height : number = 190;

    get minKey() { return this.props.minOctave * 12 + 12; }
    get maxKey() { return this.props.maxOctave * 12 + 23; }

    /// mini piano that shows where we are left-to-right
    //late MiniPiano mini;
  
    /// mapping from computer keys to piano keys
    readonly key_map = "awsedftgyhujkolp;']";
  
  
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        //this.mini = MiniPiano(this);
    }


    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = html;
        // Create a shadow root
        this.root.appendChild(template.content.cloneNode(true));


        // load the container <svg> element from the shadow dom
        this.container = (this.root.querySelector("svg.container") as SVGSVGElement);
        this.container?.append(this.parent);
        this.container?.setAttribute('viewBox', `0 0 ${this.props.keyRange * PianoKey.width} 190`);

        // render SVG content
        this.render();

        // listen to keyboard events
        document.addEventListener("keydown", e => this.onKeyDown(e));
        document.addEventListener("keyup", e => this.onKeyUp(e));
    }

    disconnectedCallback() {
        //console.log("Custom element removed from page.");
    }

    attributeChangedCallback(name : string, oldValue : string, newValue : string) {

        switch (name) {
            case 'note-hints': this.setNoteHints(newValue != "false"); break;

            case 'midi-hints': this.setMidiHints(newValue != "false"); break;

            case 'armed': (newValue == "false") ? this.disarmKeyboard() : this.armKeyboard(); break;

            case 'key-range': this.setKeyRange(parseInt(newValue)); break;

            case 'min-octave': this.setMinOctave(parseInt(newValue)); break;

            case 'max-octave': this.setMaxOctave(parseInt(newValue)); break;

            case 'focus-octave': this.setFocusOctave(parseInt(newValue)); break;
        }
    }

    /**
     * Add note events to the event stream
     */
    emitNoteOn(note : number, source : MIDISource, velocity : number = 90) {
        const e = new MIDIEvent({ note, source, velocity, message: "note-on" });
        this.root.host.dispatchEvent(e.customEvent);
    }

    emitNoteOff(note : number, source : MIDISource) {
        const e = new MIDIEvent({ note, source, velocity : 0, message : "note-off" });
        this.root.host.dispatchEvent(e.customEvent);
    }

    emitPitchBend(value : number, source : MIDISource) {
        const e = new MIDIEvent({ value, source, message : "pitch-bend" });
        this.root.host.dispatchEvent(e.customEvent);
    }


    /**
     * Show note being played
     */
    noteOn(note : number, velocity = 90) {
      let key = this._noteToKey(note);
      key?.press();
    }
  
    /**
     * Hide note being played
     */
    noteOff(note : number) {
      let key = this._noteToKey(note);
      key?.release();
    }

    allNotesOff() {
        this.keys.forEach((key) => key.release());
    }

    /**
     * Is note currently pressed?
    */
    isNoteOn(note : number) : boolean {
        let key = this._noteToKey(note);
        return (key != null && key.isPressed());
    }


    /**
     * How many white keys to show at one time
     */
    setKeyRange(count : number) {
        if (!isNaN(count)) {
            this.props.keyRange = Math.max(7, Math.min(count, 56));
            this.container?.setAttribute('viewBox', `0 0 ${this.props.keyRange * PianoKey.width} 190`);
        }
    }

    setMinOctave(octave : number) {
        if (isNaN(octave)) return;
        octave = Math.max(0, Math.min(6, octave));
        if (octave != this.props.minOctave) {
            this.props.minOctave = octave;
            this.render();
        }
    }

    setMaxOctave(octave : number) {
        if (isNaN(octave)) return;
        octave = Math.max(1, Math.min(7, octave));
        if (octave != this.props.maxOctave) {
            this.props.maxOctave = octave;
            this.render();
        }
    }


    /**
     * Should the piano respond to keyboard events?
     */
    armKeyboard() { 
        this.props.armed = true;
        this.root.querySelectorAll(".key-hint").forEach(e => { e.classList.add("show"); });
    }
    disarmKeyboard() {
        this.props.armed = false;
        this.root.querySelectorAll(".key-hint").forEach(e => { e.classList.remove("show"); });
    }
    get isKeyboardArmed() : boolean { return this.props.armed; }
    private getArmedKey(char : string) : PianoKey | null {
        const fi = (this.props.focusOctave - this.props.minOctave) * 12;
        const ki = this.key_map.indexOf(char.toLowerCase());
        return (ki >= 0 && ki + fi < this.keys.length) ? this.keys[ki + fi] : null;
    }


    /**
     * Process a computer key down event ... possibly play a note
     */
    onKeyDown(e : KeyboardEvent) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.repeat == true) return;
  
        if (this.isKeyboardArmed) {
            const key = this.getArmedKey(e.key!.toLowerCase());
            if (key) {
                this.emitNoteOn(key.note, "keyboard");
                key.press();
            }
            else if (e.key == "ArrowLeft") {
                this.setFocusOctave(this.props.focusOctave - 1);
            }
            else if (e.key == "ArrowRight") {
                this.setFocusOctave(this.props.focusOctave + 1);
            }
            else if (e.key == "ArrowDown") {
                this.emitPitchBend(-200, "keyboard");
            }
            else if (e.key == "ArrowUp") {
                this.emitPitchBend(200, "keyboard");
            }
        }
    }
  
  
    /**
     * Process a computer key up event ... possibly release a note
     */
    onKeyUp(e : KeyboardEvent) {
        if (e.key == "ArrowUp" || e.key == "ArrowDown") {
            this.emitPitchBend(0, "keyboard");
        } else {
            const key = this.getArmedKey(e.key!.toLowerCase());
            if (key) {
                this.emitNoteOff(key.note, "keyboard");
                key.release();
            }
        }
    }
  
  
    /**
     * Convert a midi note to piano key number
     */
    _noteToKey(midi : number) : PianoKey | null {
        const index = Math.round(midi - 12);
        return (index >= 0 && index >= this.keys.length) ? this.keys[index] : null;
    }
  
  
    render() {
        if (this.container == null) return; // only render once mounted

        this.parent.innerHTML = "";
        this.keys = [ ];

        const backdrop = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        backdrop.classList.add("backdrop");
        backdrop.setAttribute("width", "100%");
        backdrop.setAttribute("height", "100%");
        this.parent.append(backdrop);
  
        this.allKeys.classList.add("animated-slide");
        const whiteKeys = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        const blackKeys = document.createElementNS("http://www.w3.org/2000/svg", 'g');

        // generate piano keys
        for (let i=this.minKey; i<=this.maxKey; i++) {
            const key = new PianoKey(i, this);
            this.keys.push(key);
            if (key.black) {
                blackKeys.append(key.el);
            } else {
                whiteKeys.append(key.el);
            }
        }
        this.allKeys.append(whiteKeys);
        this.allKeys.append(blackKeys);
        this.parent.append(this.allKeys);
/*
        const shelf = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        shelf.setAttribute("width", "100%");
        shelf.setAttribute("height", "6");
        shelf.setAttribute("x", "0");
        shelf.setAttribute("y", "1");
        shelf.setAttribute("fill", "black");
        shelf.setAttribute("fill-opacity", "0.2");
        this.parent.append(shelf);
*/
        const felt = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        felt.classList.add("felt")
        felt.setAttribute("width", "100%");
        felt.setAttribute("height", "1.5");
        felt.setAttribute("x", "0");
        felt.setAttribute("y", "0");
        this.parent.append(felt);
  
        // set up minified piano
        //this.mini.render();
  
        this.setFocusOctave(this.props.focusOctave);
  
        //this.mini.hide();
        //this.parent.append(mini.el);
    }
  
  
    setFocusOctave(octave : number) {
        this.props.focusOctave = Math.max(this.props.minOctave, Math.min(this.props.maxOctave, octave));
        const focusIndex = (this.props.focusOctave - this.props.minOctave) * 12;
        if (isNaN(octave) || this.container == null) return;

        this.keys.forEach((key) => key.autoRelease());
        if (focusIndex >= 0 && focusIndex < this.keys.length) {
            const dx = this.keys[focusIndex].x;
            this.allKeys.style.transform = `translateX(${-dx}px)`;

            // update keyboard hints
            this.keys.forEach((key) => key.clearKeymap());
            for (let i = 0; i<this.key_map.length; i++) {
                const index = focusIndex + i;
                if (index >= 0 && index < this.keys.length) {
                    this.keys[index].setKeymap(this.key_map[i]);
                }
            }
            //this.mini.show();
            //this.mini.slide(dx);
        }
    }


    /**
     * Show note name hints
     */
    setNoteHints(on : boolean) {
        this.props.noteHints = on;
        this.root.querySelectorAll(".note-hint").forEach(e => { e.classList.toggle("show", on); });
    }
    get showNoteHints() : boolean { return this.props.noteHints; }

    /**
     * Show midi number hints
     */
    setMidiHints(on : boolean) {
        this.props.midiHints = on;
        this.root.querySelectorAll(".midi-hint").forEach(e => { e.classList.toggle("show", on); });
    }
    get showMidiHints() : boolean { return this.props.midiHints; }


/**
 * Called when the window and possibly containing element are resized.
 */
/*
  void resize() {
    if (container != null) {
      Rectangle<num> rect = container.getBoundingClientRect();
      if (this.width != rect.width || this.height != rect.height) {
        this.width = rect.width;
        this.height = rect.height;
        container.setAttribute("viewBox", "0 0 $width $height");
      }
    }
  }
*/
}

/**
 * Represents a black or white key on the piano keyboard
 */
class PianoKey {

    /// musical notes (in half steps) in the 12-note chromatic scale
    static readonly NOTES = [ "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B" ];

    /// pixel width of white key (in SVG coords system)
    static readonly width = 45;
  
    /// midi note number (e.g. C0 = 12, C4 = 60, C7 96, B7 = 107 )
    readonly note : number;
  
    /// link back to the piano to generate events
    piano : PianoKeyboard;
  
    /// half step value (0 - 12)
    get step() : number { return this.note % 12; }
  
    /// note octave
    get octave() : number { return Math.floor(this.note / 12) - 1; }
  
    /// note name
    get name() : string { return `${PianoKey.NOTES[ this.step ]}`; }
  
    /// index x-coordinate on the keyboard
    get offset() : number {
        const oct = this.octave - this.piano.props.minOctave;
        return oct * 7 + this._key_offsets[this.step]; 
    }
  
    /// pixel x-coordinate on the keyboard
    get x() : number { return this.offset * PianoKey.width; }
  
    /// is this a black key or white key?
    get black() : boolean { return [ 1, 3, 6, 8, 10 ].includes(this.step); }
  
    /// is this a white key
    get white() : boolean { return !this.black; }
  
    /// height of key
    get height() : number { return this.black ? 130 : 195; }
  
    /// key map hint
    keyHint : SVGTextElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  
    /// key offset arrangement starting with C
    /// this helps us render black keys at off-center positions
    readonly _key_offsets = [ 0, 0.45, 1, 1.55, 2, 3, 3.4, 4, 4.5, 5, 5.6, 6 ];
    readonly _hint_offsets = [ -8, 0, 0, 0, +8, -8, 0, 0, 0, 0, 0, +8 ];
  
    /// visual element for SVG
    el = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  
    /// main key rectangle
    rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
  
    /// is the key currently pressed?
    private _down : boolean = false;
  
  
    constructor(note : number, piano : PianoKeyboard) {
        this.note = note;
        this.piano = piano;
        this.el.setAttribute("transform", `translate(${this.x}, 0)`);
        this.el.classList.add("piano-key", `step-${this.step}`);
        this.el.classList.add(this.black ? "black" : "white");
  
        const pad = this.black ? 10 : 1.5;
        let x0 = pad;
        let w = PianoKey.width - (pad * 2);
  
        this.rect.setAttribute("x", `${x0}`);
        this.rect.setAttribute("y", "-8");
        this.rect.setAttribute("width", `${w}`);
        this.rect.setAttribute("height", `${this.height}`);
        this.rect.setAttribute("rx", "3");
        this.el.append(this.rect);

        if (this.black) {
            x0 += 3;
            w -= 6;
            const r = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            r.classList.add("black-top");
            r.setAttribute("x", `${x0}`);
            r.setAttribute("y", "-5");
            r.setAttribute("width", `${w}`);
            r.setAttribute("height", `${this.height - 20}`);
            r.setAttribute("pointer-events", "none");
            this.el.append(r);
        }
        else {
            const noteHint = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            noteHint.classList.add("note-hint");
            noteHint.setAttribute("x", `${x0 + w/2}`);
            noteHint.setAttribute("y", `${this.height - 17}`);
            noteHint.innerHTML = `${this.name}${this.octave}`;
            if (this.piano.showNoteHints) noteHint.classList.add("show");

            // always show C notes
            if (this.step == 0) noteHint.classList.add('always-show');
            this.el.append(noteHint);
        }
  
        const midiHint = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        midiHint.classList.add("midi-hint");
        if (this.black) midiHint.classList.add("black");
        midiHint.setAttribute("x", `${x0 + w/2}`);
        midiHint.setAttribute("y", `${this.height - 35}`);
        midiHint.innerHTML = `${this.note}`;
        if (this.piano.showMidiHints) midiHint.classList.add("show");
        this.el.append(midiHint);

        let hx = x0 + w/2 + this._hint_offsets[this.step];

        this.keyHint.classList.add("key-hint");
        if (this.black) this.keyHint.classList.add("black");
        this.keyHint.setAttribute("x", `${hx}`);
        this.keyHint.setAttribute("y", this.black ? "45" : "60");
        //this.keyHint.setAttribute("y", `${this.height - 57}`);

        if (this.piano.isKeyboardArmed) this.keyHint.classList.add("show");
        this.el.append(this.keyHint);
  
  
        // set up mouse events
        this.el.addEventListener('pointerdown', (e) => {
            this.piano.emitNoteOn(this.note, "pointer");
            this.press();
            e.stopPropagation();
        });
        this.el.addEventListener('pointerup', (e) => {
            this.piano.emitNoteOff(this.note, "pointer");
            this.release();
        });
        this.el.addEventListener('pointerleave', (e) => {
            if (this._down) {
                this.piano.emitNoteOff(this.note, "pointer");
                this.release();
            }
        });
        this.el.addEventListener('pointerenter', (e) => {
            if (e.buttons > 0) {
                this.piano.emitNoteOn(this.note, "pointer");
                this.press();
            }
        });
    }
  
  
    press() {
      this._down = true;
      this.el.classList.add("pressed");
    }
  

    release() {
        if (this._down) {
            this._down = false;
            this.el.classList.remove("pressed");
        }
    }
  
  
    isPressed() : boolean {
        return this.el.classList.contains("pressed");
    }
  
  
    autoRelease() {
        if (this._down) {
            this.piano.emitNoteOff(this.note, "system");
            this._down = false;
            this.el.classList.remove("pressed");
        }
    }
  
  
    setKeymap(k : string) {
        this.keyHint.innerHTML = k;
    }
  
  
    clearKeymap() {
        this.keyHint.innerHTML = "";
    }
}
