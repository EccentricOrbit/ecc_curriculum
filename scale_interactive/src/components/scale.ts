import styles from './scale.module.css' with {type: 'css'};
import html from './scale.module.html';
import { Synthesizer } from '@tunepad/audio';

export class Scale extends HTMLElement {

    static readonly ELEMENT = "music-scale";

    static observedAttributes = [
        'min-value',
        'max-value',
        'value'
    ];

    /// all of the HTML elements are contained in a shadow DOM
    root : ShadowRoot;

    /// <svg> tag that contains the interactive
    container : SVGSVGElement | null = null;

    /// group that contains all of the visual elements
    parent : SVGGElement = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    /// size of the containing element
    width : number = 700;
    height : number = 900;

    private major = true;
    private startNote : number = 0;

    /// scale notes
    static readonly NOTES = ["C", "D", "E", "F", "G", "A", "B"];
    static MIDI = [60, 62, 64, 65, 67, 69, 71, 72];
    static currScale : number[];
    
    /// note wheel element
    private wheel : NoteWheel | null = null;

    /// button element
    private button : MajMinButton | null = null;
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.adoptedStyleSheets.push(styles);
        this.root.innerHTML = html;
    }

    connectedCallback() {
        // load the container <svg> element from the shadow dom
        this.container = (this.root.querySelector("svg.container") as SVGSVGElement);
        this.container?.append(this.parent);
        this.container?.setAttribute('viewBox', `0 0 100 1000`);
        console.log(this.container);

        // this.generateScale(this.startNote);

        // render SVG content
        this.render(true, true);

        // note event listeners
        const notes = this.root.querySelectorAll('.note');
        console.log('connected', notes);
        
        const patch_url = new URL('/assets/sounds/voices/grand-piano/patch.json', import.meta.url);
        const synth = new Synthesizer(patch_url);
        notes?.forEach((note) => {
            note.addEventListener('click', (e) => {
                console.log('clicked on ' + note.classList);
                const clickedIndex = Scale.NOTES.findIndex((value) => value === note.classList[1]);
                if (this.major) {
                    if (clickedIndex == 3 || clickedIndex == 7) {
                        synth.playNote((clickedIndex - 1) * 2 + 1 + Scale.MIDI[this.startNote]);
                    }
                    else {
                        synth.playNote(clickedIndex * 2 + Scale.MIDI[this.startNote]);
                    }
                }
                else {
                    if (clickedIndex == 2 || clickedIndex == 5) {
                        console.log((clickedIndex - 1) * 2 + 1 + Scale.MIDI[this.startNote]);
                        synth.playNote((clickedIndex - 1) * 2 + 1 + Scale.MIDI[this.startNote]);
                    }
                    else {
                        synth.playNote(clickedIndex * 2 + Scale.MIDI[this.startNote]);
                    }
                }
            });

            let allNotes = this.root.querySelectorAll(`.${note.classList[1]}`);
            note.addEventListener('mouseout', (e) => {
                allNotes?.forEach((letter) => {
                    if (letter.classList.contains("hover")) letter.classList.remove("hover");
                });
            });
            note.addEventListener('mouseover', (e) => {
                if (note.classList.contains("wheel")) {
                    allNotes?.forEach((letter) => {
                        letter.classList.add("hover");
                    });
                }
                else {
                    if (note.classList.contains("first")){ 
                        allNotes = this.root.querySelectorAll(`.${note.classList[1]}.first`);
                    }
                    else if (note.classList.contains("last")){ 
                        allNotes = this.root.querySelectorAll(`.${note.classList[1]}.last`);
                    }
                    allNotes?.forEach((letter) => {
                        letter.classList.add("hover");
                    });

                    const wheelNote = this.root.querySelector(`.wheel.${note.classList[1]}`);
                    if (wheelNote) wheelNote.classList.add("hover");
                }
            });
        });
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name : string, oldValue : string, newValue : string) {
    }
    
    generateScale(startNote : number) {
        let note = startNote;
        for (let i = 0; i < 8; i++) {
            if (this.major) {
                if (i == 2 || i == 6) note += 1;
                else note += 2;
            }
            // if minor, half steps on 2nd and 5th notes
            else {
                if (i == 1 || i == 4) note += 1;
                else note += 2;
            }
            Scale.currScale.concat(note);
            console.log(note);
        }
    }

    update(major: any, note : any) {
        if (major != null) { 
            this.major = major;
            this.render(false, true);
        }
        if (note != null) { 
            this.startNote = Scale.NOTES.indexOf(note);
            this.render(false, false);
        }
    }

    render(first : boolean, updateMaj : boolean) {
        if (this.container == null) return; // only render once mounted

        this.parent.innerHTML = "";
        
        // only render wheel if switching maj/min or new render
        if (updateMaj || first) {
            // generate wheel
            this.wheel = new NoteWheel(this.major, this.startNote, this);
            this.parent.append(this.wheel.el);

            // generate button
            this.button = new MajMinButton(this.major, this);
            this.parent.append(this.button.el);
        }
        else {
            // load existing wheel if it exists
            if (this.wheel) this.parent.append(this.wheel.el);
            if (this.button) this.parent.append(this.button.el);
        }  

        // generate staff
        const staff = new Staff(this.major, this.startNote, this);
        this.parent.append(staff.el);
        
        // generate code block
        const code = new CodeBlock(this.major, this.startNote, this);
        this.parent.append(code.el);
    }
}

class MajMinButton {
    /// link back to the entire interactive to generate events
    scale : Scale; 

    // x-coord of button
    get x() : number { return 2; }
    // y-coord of button
    get y() : number { return 2; }
    // height of button
    get height() : number { return 10; }
    // width of button
    get width() : number { return 26; }

    /// visual element for SVG
    el = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    /// is the interactive displaying major scales (default)?
    private major : boolean;

    constructor(major : boolean, scale : Scale) {
        this.major = major;
        this.scale = scale;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rect.setAttribute("x", `${this.x}`);
        rect.setAttribute("y", `${this.y}`);
        rect.setAttribute("width", `${this.width}`);
        rect.setAttribute("height", `${this.height}`);
        rect.setAttribute("rx", "2");
        rect.setAttribute("ry", "2");
        rect.setAttribute("fill", "black");
        rect.setAttribute("fill-opacity", "0.3");
        rect.classList.add("button");
        this.el.append(rect);

        const t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        t.classList.add("button-text");
        t.setAttribute("x", `${(this.x + this.width) - (this.width / 2)}`);
        t.setAttribute("y", `${(this.y + this.height) - (this.height / 2)}`);
        t.setAttribute("dominant-baseline", "central");
        t.innerHTML = this.major ? "Major Scales" : "minor scales";
        this.el.append(t);

        // set up mouse events
        this.el.addEventListener('click', (e) => {
            this.major = !this.major;
            t.innerHTML = this.major ? "Major Scales" : "minor scales";
            scale.update(this.major, null);
        });
    }
}

class NoteWheel {
    /// link back to the interactive to generate events
    scale : Scale;

    /// scale notes
    static readonly NOTES = [ "C", "D", "E", "F", "G", "A", "B" ];

    /// center x-coord of wheel
    get cx() : number { return 50; }
    /// center y-coord of wheel
    get cy() : number { return 39; }
    /// radius of wheel
    get r() : number { return 25; }
    /// num of sectors
    get numSectors() : number { return 7; }
    /// angle of each sector
    get angle() : number { return (360 / this.numSectors) * (Math.PI / 180); }
    /// offset angle
    get offset() : number { return 12.83 * (Math.PI / 180); }
    /// picker coords
    get pickerCoords() : number[][] { return [[50,18], [47,11], [53,11]]; }
    
    /// visual element for SVG
    el = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    /// wheel element
    wheel = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    /// wheel text
    text = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    /// is mouse down?
    private down : boolean = false;
    /// total angle of rotation by user
    // private totalAngle : number = 0;

    constructor(major : boolean, startNote : number, scale : Scale){
        this.scale = scale;
        
        // note that starts on offset angle is note after starting note
        let currNote = startNote + 1;
        let noteLetter;
        for (let i = 0; i < this.numSectors; i++) {
            noteLetter = NoteWheel.NOTES[(currNote + 7) % 7];
            const leftX = this.r * Math.cos(this.angle * (i + 1) + this.offset) + this.cx;
            const leftY = Math.abs(this.r * Math.sin(this.angle * (i + 1) + this.offset) - this.cy);
            const rightX = this.r * Math.cos(this.angle * i + this.offset) + this.cx;
            const rightY = Math.abs(this.r * Math.sin(this.angle * i + this.offset) - this.cy);

            const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d", `M ${this.cx} ${this.cy} 
                L ${leftX} ${leftY}
                A ${this.r} ${this.r} 0 0 1 ${rightX} ${rightY}
                L ${this.cx} ${this.cy}`);
            path.classList.add("wheel");
            path.classList.add(noteLetter);
            path.classList.add("note");
            this.wheel.append(path);

            const t = document.createElementNS("http://www.w3.org/2000/svg", 'text');

            t.setAttribute("x", `${(leftX + rightX + this.cx) / 3}`);
            t.setAttribute("y", `${((leftY + rightY + this.cy)) / 3}`);
            t.setAttribute("dominant-baseline", "central");
            t.innerHTML = `${noteLetter}`;
            if (major) t.classList.add("major-text");
            else t.classList.add("minor-text");
            t.classList.add("wheel-text");
            this.text.append(t);

            currNote--;
        }
        this.wheel.append(this.text);
        this.el.append(this.wheel);

        // add picker
        const picker = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        picker.setAttribute("points", `${this.pickerCoords[0][0]} ${this.pickerCoords[0][1]}, 
            ${this.pickerCoords[1][0]} ${this.pickerCoords[1][1]}, 
            ${this.pickerCoords[2][0]} ${this.pickerCoords[2][1]}`);
        picker.setAttribute("fill", "grey");
        picker.setAttribute("fill-opacity", "0.8");
        this.el.append(picker);

        let downX = -1;
        let downY = -1;
        let totalAngle = 0;
        let lastAngle = 0;
        this.el.addEventListener('pointerdown', (e) => {
            this.down = true;
            downX = e.clientX;
            downY = e.clientY;
        });

        document.addEventListener('pointermove', (e) => {
            if(this.down){ 
                // rotate wheel
                const center = this.svgToScreen(this.cx, this.cy);

                const deltaX = center.x - e.clientX;
                const deltaY = center.y - e.clientY;

                totalAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - lastAngle;

                this.wheel.setAttribute("transform", `rotate(${totalAngle} ${this.cx} ${this.cy})`);
                
                const letters = this.wheel.querySelectorAll('.wheel-text');
                letters?.forEach((letter) => {
                    letter.setAttribute("transform", `rotate(${-totalAngle} 
                        ${letter.getAttribute("x")} 
                        ${letter.getAttribute("y")})`);
                })
            }

            // determine current note
            const testPoint = this.svgToScreen(50, 18);
            let sectors = this.scale.root.elementsFromPoint(testPoint.x, testPoint.y);
            sectors = sectors.filter((sector) => sector.classList.contains('wheel'));
            if (sectors.length > 0) {
                scale.update(null, sectors[0].classList.item(1));
            }
        });

        document.addEventListener('pointerup', (e) => {
            if (this.down) {
                this.down = false;
            }
            const center = this.svgToScreen(this.cx, this.cy);

            const deltaX = center.x - e.clientX;
            const deltaY = center.y - e.clientY;

            lastAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        });
    }

    /**
     * Transform svg coordinates to screen coordinates
     */
    svgToScreen(svgX : number, svgY : number) {
        const svg = this.scale.container!;
        const p = svg.createSVGPoint();
        p.x = svgX;
        p.y = svgY;
        return p.matrixTransform(svg.getScreenCTM() ?? undefined);
    }
}

class Staff {
    /// link back to the entire interactive to generate events
    scale : Scale; 

    /// scale notes
    static readonly NOTES = ["C", "D", "E", "F", "G", "A", "B"];
    
    /// y-coord of highest staff line
    get max() : number { return 70; }
    /// y-coord of lowest staff line
    get min() : number { return this.max + 3.25 * 4; }

    /// starting coords for first note 
    get x0() : number { return 18; }
    get y0() : number { return 86; }
    
    /// visual element for SVG
    el = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    /// visual staff element for SVG
    staff = document.createElementNS("http://www.w3.org/2000/svg", 'g');

    constructor(major : boolean, startNote : number, scale : Scale){
        this.scale = scale;

        // create staff
        for (let i = 0; i < 5; i++) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            let y = this.max + 3.25 * i;
            line.setAttribute("x1", "0");
            line.setAttribute("y1", `${y}`);
            line.setAttribute("x2", "100");
            line.setAttribute("y2", `${y}`);
            line.classList.add("lines");
            this.staff.append(line);
        }

        const clef = document.createElementNS("http://www.w3.org/2000/svg", 'image');
        clef.setAttribute("href", "/assets/images/treble_clef.png");
        clef.setAttribute("x", "0");
        clef.setAttribute("y", "64");
        clef.setAttribute("width", "15");
        clef.setAttribute("height", "25");
        this.staff.append(clef);
        this.el.append(this.staff);

        // create scale

        /// y-coord range of staff and center of staff for stems/ledger lines
        let staffMin = this.min + 2;
        let staffMax = this.max - 2;
        let staffCenter = (staffMin + staffMax) / 2;
        
        let currNote = startNote;
        let noteLetter;
        for (let i = 0; i < 8; i++) {
            /// visual note element for SVG
            const note = document.createElementNS("http://www.w3.org/2000/svg", 'g');

            const ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            noteLetter = Staff.NOTES[(currNote + 7) % 7];

            // coords of note
            let x = this.x0 + 11 * (currNote - startNote);
            let y = this.y0 - 1.6 * currNote;

            ellipse.setAttribute("cx", `${x}`);
            ellipse.setAttribute("cy", `${y}`);
            ellipse.setAttribute("rx", "2");
            ellipse.setAttribute("ry", "1.2");
            ellipse.setAttribute("transform", `rotate(-18, ${x}, ${y})`);
            note.append(ellipse);

            const stem = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            // line points up if note below staff center, down if above
            if (y > staffCenter) {
                stem.setAttribute("x1", `${x + 1.9}`);
                stem.setAttribute("y1", `${y - 0.8}`);
                stem.setAttribute("x2", `${x + 1.9}`);
                stem.setAttribute("y2", `${y - 9.5}`);
            }
            else {
                stem.setAttribute("x1", `${x - 1.9}`);
                stem.setAttribute("y1", `${y + 0.8}`);
                stem.setAttribute("x2", `${x - 1.9}`);
                stem.setAttribute("y2", `${y + 9.5}`);
            }
            note.append(stem);

            // add ledger line if note above/below staff
            if (y > staffMin || y < staffMax) {
                const ledger = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                ledger.setAttribute("x1", `${x - 3}`);
                ledger.setAttribute("x2", `${x + 2.7}`);

                // placement of ledger line depending if on or between lines
                if (currNote % 2 == 0){
                    ledger.setAttribute("y1", `${y + 0.25}`);
                    ledger.setAttribute("y2", `${y + 0.25}`);
                }
                else {
                    // add line above/below note depending on if above/below staff
                    if (y < staffMax) {
                        ledger.setAttribute("y1", `${y + 1.25}`);
                        ledger.setAttribute("y2", `${y + 1.25}`);
                    }
                    else {
                        ledger.setAttribute("y1", `${y - 1.25}`);
                        ledger.setAttribute("y2", `${y - 1.25}`);
                    }
                }
                note.append(ledger);
            }

            // add accidentals if necessary
            switch (noteLetter) {
                case "C":
                    switch (startNote) {
                        case 1: // D Major
                        case 2: // E Major
                        case 5: // A Major
                            if (major) note.append(this.drawSharp(x, y));
                            break;
                        case 6: // B Major & minor
                            note.append(this.drawSharp(x, y));
                            break;
                    }
                    break;
                case "D": 
                    switch (startNote) {
                        case 2: // E Major
                        case 6: // B Major
                            if (major) note.append(this.drawSharp(x, y));
                            break;
                        case 3: // f minor
                            if (!major) note.append(this.drawFlat(x, y));
                    }
                    break;
                case "E": 
                    switch (startNote) {
                        case 0: // c minor
                        case 3: // f minor
                        case 4: // g minor
                            if (!major) note.append(this.drawFlat(x, y));
                            break;
                    }
                    break;
                case "F": 
                    switch (startNote) {
                        case 1: // D Major
                        case 4: // G Major
                        case 5: // A Major
                            if (major) note.append(this.drawSharp(x, y));
                            break;
                        case 2: // E Major & minor
                        case 6: // B Major & minor
                            note.append(this.drawSharp(x, y));
                            break;
                    }
                    break;
                case "G": 
                    switch (startNote) {
                        case 2: // E Major
                        case 5: // A Major
                        case 6: // B Major
                            if (major) note.append(this.drawSharp(x, y));
                            break;
                    }
                    break;
                case "A": 
                    switch (startNote) {
                        case 6: // B Major
                            if (major) note.append(this.drawSharp(x, y));
                            break;
                        case 0: // c minor
                        case 3: // f minor
                            if (!major) note.append(this.drawFlat(x, y));
                            break;
                    }
                    break;
                case "B": 
                    switch (startNote) {
                        case 0: // c minor
                        case 1: // d minor
                        case 4: // g minor
                            if (!major) note.append(this.drawFlat(x, y));
                            break;
                        case 3: // F Major & minor
                            note.append(this.drawFlat(x, y));
                            break;
                    }
                    break;
            }

            // add step markers unless on last note
            if (i != 7){
                const step = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                // if major, half steps on 3rd and 6th notes
                if (major) {
                    if (i == 2 || i == 6) {
                        step.classList.add("half");
                    }
                    else {
                        step.classList.add("whole");
                    }
                }
                // if minor, half steps on 2nd and 5th notes
                else {
                    if (i == 1 || i == 4) {
                        step.classList.add("half");
                    }
                    else {
                        step.classList.add("whole");
                    }
                }
                step.setAttribute("points", `${x + 0.6} ${y + 2.2}, 
                    ${x + 5.5} ${y + 6}, 
                    ${x + 5.5} ${y + 6}, 
                    ${x + 10.4} ${y + 0.6}`);
                this.el.append(step);
            }

            note.classList.add("staff");
            note.classList.add(noteLetter);
            if(i == 0) note.classList.add("first");
            else if(i == 7) note.classList.add("last");
            note.classList.add("note");
            this.el.append(note);

            currNote++;
        }
    }

    drawSharp(cx : number, cy : number) {
        const sharp = document.createElementNS("http://www.w3.org/2000/svg", 'g');

        const xLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        const xLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        const yLine1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        const yLine2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        // top horizontal line
        xLine1.setAttribute("x1", `${cx - 5}`);
        xLine1.setAttribute("y1", `${cy + 1}`);
        xLine1.setAttribute("x2", `${cx - 3}`);
        xLine1.setAttribute("y2", `${cy - 1}`);
        sharp.append(xLine1);

        // bottom horizontal line
        xLine2.setAttribute("x1", `${cx - 5}`);
        xLine2.setAttribute("y1", `${cy + 3}`);
        xLine2.setAttribute("x2", `${cx - 3}`);
        xLine2.setAttribute("y2", `${cy + 1}`);
        sharp.append(xLine2);

        // left vertical line
        yLine1.setAttribute("x1", `${cx - 4.35}`);
        yLine1.setAttribute("y1", `${cy + 4.5}`);
        yLine1.setAttribute("x2", `${cx - 4.35}`);
        yLine1.setAttribute("y2", `${cy - 1.5}`);
        sharp.append(yLine1);

        // right vertical line
        yLine2.setAttribute("x1", `${cx - 3.55}`);
        yLine2.setAttribute("y1", `${cy + 3.5}`);
        yLine2.setAttribute("x2", `${cx - 3.55}`);
        yLine2.setAttribute("y2", `${cy - 2.5}`);
        sharp.append(yLine2);

        return sharp;
    }
    
    drawFlat(cx : number, cy : number) {
        const flat = document.createElementNS("http://www.w3.org/2000/svg", 'g');

        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        const curve = document.createElementNS("http://www.w3.org/2000/svg", 'path');

        line.setAttribute("x1", `${cx - 4.35}`);
        line.setAttribute("y1", `${cy + 1.5}`);
        line.setAttribute("x2", `${cx - 4.35}`);
        line.setAttribute("y2", `${cy - 4.5}`);
        flat.append(line);

        curve.setAttribute("d", `M ${cx - 4.35} ${cy} A 2.5 0.5 -45 0 1 ${cx - 4.35} ${cy + 1.5}`);
        curve.setAttribute("fill", "none");
        flat.append(curve); 

        return flat;
    }
}

class CodeBlock {
    /// link back to the entire interactive to generate events
    scale : Scale; 

    /// scale notes
    static readonly NOTES = ["C", "D", "E", "F", "G", "A", "B"];

    // x-coord of block
    get x() : number { return 31; }
    // y-coord of block
    get y() : number { return 97; }
    // height of block
    get height() : number { return 44.5; }
    // width of block
    get width() : number { return 38; }

    /// visual element for SVG
    el = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    /// main rectangle
    rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    constructor(major : boolean, startNote : number, scale : Scale) {
        this.scale = scale;
        
        this.rect.setAttribute("x", `${this.x}`);
        this.rect.setAttribute("y", `${this.y}`);
        this.rect.setAttribute("width", `${this.width}`);
        this.rect.setAttribute("height", `${this.height}`);
        this.rect.setAttribute("rx", "2");
        this.rect.setAttribute("ry", "2");
        this.rect.setAttribute("fill", "black");
        this.rect.setAttribute("fill-opacity", "0.7");
        this.el.append(this.rect);

        let currNote = startNote;
        let noteNum = startNote + 60;
        for (let i = 0; i < 8; i++){
            const t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            t.setAttribute("x", `${(this.x + this.width) - (this.width / 2) + 0.7}`);
            t.setAttribute("y", `${this.y + 5 + i * 5}`);
            t.setAttribute("dominant-baseline", "central");
            
            t.innerHTML = `playNote(${noteNum})`;
            Scale.MIDI[i] = noteNum;
            // if major, half steps on 3rd and 6th notes
            if (major) {
                if (i == 2 || i == 6) noteNum += 1;
                else noteNum += 2;
            }
            // if minor, half steps on 2nd and 5th notes
            else {
                if (i == 1 || i == 4) noteNum += 1;
                else noteNum += 2;
            }
            t.classList.add("code");
            t.classList.add(CodeBlock.NOTES[(currNote + 7) % 7]);
            if(i == 0) t.classList.add("first");
            else if(i == 7) t.classList.add("last");
            t.classList.add("note");
            this.el.append(t);

            currNote++;
        }
    }
}

