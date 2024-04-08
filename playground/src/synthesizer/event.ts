/*
 * TunePad
 *
 * Michael S. Horn
 * Northwestern University
 * michael-horn@northwestern.edu
 * Copyright 2022, Michael S. Horn
 *
 * This project was funded by the National Science Foundation (grant DRL-1612619).
 * Any opinions, findings and conclusions or recommendations expressed in this
 * material are those of the author(s) and do not necessarily reflect the views
 * of the National Science Foundation (NSF).
 */
import { Note } from "../core/note";
import { SynthChain } from "./chain";

export class SynthEvent {

    readonly note : Note;
    readonly chain : SynthChain;
    released = false;
    canceled = false;

    constructor(note : Note, chain : SynthChain) {
        this.note = note;
        this.chain = chain;
    }
}
