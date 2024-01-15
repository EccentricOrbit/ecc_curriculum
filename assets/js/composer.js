/**
 * This class synchronizes and manages all of the sequencers on the page.
 * Add data-state attribute to HTML 
 */
class Composer {

    constructor(container, config) {
        this.bpm = 100;
        this.context = null;
        this.stateId = container.getAttribute('data-state');
        this.start_time = 0;
        this.start_beat = 0;
        this.sequencers = [];
        container.querySelectorAll('.instrument').forEach((i) => {
            this.sequencers.push(new Sequencer(this, i, config));
        });
        this.loadState();
        this.sequencers.forEach(s => s.redraw());
        this.sequencers.forEach(s => s.loadTracks(false));
        this.sequencers.forEach(s => s.updateCodeHint());

        // start the audio context on the first click
        document.addEventListener("click", (e) => { this.initAudio(); }, {once : true});
        setTimeout(() => { this.initAudio(); }, 100);
    }

    /**
     * How many beats have elapsed since the last time STOP was pressed
     */
    get currentBeat() {
        let b = (this.context.currentTime - this.start_time) * this.bpm / 60.0;
        return b + this.start_beat;
    }

    
    sequencerPlayed() {
        // if no sequencers are already playing
        if (!this.isPlaying) {
            this.start_time = this.context.currentTime;
        }
    }
    
    // called from a local sequencer
    sequencerPaused() {
        // if all sequencers have stopped
        if (!this.isPlaying) {
            this.start_beat = this.currentBeat;
        }
    }
    
    stopAll() {
        this.start_beat = 0;
        this.sequencers.forEach(s => s.stopped());
    }


    get isPlaying() {
        if (this.context === null) return false;
        for (let s of this.sequencers) {
            if (s.isPlaying) return true;
        }
        return false;
    }

    saveState() {
        let state = {
            'bpm' : `${this.bpm}`,
            'sequencers' : { }
        };
        for (let s of this.sequencers) {
            state['sequencers'][s.stateId] = s.save();
        }
        localStorage.setItem(this.stateId, JSON.stringify(state));
    }
    
    loadState() {
        const s = localStorage.getItem(this.stateId);
        if (s !== null) {
            const state = JSON.parse(s);
            if (state instanceof Object && state['sequencers'] instanceof Object)  {
                let tempo = state['bpm'];
                if (isNaN(tempo)) {
                    this.setTempo(100);
                } else {
                    this.setTempo(parseInt(tempo));
                }
                for (let seq of this.sequencers) {
                    if (state['sequencers'][seq.stateId] instanceof Object) {
                        seq.load(state['sequencers'][seq.stateId]);
                    }
                }
            }
        }
    }
    
    initAudio() {
        if (this.context === null) {
            this.context = new AudioContext();
            this.sequencers.forEach(s => s.initAudio(this.context));
        }
    }

    setTempo(newBPM) {
        newBPM = Math.min(300, Math.max(newBPM, 5));
        if (this.isPlaying) {
            this.start_beat = this.currentBeat;
            this.start_time = this.context.currentTime;
        }
        this.bpm = newBPM;
        this.sequencers.forEach((s) => { s.tempoChange(); });
    }
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
            if (this.startBeat === 0 && delayBeats === 0 && offsetBeats === 0) {
                this.playSound(dest, when);
            }
            else if (delayBeats > 0) {
                when = when + (this.startBeat + delayBeats) * 60 / this.sequencer.bpm;
                this.playSound(dest, when);
            } 
            else if (offsetBeats >= 0 && this.startBeat > offsetBeats) {
                when = when + (this.startBeat - offsetBeats) * 60 / this.sequencer.bpm;
                this.playSound(dest, when);
            }
        }
    }

    previewSound() {
        this.cancelSound();
        if  (this.audioCtx != null) {
            let when = this.audioCtx.currentTime;
            this.playSound(this.audioCtx.destination, when);
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

    constructor(composer, container, config) {
        this.container = container;
        this.composer = composer;       // main composer object that maintains clock and Tempo
        this.config = config;
        this.stateId = this.container.getAttribute('data-state');

        this.steps = 16;                // how many steps in the sequence (columns)
        this.voiceIndex = 0;            // selects which voice

        this.master = null;             // GainNode
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

        this.loadTracks(false);
        this.redraw();
        this.setPlayhead(0);

        this.isPlaying = false;
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
        const menu = this.container.querySelector('.voice-menu');
        let index = 0;
        for (let c of this.config['voices']) {
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
        this.container.querySelector('.stop-button').addEventListener('click', (e) => this.composer.stopAll());
        this.container.querySelector('.clear-button').addEventListener('click', (e) => this.clear());
        this.container.querySelector('.bars-up').addEventListener('click', (e) => this.incrementMeasures());
        this.container.querySelector('.bars-down').addEventListener('click', (e) => this.decrementMeasures());
        this.container.querySelector('.copy-code-button').addEventListener('click', (e) => this.copyCode());
        bindSpinnerButton(this.container.querySelector('.tempo-up'),
                            () => this.increaseTempo(),
                            () => this.mute(),
                            () => { this.unmute(); this.composer.saveState(); });
        bindSpinnerButton(this.container.querySelector('.tempo-down'), 
                            () => this.decreaseTempo(),
                            () => this.mute(),
                            () => { this.unmute(); this.composer.saveState(); });

        this.container.querySelector('.tempo .value').addEventListener('blur', (e) => {
            let t = parseInt(e.target.innerHTML);
            this.composer.setTempo( isNaN(t) ? this.bpm : t );
        });
        this.container.querySelector('.tempo .value').addEventListener('keypress', (e) => {
            if (e.charCode === 13) e.target.blur();
        });
        this.updateCodeHint();
    }

    get context() { return this.composer.context; }
    get bpm() { return this.composer.bpm; }
    get measures() { return Math.round(this.steps / this.stepsPerMeasure); }
    get stepsPerBeat() { return 4; }
    get beatsPerMeasure() { return 4; }
    get stepsPerMeasure() { return this.stepsPerBeat * this.beatsPerMeasure; }
    get maxMeasures() { return 3; }
    get width() { return this.container.getBoundingClientRect().width; }
    get height() { return 300; }
    get voice() { return this.config['voices'][this.voiceIndex]; }
    get trackCount() { return this.voice['tracks'].length; }
    get headerWidth() { return 150; }
    get headerHeight() { return 40; }
    get cellWidth() { return (this.width - this.headerWidth - this.measures * 4) / this.steps; }
  
    get cellHeight() { return (this.height - this.headerHeight) / this.trackCount; }
    get totalBeats() { return this.steps / 4.0; }


    incrementMeasures() {
        if (this.measures < this.maxMeasures) {
            this.steps = (this.measures + 1) * this.stepsPerMeasure;
            this.composer.stopAll();
            this.redraw();
            this.composer.saveState();
            this.updateCodeHint();
        }
    }

    decrementMeasures() {
        if (this.measures > 1) {
            this.steps = (this.measures - 1) * this.stepsPerMeasure;
            this.composer.stopAll();
            this.redraw();
            this.composer.saveState();
            this.updateCodeHint();
        }
    }

    increaseTempo() {
        this.composer.setTempo(this.bpm + 1);
    }

    decreaseTempo() {
        this.composer.setTempo(this.bpm - 1);
    }

    redraw() {
        this.parent.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        this.buildTimeline();
        this.drawGrid();
        this.cells.forEach(cell => cell.reposition());
        this.container.querySelector(".bars .value").innerHTML = `${this.measures}`;
        this.container.querySelector(".bars .units").innerHTML = this.measures > 1 ? "bars" : "bar";
        this.container.querySelector(".tempo .value").innerHTML = `${this.bpm}`;
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

    updateVoiceMenu() {
        this.container.querySelectorAll('.voice-menu option').forEach((opt) => {
            if (opt.getAttribute("data-index") === `${this.voiceIndex}`) {
                opt.setAttribute("selected", "true");
            } else {
                opt.removeAttribute('selected');
            }
        });
    }

    changeVoice(index) {
        this.voiceIndex = Math.max(0, Math.min(index, this.config['voices'].length));
        this.loadTracks(true);
        this.redraw();
        this.composer.saveState();
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

    save() {
        let state = [ ];
        for (let cell of this.cells) { state.push(cell.save()); }
        let config_state = {};
        config_state['steps'] = this.steps;
        config_state['cells'] = state;
        config_state['voiceIndex'] = this.voiceIndex;
        return config_state;
    }

    load(state) {
        if (state instanceof Object && state['cells'] instanceof Array)  {
            this.steps = parseInt(state['steps']);
            let vi = parseInt(state['voiceIndex']);
            if (isNaN(vi)) vi = 0;
            if (vi != this.voiceIndex) {
                this.voiceIndex = vi;
                this.updateVoiceMenu();
                this.loadTracks(true);
            }
            if (isNaN(this.steps)) this.steps = 16;

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
            this.composer.sequencerPlayed();
            this.isPlaying = true;
            this.container.querySelector('.play-button').classList.add('hidden');
            this.container.querySelector('.pause-button').classList.remove('hidden');
            this.looped = false;
            this.last_beat = this.composer.currentBeat % this.totalBeats;
            this.setPlayhead(this.last_beat);

            if (this.master) this.master.disconnect();
            this.master = null;
            this.master = this.context.createGain();
            this.master.gain.value = 1.0;
            this.master.connect(this.context.destination);

            if (this.last_beat < (this.totalBeats - 0.5)) {
                this.cueSounds(0, this.last_beat);
            }
            this.animate();
        }
    }

    pause() {
        this.isPlaying = false;
        this.composer.sequencerPaused();
        this.container.querySelector('.play-button').classList.remove('hidden');
        this.container.querySelector('.pause-button').classList.add('hidden');
        this.master.gain.setValueAtTime(0.0, 0.1);
    }

    stopped() {
        this.isPlaying = false;
        this.pause();
        this.setPlayhead(0);
        this.container.querySelector('.scroll-container').scrollTo(0, 0);
    }

    clear() {
        for (let cell of this.cells) {
            cell.stopSound();
            cell.group.remove();
        }
        this.cells = [];
        this.composer.saveState();
    }

    mute() {
        if (this.master !== null) {
            this.master.gain.setValueAtTime(0.0, 0.1);
        }
    }

    unmute() {
        if (this.master !== null) {
            this.master.gain.setValueAtTime(1.0, 0.1);
        }
    }

    tempoChange() {
        if (this.isPlaying && this.master !== null) {
            this.cells.forEach(cell => cell.stopSound());

            let beat = this.composer.currentBeat % this.totalBeats;
            if (beat < (this.totalBeats - 0.5)) {
                this.cueSounds(0, this.last_beat);
            }
            else {
                this.cueSounds(this.totalBeats - beat, 0);
            }
        }
        this.container.querySelector(".tempo .value").innerHTML = `${this.bpm}`;
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
        this.composer.saveState();
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
        this.composer.saveState();
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

    generateCode() {
        let code = "";

        // super inefficient!!
        for (let row = 0; row < this.trackCount; row++) {
            let rest = 0;
            let header = false;

            for (let col = 0; col < this.steps; col++) {
                for (let cell of this.cells) {
                    if (cell.track === row && cell.start === col) {
                        if (!header) {
                            code += "# " + this.tracks[row].name + "\n";
                            code += "moveTo(0)\n";
                            header = true;
                        }

                        if (rest > 0) code += `rest(${rest})\n`;
                        rest = -0.25;
                        code += cell.codeHint() + "\n";
                    }
                }
                rest += 0.25;
            }
            if (header) code += " \n";
        }
        return code;
    }

    updateCodeHint() {
        let code = this.generateCode();
        let lines = code.split('\n');
        code = '';
        for (let line of lines) {
            code += '<code>' + line + '<\code>\n';
        }
        this.codeHint.innerHTML = code;
        this.container.querySelector('.copy-code-button').innerHTML = 'Copy to Clipboard';
        Prism.highlightAll();
    }

    copyCode() {
        let code = this.generateCode();
        navigator.clipboard.writeText(code);
        this.container.querySelector('.copy-code-button').innerHTML = 'Copied';
    }


    async initAudio(ac) {
        if (ac != null) {
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


function bindSpinnerButton(button, spinAction, pressAction, releaseAction) {
    if (button != null) {
        let down = false;
        let hold = null;
        let spin = null;

        button.addEventListener('pointerup', (e) => {
            if (down) releaseAction();
            down = false;
            clearTimeout(hold);
            clearInterval(spin);
        });
        button.addEventListener('pointerleave', (e) => {
            if (down) releaseAction();
            down = false;
            clearTimeout(hold);
            clearInterval(spin);
        });

        button.addEventListener('pointerdown', (e) => {
            clearTimeout(hold);
            clearInterval(spin);

            if (!down) pressAction();
            spinAction();
            down = true;

            hold = setTimeout(() => {
                spin = setInterval(() => {
                    if (down) {
                        spinAction();
                    } else {
                        clearInterval(spin);
                    }
                }, 50);
            }, 500);
        });
    }
}