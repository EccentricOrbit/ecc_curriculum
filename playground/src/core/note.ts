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


/// frequency (Hz) of note A in octave 0
const A0Hz = 27.5; // Hz

const A4Hz = 440.0;

/// frequency (Hz) of note C in octave 0
const C0Hz = 16.3516;

/// musical notes (in half steps) in the 12-note chromatic scale
///              0    1     2    3     4    5    6     7    8     9    10    11
const NOTES = [ "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B" ];


/// pitch to color mappings
const NOTE_COLORS = [
    "rgb(229, 76, 78)",
    "rgb(223, 132, 74)",
    "rgb(228, 171, 81)",
    "rgb(227, 199, 73)",
    "rgb(223, 228, 78)",
    "rgb(174, 215, 71)",
    "rgb(63, 188, 70)",
    "rgb(63, 169, 180)",
    "rgb(64, 124, 180)",
    "rgb(78, 69, 179)",
    "rgb(141, 69, 183)",
    "rgb(202, 69, 147)" ];



export class Note {

    /// midi note number
    _note = 60;   // middle C
    get note() : number { return this._note; }
    set note(n : number) { this._note = n; }


    /// when in the future this note will be played (time in beats)
    start = 0.0;

    /// when this note will finish playing
    get end() { return this.start + this.duration; }

    /// duration of the note in beats (quarter notes)
    duration : number = 1.0;


    /// note octave (0 - 8) maintains current note letter
    get octave() { return Math.floor(this.note / 12); }
    set octave(o : number) { this.note = o * 12 + this.step; }


    /// note half-step (0 - 11) maintains current octave
    // synthPatch-es rely on this to get their pitch. Must be floating point to allow microtones.
    get step() : number { return this.note % 12; }
    set step(s : number) { this.note = this.octave * 12 + s; }


    /// how many cents off from perfect pitch for this half-step
    get cents() : number { return Math.round((this.note - Math.floor(this.note)) * 100); }


    /// midi velocity (0 - 127)
    _velocity : number = 90;
    get velocity() : number { return this._velocity; }
    set velocity(v : number) { this._velocity = clamp(v, 0, 127); }


    /// velocity to gain conversion
    get gain() : number { return(this.velocity * this.velocity) / (127 * 127); }


    /// note name (e.g. "C", "D♯")
    get name() : string { return `${NOTES[ Math.floor(this.step) ]}`; }


    /// accidental (either ♯ or empty string)
    get accidental() : string { return this.name.substring(1); }


    /// 0 == C-1; 12 == C0; 24 == C1
    get nameWithOctave() : string { return `${NOTES[ Math.round(this.step) ]}${this.octave - 1}`; }


    /// step value color match
    get stepColor() : string { return NOTE_COLORS[ Math.round(this.step) % NOTE_COLORS.length ]; }


    /// note "playback rate"
    get rate() : number { return Math.pow(2, this.note/12); }


    /// note frequency (Hz)
    get frequency() : number { return C0Hz * this.rate; }
    set frequency(f : number) { if (f > 0) this.note = 12 * Math.log(f / C0Hz) / Math.LN2; }


    /// create a note from a midi code (0-127)
    constructor(n : number) {
        this.note = n;
    }


    /// create a note by name (e.g. D#4, C2)
    static fromName(name : string) : Note {
        const note = new Note(60);
        note.octave = Note.nameToOctave(name);
        note.step = Note.nameToStep(name);
        return note;
    }


    static fromFrequency(freq: number) : Note {
        const note = new Note(60);
        note.frequency = freq;
        return note;
    }


    static nameToOctave(n : string) : number {
        if (n.length == 2) {
            let c = n.codePointAt(1);
            if (c) return clamp(c - 48, 0, 8);
        } else if (n.length > 2) {
            let c = n.codePointAt(2);
            if (c) return clamp(c - 48, 0, 8);
        }
        return 0;
    }


    static nameToStep(n : string) : number {
        if (n == null || n == "") {
            return 0;
        } else if (n.length <= 2) {
            n = n[0].toUpperCase();
        } else {
            n = n.substring(0, 2).toUpperCase();
        }
        return Math.max(0, NOTES.indexOf(n));
    }


    /// if the given note name with octave is valid, return note number
    /// else return -1;
    static nameToNote(s : string) : number {
        if (s.length < 2 || s.length > 3) return -1;
        s = s.replaceAll('#', '♯');
        for (let step = 0; step < 12; step++) {
            if (s.startsWith(NOTES[step])) {
                const t = s.substring(NOTES[step].length);
                if (['0', '1', '2', '3', '4', '5', '6', '7', '8'].includes(t)) {
                    let c = t.codePointAt(0);
                    const octave = (c? c : 48) - 48;
                    return octave * 12 + step;
                }
            }
        }
        return -1;
    }
}


function clamp(value : number, minimum : number, maximum : number) {
    return Math.max(minimum, Math.min(maximum, value));
}