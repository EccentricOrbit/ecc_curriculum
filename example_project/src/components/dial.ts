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
import styles from './dial.module.css' with {type: 'css'};
import html from './dial.module.html';

export class Dial extends HTMLElement {

    static readonly ELEMENT = "example-dial";

    static observedAttributes = [
        'min-value',
        'max-value',
        'value'
    ];

    /// all of the HTML elements for the instrument are contained within a shadow DOM
    root : ShadowRoot;

    private ring : HTMLElement;
    private line : SVGLineElement;

    private angle = Math.PI / 2.0;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        this.root.innerHTML = html;
        this.ring = this.root.querySelector('.ring') as HTMLElement;
        this.line = this.root.querySelector('#pointer') as SVGLineElement;
    }

    connectedCallback() {
        let down = false;
        let downY = -1;

        this.ring.addEventListener('pointerdown', (e) => {
            down = true;
            downY = e.clientY;
            console.log('down', downY);
        });
        document.addEventListener('pointermove', (e) => {
            if(down){ 
                const deltaY = downY - e.clientY;
                downY = e.clientY;
                console.log('move', deltaY);
                this.angle += deltaY / 200.0;
                const newX = 50 + 45 * Math.cos(this.angle);
                const newY = 50 - 45 * Math.sin(this.angle);
                this.line.setAttribute('y2', `${newY}`);
                this.line.setAttribute('x2', `${newX}`);
            }
        });
        document.addEventListener('pointerup', (e) => {
            if(down) {
                down = false;
                console.log('up');
            }
        });
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name : string, oldValue : string, newValue : string) {
    }
}
