import { PianoKeyboard } from "./instrument";
import { NoteExplorer } from "./interactives/note-explorer";

customElements.define(PianoKeyboard.ELEMENT, PianoKeyboard);
customElements.define(NoteExplorer.ELEMENT, NoteExplorer);

export * from './synthesizer';
export * from './core/';
