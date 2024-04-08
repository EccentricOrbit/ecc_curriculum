import { PianoKeyboard } from "./instrument";
import { Synthesizer } from "./synthesizer";

export * from './synthesizer';
export * from './core/midi';
export * from './core/utils';
export * from './core/note';

customElements.define(PianoKeyboard.ELEMENT, PianoKeyboard);

const synth = new Synthesizer();

/*
const notes = new Set<number>();
let chord = new Array<number>();

function addCodeHint(note : Note) {
    notes.add(note.note);
    chord = [ ...notes ].sort();
    const el = document.getElementById('code-hint');
    if (el) {
        if (chord.length === 1) {
            el.innerHTML = `playNote(${note.note})`;
        } else if (chord.length > 0) {
            el.innerHTML = `playNote([ ${chord.join(', ')} ])`;
        } else {
            el.innerHTML = '';
        }
    }
}

function removeCodeHint(note : Note) {
    notes.delete(note.note);
    if (notes.size == 0) chord = [ ];
}


window.addEventListener("load", (e) => {

    // create the audio context
    const context = new AudioContext();

    // create a synthesizer and load a grand piano
    const synth = new Synthesizer();
    synth.loadPatch('/assets/sounds/voices/grand-piano/patch.json', context);

    // catch piano note events and play note + display note info
    document.querySelector('piano-keyboard')?.addEventListener('note-on', (e) => {
        if (e instanceof CustomEvent) {
            const note = new Note(e.detail.note);
            synth.playNote(note, context.destination);
            addCodeHint(note);
        }
    });

    document.querySelector('piano-keyboard')?.addEventListener('note-off', (e) => {
        if (e instanceof CustomEvent) {
            const note = new Note(e.detail.note);
            synth.releaseNote(note);
            removeCodeHint(note);
        }
    });

    document.querySelector('piano-keyboard')?.addEventListener('pitch-bend', (e) => {
        console.log(e);
    });
});
*/