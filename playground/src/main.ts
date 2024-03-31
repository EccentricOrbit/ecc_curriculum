import { PianoKeyboard } from "./instrument/piano.js";
  

customElements.define(PianoKeyboard.ELEMENT, PianoKeyboard);


let user = "Jane User 2222";

window.addEventListener("load", (e) => {
    const content = document.querySelector('.content');
    if (content) content.innerHTML = "<b>Happy dance?</b>";
    document.querySelector('piano-keyboard')?.addEventListener('note-on', (e) => {
        console.log(e);
    });

    document.querySelector('piano-keyboard')?.addEventListener('note-off', (e) => {
        console.log(e);
    });

    document.querySelector('piano-keyboard')?.addEventListener('pitch-bend', (e) => {
        console.log(e);
    });
});
