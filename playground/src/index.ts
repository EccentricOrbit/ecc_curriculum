import { Piano, PianoKeyboard } from "./instrument";
import { NoteExplorer } from "./interactives/note-explorer";

customElements.define(PianoKeyboard.ELEMENT, PianoKeyboard);
customElements.define(NoteExplorer.ELEMENT, NoteExplorer);
customElements.define(Piano.ELEMENT, Piano);

export * from './synthesizer';
export * from './core/';
