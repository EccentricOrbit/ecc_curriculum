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
import { Note } from '../core';

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

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        const template = document.createElement('template');
        template.innerHTML = html;
        this.root.appendChild(template.content.cloneNode(true));
    }


    connectedCallback() {
        const piano = this.root.querySelector('piano-instrument');

        // catch piano note events and play note + display note info
        piano?.addEventListener('note-on', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.addCodeHint(note);
        });

        piano?.addEventListener('note-off', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.removeCodeHint(note);
        });

        piano?.addEventListener('click', (e) => {
            const el = document.querySelector('#code-hint');
            if (el) navigator.clipboard.writeText(el.innerHTML);
        });
    }


    disconnectedCallback() {
        //console.log("Custom element removed from page.");
    }

    attributeChangedCallback(name : string, oldValue : string, newValue : string) {
        if (name === 'patch' && newValue !== oldValue) {
            this.root.querySelector('piano-instrument')?.setAttribute(name, newValue);
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