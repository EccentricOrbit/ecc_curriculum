/*
TODO: Config object in HTML instead of here
Pass config to Sequencer
Tempo change
Save state identifier comes from REQUEST
Cue sounds when adding new note if isPlaying
Pause restart
Gain in configs for snare
*/


const drum_configs = {
    'instrument' : 'drums',
    'note-class' : 'drum',
    'configs': [ 
        {
            'name' : '808 Drumkit',
            'tracks' : [
                { 'name' : 'Tom', 'note' : 7, 'track' : 0, 'sound' : '/sounds/voices/808-drums/tom2' },
                { 'name' : 'Clap', 'note' : 10, 'track' : 1, 'sound' : '/sounds/voices/808-drums/clap' },
                { 'name' : 'Closed Hat', 'note' : 4, 'track' : 2, 'sound' : '/sounds/voices/808-drums/hihat' },
                { 'name' : 'Open Hat', 'note' : 5, 'track' : 3, 'sound' : '/sounds/voices/808-drums/openhat' },
                { 'name' : 'Snare', 'note' : 2, 'track' : 4, 'gain' : 0.6, 'sound' : '/sounds/voices/808-drums/snare1' },
                { 'name' : 'Kick', 'note' : 0, 'track' : 5, 'sound' : '/sounds/voices/808-drums/kick2' }
            ]
        },
        {
            'name' : '909 Drumkit',
            'tracks' : [
                { 'name' : 'tom', 'note' : 7, 'track' : 0, 'sound' : '/sounds/voices/909-drums/mid_tom' },
                { 'name' : 'clap', 'note' : 10, 'track' : 1, 'sound' : '/sounds/voices/909-drums/clap' },
                { 'name' : 'hat', 'note' : 4, 'track' : 2, 'sound' : '/sounds/voices/909-drums/hat1' },
                { 'name' : 'open_hat', 'note' : 5, 'track' : 3, 'sound' : '/sounds/voices/909-drums/open_hat' },
                { 'name' : 'snare', 'note' : 2, 'track' : 4, 'sound' : '/sounds/voices/909-drums/snare1' },
                { 'name' : 'kick', 'note' : 0, 'track' : 5, 'sound' : '/sounds/voices/909-drums/kick2' }
            ]
        },
        {
            'name' : 'Rock Drumkit',
            'tracks' : [
                { 'name' : 'tom', 'note' : 7, 'track' : 0, 'sound' : '/sounds/voices/rock-drums/midTom' },
                { 'name' : 'clap', 'note' : 10, 'track' : 1, 'sound' : '/sounds/voices/rock-drums/clap' },
                { 'name' : 'hat', 'note' : 4, 'track' : 2, 'sound' : '/sounds/voices/rock-drums/closedHat' },
                { 'name' : 'open_hat', 'note' : 5, 'track' : 3, 'sound' : '/sounds/voices/rock-drums/openHat' },
                { 'name' : 'snare', 'note' : 2, 'track' : 4, 'sound' : '/sounds/voices/rock-drums/snare1' },
                { 'name' : 'kick', 'note' : 0, 'track' : 5, 'sound' : '/sounds/voices/rock-drums/kick' }
            ]
        }
    ]
};


window.onload = (e) => { new Composer(); };


/**
 * This class synchronizes and manages all of the sequencers on the page.
 */
class Composer {

    constructor() {
        this.bpm = 100;
        this.context = null;
        this.start_time = 0;
        this.sequencers = [];
        this.sequencers.push(new Sequencer(this, 'drums', drum_configs));
        this.loadState();

        // start the audio context on the first click
        document.addEventListener("click", (e) => { this.initAudio(); }, {once : true});
        setTimeout(() => { this.initAudio(); }, 100);
    }

    get currentBeat() {
        return (this.context.currentTime - this.start_time) * this.bpm / 60.0;
    }

    get isPlaying() {
        for (let s of this.sequencers) {
            if (s.isPlaying) return true;
        }
        return false;
    }

    saveState() {
        window.localStorage.setItem('bpm', `${this.bpm}`);
    }
    
    loadState() {
        let tempo = window.localStorage.getItem('bpm');
        if (isNaN(tempo)) {
            this.setTempo(100);
        } else {
            this.setTempo(parseInt(tempo));
        }
    }
    
    initAudio() {
        if (this.context === null) {
            this.context = new AudioContext();
            for (let s of this.sequencers) {
                s.initAudio(this.context);
            }
        }
    }
    
    play() {
        if (!this.isPlaying) {
            this.start_time = this.context.currentTime;
        }
    }
    
    pause() {
        if (this.isPlaying) {
            this.pauseAll();
        }
    }
    
    pauseAll() {
        for (let sequencer of this.sequencers) {
            sequencer.pause();
        }
    }
    
    stop() {
        for (let sequencer of this.sequencers) {
            sequencer.stop();
        }
    }

    setTempo(newBPM) {
        newBPM = Math.min(999, Math.max(newBPM, 5));
        if (this.isPlaying && this.context != null) {
            let last_beats = (this.context.currentTime - this.start_time) * this.bpm / 60;
            this.start_time = this.context.currentTime - last_beats * 60 / newBPM;
        }
        this.bpm = newBPM;
        this.sequencers.forEach((s) => { s.tempoChange(); });
        let bpmField = document.querySelector('#tempo-field');
        if (bpmField) { bpmField.value = `${newBPM}`; }
        this.saveState();
    }
    

/*
    /// bind tempo button event handlers
    _bindSpinnerButton(querySelector('#tempo-up') as ButtonElement?, () { setTempo(bpm + 1); }, () {});
    _bindSpinnerButton(querySelector('#tempo-down') as ButtonElement?, () { setTempo(bpm - 1); }, () {});

    InputElement? f = querySelector('#tempo-field') as InputElement?;
    if (f != null) {
      f.onKeyPress.listen((e) { if (e.keyCode == 13) f.blur(); });
      f.onBlur.listen((e) { setTempo(toInt(f.value, 120)); });
      f.onInput.listen((e) { f.value = f.value!.replaceAll(RegExp(r'[^0-9]'), ''); });
      f.innerHTML = '$bpm';
    }
  }
*/

}



/**
 * Represents a highlighted cell in the sequencer that will generate a sound
 */
class DrumCell {

    constructor(sequencer, start, track) {
        this.sequencer = sequencer;
        this.start = start;     /// start time as a step count (each step is 0.25 beats)
        this.end = start;       /// end time as step count (if end == start, the note is 0.25 beats long)
        this.track = track;     /// which track (row) is this note on
        this.velocity = 100;    /// loudness

        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.rect.classList.add('grid-note');
        this.group.append(this.rect);
        this.reposition();

        this._gain = null;    // GainNode

        this.rect.addEventListener("pointerdown", (e) => {
            this.velocity = 0;
            this.sequencer.removeNote(this);
            e.stopPropagation();
        });
    }

    get beats() { return (this.end - this.start + 1) * 0.25; }
    get startBeat() { return this.start * 0.25; }
    get endBeat() { return this.end * 0.25; }
    get audioCtx() { return this.sequencer.context; }

    save() {
        return {
            'start' : this.start,
            'end' : this.end,
            'track' : this.track,
            'velocity' : this.velocity
        };
    }

    load(state) {
        this.start = parseInt(state['start']);
        this.end = parseInt(state['end']);
        this.track = parseInt(state['track']);
        this.velocity = parseInt(state['velocity']);
        this.reposition();
    }


    cueSound(dest, delayBeats, offsetBeats) {
        if (dest !== null) {
            let when = this.audioCtx.currentTime;
            if (delayBeats > 0 || this.startBeat == 0) {
                when = when + (this.startBeat + delayBeats) * 60 / this.sequencer.bpm;
                this.playSound(dest, when);
            } else if (offsetBeats >= 0 && this.startBeat > offsetBeats) {
                when = when + (this.startBeat - offsetBeats) * 60 / this.sequencer.bpm;
                this.playSound(dest, when);
            }
        }
    }

    previewSound() {
        if (!this.sequencer.isPlaying) {
            this.cancelSound();
            if  (this.audioCtx != null) {
                let when = this.audioCtx.currentTime;
                this.playSound(this.audioCtx.destination, when);
            }
        }
    }

    playSound(dest = null, when = 0) {
        let sound = this.sequencer.trackBuffer(this.track);
        const gain = this.sequencer.trackGain(this.track);
        const ctx = this.audioCtx;
        if (ctx == null) return;
        if (dest == null) dest = this.audioCtx.destination;
        if (dest == null || sound == null) return;

        let R = 0.2;
        if (when == 0) when = ctx.currentTime;
        let duration = Math.max(0, (this.end - this.start + 1)) * 0.25 * 60 / this.sequencer.bpm;
        this._gain = ctx.createGain();
        this._gain.gain.value = (this.velocity / 120) * gain;
        this._gain.gain.setTargetAtTime(0, when + duration, 0.33 * R);

        const source = ctx.createBufferSource();
        source.buffer = sound;
        source.connect(this._gain);
        this._gain.connect(dest);
        source.start(when);
    }

    cancelSound() {
        if (this._gain !== null) {
            this._gain.gain.linearRampToValueAtTime(0, this.sequencer.context.currentTime + 0.25);
        }
    }

    stopSound() {
        if (this._gain !== null) {
            this._gain.gain.value = 0.0;
        }
    }

    reposition() {
        this.rect.setAttribute('x', `${this.sequencer.stepToX(this.start)}`);
        this.rect.setAttribute('y', `${this.sequencer.trackToY(this.track)}`);
        this.rect.setAttribute('width', `${this.sequencer.cellWidth}`);
        this.rect.setAttribute('height', `${this.sequencer.cellHeight}`);
    }

    codeHint() {
        let note = 0;
        if (this.track >= 0 && this.track <= this.sequencer.tracks.length) {
            note = this.sequencer.tracks[this.track].note;
        }

        if (this.velocity >= 100) {
            return `playNote(${note}, beats = ${this.beats})`;
        } else {
            return `playNote(${note}, beats = ${this.beats}, velocity = ${this.velocity})`;
        }        
    }
}


class Drum {

    constructor(config, sequencer) {
        this.name = config['name'];
        this.note = config['note'];
        this.track = config['track'];
        this.sound = config['sound'];
        this.gain = ('gain' in config) ? config['gain'] : 1.0;
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        this.text.setAttribute('x', `${sequencer.headerWidth - 15}`);
        this.text.setAttribute('y', `${sequencer.trackToY(this.track) + sequencer.cellHeight / 2}`);

        this.text.classList.add('drum-name');
        this.text.innerHTML = `${this.name} (${this.note})`;
        this.group.append(this.text);
        this.buffer = null;
    }
}


/**
 * Sequencer composer interface
 */
class Sequencer {

    constructor(composer, container_id, config) {
        this.container = document.getElementById(container_id);

        this.composer = composer;   /// main composer object that maintains clock and Tempo
        this.steps = 16;            /// how many steps in the sequence (columns)
        this.config = config;
        this.stateId = "demo-sequencer"; // TODO make this come from the URL request
        this.voiceIndex = 0;        /// selects which voice

        this.master = null;   // GainNode
        this.parent = this.container.querySelector('.sequencer'); // SVGSVGElement

        this.cellGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.gridGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.trackGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.timelineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.playhead = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        this.cellGroup.classList.add('cell-group');
        this.gridGroup.classList.add('grid-group');
        this.trackGroup.classList.add('track-group');
        this.timelineGroup.classList.add('timeline-group')
        this.playhead.classList.add('playhead');

        this.parent.append(this.trackGroup);
        this.parent.append(this.timelineGroup);
        this.parent.append(this.gridGroup);
        this.parent.append(this.cellGroup);
        this.parent.append(this.playhead);

        this.codeHint = this.container.querySelector('.code-hint'); // DivElement

        this.cells = [ ];    // List<DrumCell>
        this.tracks = [ ];   // List<Drum>();
        this.sounds = { };   // Map<String?, AudioBuffer>();
        this.loadState();
        this.loadTracks(false);
        this.redraw();
        this.setPlayhead(0);

        this.isPlaying = false;

        this.context = null;  // AudioContext
    
        this.looped = false;
        this.last_beat = 0;

        // Drag to paint notes
        this.dragging = false;
        this.parent.addEventListener('pointerdown', (e) => { this.dragging = true; });
        document.addEventListener('pointerup', (e) => { 
            this.dragging = false;
            setTimeout(() => { 
                if (this.updated) {
                    this.updated = false;
                    this.updateCodeHint();
                }
             }, 1000);
        });

        addEventListener('resize', (e) => { this.redraw() });


        // Build the instrument select menu
        const menu = this.container.querySelector('#voice-menu');
        let index = 0;
        for (let c of drum_configs['configs']) {
            let opt = document.createElement('option');
            opt.innerHTML = c['name'];
            opt.setAttribute("data-index", `${index}`);
            if (index === this.voiceIndex) {
                opt.setAttribute("selected", "true");
            }
            index++;
            menu.appendChild(opt);     
        }
        menu.addEventListener('change', (e) => {
            const opt = menu.options[menu.selectedIndex];
            index = parseInt(opt.getAttribute("data-index"));
            this.changeVoice(index);
        });


        // Activate buttons
        this.container.querySelector('.play-button').addEventListener('click', (e) => this.play());
        this.container.querySelector('.pause-button').addEventListener('click', (e) => this.pause());
        this.container.querySelector('.stop-button').addEventListener('click', (e) => this.stopAll());
        this.container.querySelector('.clear-button').addEventListener('click', (e) => this.clear());
        this.container.querySelector('.increment-button').addEventListener('click', (e) => this.incrementMeasures());
        this.container.querySelector('.decrement-button').addEventListener('click', (e) => this.decrementMeasures());

        this.updateCodeHint();
    }


    get bpm() { return this.composer.bpm; }
    get measures() { return Math.round(this.steps / this.stepsPerMeasure); }
    get stepsPerBeat() { return 4; }
    get beatsPerMeasure() { return 4; }
    get stepsPerMeasure() { return this.stepsPerBeat * this.beatsPerMeasure; }
    get maxMeasures() { return 3; }
    get width() { return this.container.getBoundingClientRect().width; }
    get height() { return 300; }
    get voice() { return this.config['configs'][this.voiceIndex]; }
    get trackCount() { return this.voice['tracks'].length; }
    get headerWidth() { return 150; }
    get headerHeight() { return 40; }
    get cellWidth() { return (this.width - this.headerWidth - this.measures * 4) / this.steps; }
  
    get cellHeight() { return (this.height - this.headerHeight) / this.trackCount; }
    get totalBeats() { return this.steps / 4.0; }


    incrementMeasures() {
        if (this.measures < this.maxMeasures) {
            this.steps = (this.measures + 1) * this.stepsPerMeasure;
            this.stop();
            this.redraw();
            this.saveState();
            this.updateCodeHint();
        }
    }

    decrementMeasures() {
        if (this.measures > 1) {
            this.steps = (this.measures - 1) * this.stepsPerMeasure;
            this.stop();
            this.redraw();
            this.saveState();
            this.updateCodeHint();
        }
    }

    changeVoice(index) {
        this.stop();
        this.voiceIndex = Math.max(0, Math.min(index, this.config['configs'].length));
        this.loadTracks(true);
        this.redraw();
        this.saveState();
    }

    redraw() {
        this.parent.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        console.log
        this.buildTimeline();
        this.drawGrid();
        this.cells.forEach(cell => cell.reposition());
    }

    async loadTracks(loadAudio) {
        this.tracks = [];
        this.trackGroup.innerHTML = '';
        for (let t of this.voice['tracks']) {
            let drum = new Drum(t, this);
            this.trackGroup.append(drum.group);
            this.tracks.push(drum)
            if (loadAudio) drum.buffer = await this.loadAudioBuffer(drum.sound);
        }
    }

    drawGrid() {
        this.gridGroup.innerHTML = '';
        for (let j=0; j<this.trackCount; j++) {
            for (let i=0; i<this.steps; i++) {

                let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('x', `${this.stepToX(i)}`);
                rect.setAttribute('y', `${this.trackToY(j)}`);
                rect.setAttribute('width', `${this.cellWidth}`);
                rect.setAttribute('height', `${this.cellHeight}`);
                rect.classList.add('grid-cell');
                
                if (Math.ceil((i+1) / 4) % 2 == 0) { 
                    rect.classList.add('darker');
                }

                rect.addEventListener('pointerdown', (e) => { this.addNote(i, j); });
                rect.addEventListener('pointerenter', (e) => { if (this.dragging) this.addNote(i, j); });
                this.gridGroup.append(rect);
            }
        }
    }

    saveState() {
        let state = [ ];
        for (let cell of this.cells) { state.push(cell.save()); }
        let config_state = {};
        config_state['steps'] = this.steps;
        config_state['cells'] = state;
        config_state['voiceIndex'] = this.voiceIndex;
        localStorage.setItem(this.stateId, JSON.stringify(config_state));
    }

    loadState() {
        const s = localStorage.getItem(this.stateId);
        if (s !== null) {
            const state = JSON.parse(s);
            if (state instanceof Object && state['cells'] instanceof Array)  {
                this.steps = parseInt(state['steps']);
                this.voiceIndex = parseInt(state['voiceIndex']);
                if (isNaN(this.steps)) this.steps = 16;
                if (isNaN(this.voiceIndex)) this.voiceIndex  = 0;

                this.cellGroup.innerHTML = '';
                this.cells = [ ];
                for (let m of state['cells']) {
                    let cell = new DrumCell(this, 0, 0);
                    cell.load(m);

                    if (cell.start+1 > this.steps) continue;
                    if (cell.track >= this.trackCount) continue;
                    this.cells.push(cell);
                    this.cellGroup.append(cell.group);
                }
            }
        }
    }

    trackToY(track) {
        return this.headerHeight + this.cellHeight * track;
    }

    yToTrack(y) {
        return Math.max(0, Math.min(this.trackCount - 1, (y - this.headerHeight) / this.cellHeight));
    }

    stepToX(step) {
        return this.headerWidth + this.cellWidth * step + (step / this.stepsPerMeasure) * 4;
    }

    beatsToX(beats) {
        return this.headerWidth + this.cellWidth * this.steps * beats / this.totalBeats;
    }

    xToStep(x) {
        return (x - this.headerWidth) / this.cellWidth;
    }

    trackBuffer(track) {
        return this.tracks[track].buffer;
    }

    trackGain(track) {
        return this.tracks[track].gain;
    }

    setPlayhead(beats) {
        this.playhead.setAttribute('x1', `${this.beatsToX(beats)}`);
        this.playhead.setAttribute('x2', `${this.beatsToX(beats)}`);
        this.playhead.setAttribute('y1', '0');
        this.playhead.setAttribute('y2', `${this.height}`);
        this.container.querySelector('.scroll-container').scrollTo((this.beatsToX(beats) - this.width), 0);
    }

    play() {
        if (!this.isPlaying && this.context !== null) {
            this.composer.play();
            this.isPlaying = true;
            this.container.querySelector('.play-button').classList.add('hidden');
            this.container.querySelector('.pause-button').classList.remove('hidden');
            this.looped = false;
            this.last_beat = this.composer.currentBeat % this.totalBeats;

            this.setPlayhead(this.last_beat);
            this.animate();
            if (this.master) this.master.disconnect();
            this.master = null;
            this.master = this.context.createGain();
            this.master.gain.value = 1.0;
            this.master.connect(this.context.destination);
            this.cueSounds(0, this.last_beat);
        }
    }

    pause() {
        if (this.isPlaying && this.context !== null) {
            this.container.querySelector('.play-button').classList.remove('hidden');
            this.container.querySelector('.pause-button').classList.add('hidden');
            this.isPlaying = false;
            this.master.gain.setValueAtTime(0.0, 0.1);
            this.composer.pause();
        }
    }

    stop() {
        this.pause();
        this.setPlayhead(0);
        this.container.querySelector('.scroll-container').scrollTo(0, 0);
    }

    clear() {
        this.stop();
        for (let cell of this.cells) {
            cell.stopSound();
            cell.group.remove();
        }
        this.cells = [];
        this.saveState();
    }

    stopAll() {
        this.composer.stop();
    }

    tempoChange() {
        if (this.isPlaying && this.master !== null) {
            this.cells.forEach((cell) => {
                cell.stopSound();
                cell.cueSound(this.master, 0, this.composer.currentBeat % this.totalBeats);
            });
        }
    }

    cueSounds(delayBeats, offsetBeats) {
        if (this.context != null && this.master != null) {
            for (let cell of this.cells) {
                if (cell.start+1 <= this.steps) {
                    cell.cueSound(this.master, delayBeats, offsetBeats);
                }
            }
        }
    }

    animate() {
        if (this.isPlaying && this.context != null) {
            let beat = this.composer.currentBeat % this.totalBeats;
            if (beat >= (this.totalBeats - 0.5) && !this.looped) {
                this.cueSounds(this.totalBeats - beat, 0);
                this.looped = true;
            }
            else if (this.last_beat > beat) {
                this.looped = false;
            }
            this.last_beat = beat;
            this.setPlayhead(beat);
            requestAnimationFrame(time => this.animate());
        }
    }

    // add beat labels
    buildTimeline() {
        this.timelineGroup.innerHTML = '';

        let cw = this.cellWidth;
        for (let i=0; i<this.steps; i++) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            text.setAttribute('x', `${this.stepToX(i) + cw/2}`);
            text.setAttribute('y', `${this.headerHeight / 2}`);
            text.classList.add('beat-number');
            if (i % 4 == 0) {
                text.innerHTML = `${1 + Math.round(i / 4)}`;
            } 
            else {
                text.innerHTML = '·';
            }
            this.timelineGroup.append(text);
        }
    }

    moveToTop(cell) {
        this.cellGroup.children.remove(cell.group);
        this.cellGroup.append(cell.group);
    }

    addNote(step, track) {
        let cell = new DrumCell(this, step, track);
        this.cells.push(cell);
        cell.previewSound();
        this.cellGroup.append(cell.group);
        if (this.isPlaying && this.master != null) {
            cell.cueSound(this.master, 0, this.composer.currentBeat % this.totalBeats);
        }
        this.saveState();
        this.updated = true;
    }


    rescheduleNote(cell) {
        if (this.isPlaying && this.master != null) {
            cell.cueSound(this.master, 0, this.composer.currentBeat % this.totalBeats);
        }
    }


    removeNote(cell) {
        cell.group.remove();
        this.cells = this.cells.filter(c => c !== cell);
        cell.cancelSound();
        this.saveState();
        this.updated = true;
    }


    removeOverlaps(cell) {
        for (let i=this.cells.length - 1; i >= 0; i--) {
            let c = cells[i];
            if (c != cell && c.overlaps(cell)) {
                this.removeNote(c);
            }
        }
    }


    updateCodeHint() {
        let code = "";

        // super inefficient!!
        for (let row = 0; row < this.trackCount; row++) {
            let rest = 0;

            code += "<code># " + this.tracks[row].name + "</code>\n";
            code += "<code>moveTo(0)</code>\n";
            for (let col = 0; col < this.steps; col++) {
                for (let cell of this.cells) {
                    if (cell.track === row && cell.start === col) {
                        if (rest > 0) code += `<code>rest(${rest})</code>\n`;
                        rest = -0.25;
                        code += '<code>' + cell.codeHint() + "</code>\n";
                    }
                }
                rest += 0.25;
            }
            code += "<code> </code>\n";
        }
        this.codeHint.innerHTML = code;
        Prism.highlightAll();
    }


    async initAudio(ac) {
        if (ac != null) {
            this.context = ac;
            for (let drum of this.tracks) {
                drum.buffer = await this.loadAudioBuffer(drum.sound);
            }
            this.master = this.context.createGain();
            this.master.gain.value = 0.0;
            this.master.connect(this.context.destination);
        }
        else { 
            console.log('null AC');
        }
    }

    /// asynchronously loads a sound from the given URL and uses name as the hash key
    async loadAudioBuffer(name) {
        if (this.sounds[name]) return this.sounds[name];
        if (this.context != null) {
            try {
                let response = await fetch(name + ".wav");
                let abuff = await response.arrayBuffer();
                let buffer = await this.context.decodeAudioData(abuff);
                this.sounds[name] = buffer;
                console.log("Loaded " + name + ".wav");
                return buffer;
            }
            catch (e) {
                console.log(e);
            }
        }
        return null;
    }


    /// returns true if the audio buffer has already been loaded
    hasSound(s) {
        return this.sounds[s] !== null;
    }


    /// returns a preloaded audio buffer or null if it doesn't exist
    getAudioBuffer(b) {
        return this.sounds[b];
    }

    screenToSVG(sx, sy) {
        let xform = this.parent.createSvgPoint();
        xform.x = sx;
        xform.y = sy;
        return xform.matrixTransform(this.parent.getScreenCtm().inverse());
    }

    svgToScreen(sx, sy) {
        let xform = this.parent.createSvgPoint();
        xform.x = sx;
        xform.y = sy;
        return xform.matrixTransform(this.parent.getScreenCtm());
    }
}
