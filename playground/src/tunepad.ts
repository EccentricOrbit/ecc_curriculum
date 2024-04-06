import { PianoKeyboard } from "./instrument";
import { Synthesizer } from "./synthesizer/synth.js";
import { Note } from "./core/note.js";

customElements.define(PianoKeyboard.ELEMENT, PianoKeyboard);


let user = "Jane User 2222";

window.addEventListener("load", (e) => {
    const context = new AudioContext();
    const synth = new Synthesizer();
    synth.loadPatch('/assets/sounds/voices/grand-piano/patch.json', context);
    const content = document.querySelector('.content');
    if (content) content.innerHTML = "<b>Happy dance?</b>";
    document.querySelector('piano-keyboard')?.addEventListener('note-on', (e) => {
        if (e instanceof CustomEvent) {
            console.log(e);
            synth.playNote(new Note(e.detail.note), context.destination);
        }
    });

    document.querySelector('piano-keyboard')?.addEventListener('note-off', (e) => {
        if (e instanceof CustomEvent) {
            synth.releaseNote(new Note(e.detail.note));            
        }
        console.log(e);
    });

    document.querySelector('piano-keyboard')?.addEventListener('pitch-bend', (e) => {
        console.log(e);
    });
});
