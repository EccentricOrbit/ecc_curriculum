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
import styles from './note-explorer.module.css' with {type: 'css'};
import html from './note-explorer.module.html';
import { Note, TunePadAudio } from '../core';
import { Synthesizer } from '../synthesizer';

/**
 * Note explorer shows a playable piano keyboard with note names and numbers.
 * Generates playNote statements for notes and chords that you can copy.
 * 
 * <note-explorer patch="grand-piano/patch.json"></note-explorer>
 */

export class NoteExplorer extends HTMLElement {

    static readonly ELEMENT = "note-explorer";

    static observedAttributes = [ 
        "patch",  // URL for patch JSON file
    ];


    /// all of the HTML elements for the instrument are contained within a shadow DOM
    root : ShadowRoot;

    private notes = new Set();
    private chord = new Array();

    // TunePad audio core
    private audio : TunePadAudio;

    // create a synthesizer and load a grand piano
    private synth = new Synthesizer();

    private octave = 3;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        this.audio = TunePadAudio.init();
    }


    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = html;

        // Create a shadow root
        this.root.appendChild(template.content.cloneNode(true));

        // create the audio context
        this.audio = TunePadAudio.init();

        // catch piano note events and play note + display note info
        this.root.querySelector('piano-keyboard')?.addEventListener('note-on', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.synth.playNote(note, this.audio.context.destination);
            this.addCodeHint(note);
        });

        this.root.querySelector('piano-keyboard')?.addEventListener('note-off', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.synth.releaseNote(note);
            this.removeCodeHint(note);
        });

        this.root.querySelector('#copy-button')?.addEventListener('click', (e) => {
            const el = document.querySelector('#code-hint');
            if (el) navigator.clipboard.writeText(el.innerHTML);
        });

        this.root.querySelector('#down-octave')?.addEventListener('click', (e) => {
            this.octave = Math.max(1, this.octave - 1);
            this.root.querySelector('piano-keyboard')?.setAttribute('focus-octave', `${this.octave}`);
        });

        this.root.querySelector('#up-octave')?.addEventListener('click', (e) => {
            this.octave = Math.min(8, this.octave + 1);
            this.root.querySelector('piano-keyboard')?.setAttribute('focus-octave', `${this.octave}`);
        });
    }


    disconnectedCallback() {
        //console.log("Custom element removed from page.");
    }

    attributeChangedCallback(name : string, oldValue : string, newValue : string) {
        if (name === 'patch' && newValue !== oldValue) {
            this.synth.loadPatch(newValue, this.audio.context);
        }
    }

    getCodeHint() {
        if (this.chord.length === 1) {
            const note = new Note(this.chord[0]);
            return `playNote(${note.note})    # ${note.nameWithOctave}`;
        } else if (this.chord.length > 0) {
            return `playNote([ ${this.chord.join(', ')} ])`;
        } else {
            return '';
        }    
    }

    addCodeHint(note : Note) {
        this.notes.add(note.note);
        this.chord = [ ... this.notes ].sort();
        const el = this.root.getElementById('code-hint');
        if (el) el.innerHTML = this.getCodeHint();
    }

    removeCodeHint(note : Note) {
        this.notes.delete(note.note);
        if (this.notes.size == 0) this.chord = [ ];
    }
}