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
export type MIDISource = "pointer" | "keyboard" | "midi" | "system";

export interface MIDIEventProps {
    note? : number,         // midi note value (0 - 127)
    velocity? : number,     // midi note velocity (0 - 127)
    value? : number,        // value of pitch bend or control
    time? : number,
    message : "note-on" | "note-off" | "pitch-bend",
    source : MIDISource
}

const MEDefaults : MIDIEventProps = {
    note : 0,
    velocity : 90,
    message : "note-on",
    source : "pointer"
}

/**
 * Note event class
 */
export class MIDIEvent {

    readonly props : MIDIEventProps;

    get customEvent() : CustomEvent { return new CustomEvent(this.props.message, { detail: this.props }); }
    
    constructor(props : MIDIEventProps) {
        this.props = { ...MEDefaults, ...props, ...{ time: Date.now() } };
    }
}