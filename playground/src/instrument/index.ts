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

/**
 * An instrument is a virtual musical instrument that can be played with keyboard, mouse,
 * touchscreen, or attached midi device. Instruments use shadow dom to encapsulate
 * stylesheets and element names. Interaction with an instrument generates custom events
 * that can be subscribed to.
 */
export abstract class Instrument {

}

export type NoteSource = "pointer" | "keyboard" | "midi" | "system";

export interface NoteProperties {
    note? : number,         // midi note value (0 - 127)
    velocity? : number,     // midi note velocity (0 - 127)
    value? : number,        // value of pitch bend or control
    time? : number,
    message : "note-on" | "note-off" | "pitch-bend",
    source : NoteSource
}

const NoteDefaults : NoteProperties = {
    note : 0,
    velocity : 90,
    message : "note-on",
    source : "pointer"
}

/**
 * Note event class
 */
export class NoteEvent {

    readonly props : NoteProperties;

    get customEvent() : CustomEvent { return new CustomEvent(this.props.message, { detail: this.props }); }
    
    constructor(props : NoteProperties) {
        this.props = { ...NoteDefaults, ...props, ...{ time: Date.now() } };
    }
}