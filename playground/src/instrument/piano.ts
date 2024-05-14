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
import styles from './piano.module.css' with {type: 'css'};
import html from './piano.module.html';
import { Note, TunePadAudio } from '../core';
import { Synthesizer } from '../synthesizer';
import { PianoKeyboard } from './keyboard';

/**
 * Playable piano keyboard with note names and numbers.
 * Octave buttons.
 * 
 * <piano-instrument
 *      patch="grand-piano/patch.json">
 *      note-hints = "true"   // show note names on keys
 *      midi-hints = "true"   // show midi note numbers on keys
 *      armed = "false"       // listen for keyboard events
 *      min-octave = "0"      // lowest octave available
 *      max-octave = "7"      // highest octave available
 *      key-range = "28"      // how many keys to show at one time
 *      focus-octave = "3">   // focus (left-most) octave showing
 * </piano-instrument>
 */
export class Piano extends HTMLElement {

    static readonly ELEMENT = "piano-instrument";

    static observedAttributes = [ 
        ... PianoKeyboard.observedAttributes,
        "patch",  // URL for patch JSON file
    ];

    /// all of the HTML elements for the instrument are contained within a shadow DOM
    root : ShadowRoot;

    // TunePad audio core
    private audio : TunePadAudio;

    // <piano-keyboard> element
    private keyboard : HTMLElement;

    // create a synthesizer and load a grand piano
    private synth = new Synthesizer();

    private octave = 3;
    private minOctave = 0;
    private maxOctave = 7;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        const template = document.createElement('template');
        template.innerHTML = html;

        // Create a shadow root
        this.root.appendChild(template.content.cloneNode(true));

        this.keyboard = this.root.querySelector('piano-keyboard') as HTMLElement;

        this.audio = TunePadAudio.init();
    }


    connectedCallback() {
        // create the audio context
        this.audio = TunePadAudio.init();

        // catch piano note events and play note + display note info
        this.keyboard.addEventListener('note-on', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.synth.playNote(note, this.audio.context.destination);
        });

        this.keyboard.addEventListener('note-off', (e) => {
            const note = new Note((e as CustomEvent).detail.note);
            this.synth.releaseNote(note);
        });

        this.root.querySelector('#down-octave')?.addEventListener('click', (e) => {
            this.octave = Math.max(this.minOctave, this.octave - 1);
            this.root.querySelector('piano-keyboard')?.setAttribute('focus-octave', `${this.octave}`);
        });

        this.root.querySelector('#up-octave')?.addEventListener('click', (e) => {
            this.octave = Math.min(this.maxOctave, this.octave + 1);
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
        else if (newValue !== oldValue) {
            this.keyboard.setAttribute(name, newValue);
        }
        if (name === 'focus-octave') {
            this.octave = parseInt(newValue);
        } else if (name === 'min-octave') {
            this.minOctave = parseInt(newValue);
        } else if (name === 'max-octave') {
            this.maxOctave = parseInt(newValue);
        }
        this.octave = isNaN(this.octave) ? 3 : this.octave;
        this.minOctave = isNaN(this.minOctave) ? 0 : this.minOctave;
        this.maxOctave = isNaN(this.maxOctave) ? 7 : this.maxOctave;
    }
}