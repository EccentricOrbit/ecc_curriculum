/**
 * This class synchronizes and manages all of the sequencers on the page.
 * For now there is only one instrument but this could be expanded.
 * 
 * TODO: Adding a beat while playhead is near the end of the loop won't play next time around
 */
class Composer {

    constructor(container, config) {
        // global tempo for all sequencers
        this.bpm = 100;

        // global audio context
        this.context = null;

        // different sequencers are stored in different local storage bins
        this.stateId = container.getAttribute('data-state');

        // global playhead location
        this.start_time = 0;
        this.start_beat = 0;

        // list of all sequencers (1 for now)
        this.sequencers = [];
        container.querySelectorAll('.instrument').forEach((i) => {
            this.sequencers.push(new Sequencer(this, i, config));
        });

        // initialize all sequencers
        this.loadState();
        this.sequencers.forEach(s => s.redraw());
        this.sequencers.forEach(s => s.updateCodeHint());

        // start the audio context on the first click or on timeout
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

    /**
     * Callback after user presses the PLAY button for any sequencer
     */
    sequencerPlayed() {
        // if no sequencers are already playing
        if (!this.isPlaying) {
            this.start_time = this.context.currentTime;
        }
    }
    
    /**
     * Callback after user presses PAUSE for any sequencer
     */
    sequencerPaused() {
        // if all sequencers have stopped
        if (!this.isPlaying) {
            this.start_beat = this.currentBeat;
        }
    }


    /**
     * Global STOP
     */
    stopAll() {
        this.sequencers.forEach(s => s.stopped());
        this.start_beat = 0;
    }

    /**
     * Are any sequencers playing?
     */
    get isPlaying() {
        if (this.context === null) return false;
        for (let s of this.sequencers) {
            if (s.isPlaying) return true;
        }
        return false;
    }

    saveState() {
        let state = {
            'bpm' : this.bpm,
            'sequencers' : { }
        };
        for (let s of this.sequencers) {
            state['sequencers'][s.stateId] = s.save();
        }
        localStorage.setItem(this.stateId, JSON.stringify(state));
    }

    
    loadState() {

        // create a default state object
        let state = {
            bpm: 100,
            sequencers: { }
        };
        for (let s of this.sequencers) {
            state.sequencers[s.stateId] = s.save();
        }

        // url query parameters
        const qParams = new URLSearchParams(window.location.search);

        // first get what's in localStorage unless we're embedded
        if (!qParams.has("embedded")) {
            try {
                const s = localStorage.getItem(this.stateId);
                if (s != null) {
                    const o = JSON.parse(s);
                    const bpm = parseInt(o.bpm);
                    if (Number.isInteger(bpm)) state.bpm = o.bpm;
                    if (o.sequencers instanceof Object) state.sequencers = o.sequencers;
                }
            }
            catch(err) { console.log(err); }
        }

        // next override with URL query params
        {
            const bpm = parseInt(qParams.get("bpm"));
            const voice = parseInt(qParams.get("voice"));
            const steps = parseInt(qParams.get("steps"));

            if (Number.isInteger(bpm)) state.bpm = bpm;

            for (let key in state.sequencers) {
                const seq = state.sequencers[key];
                if (Number.isInteger(voice)) seq.voiceIndex = voice;
                if (Number.isInteger(steps)) seq.steps = steps;
                for (const track of seq.tracks) {
                    const hexStr = qParams.get(`track${track.track}`);
                    if (hexStr) {
                        let pattern = hexToPattern(hexStr, seq.steps);
                        track.cells = pattern;
                    }
                }
            }
        }

        this.setTempo(state.bpm);

        for (let seq of this.sequencers) {
            if (state['sequencers'][seq.stateId] instanceof Object) {
                seq.load(state['sequencers'][seq.stateId]);
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

    constructor(track, start) {
        this.track = track;     /// which DrumTrack does this cell belong to
        this.start = start;     /// start time as a step count (each step is 0.25 beats)
        this.end = start;       /// end time as step count (if end == start, the note is 0.25 beats long)
        this.velocity = 0;      /// volume

        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.rect.classList.add('grid-note');
        this.group.append(this.rect);
        this.reposition();

        this._gain = null;    // GainNode

        this.rect.addEventListener("pointerdown", (e) => {
            this.setVelocity(this.velocity == 0 ? 100 : 0, true);
            this.track.onUpdate(this);
            if (this.velocity === 0) this.cancelSound();
            //e.stopPropagation();
        });
        this.rect.addEventListener('pointerenter', (e) => {
            if (e.buttons > 0 && this.velocity < 100) {
                this.setVelocity(100, true);
                this.track.onUpdate(this);
            }
        });
    }

    get bpm() { return this.track.bpm; }
    get beats() { return (this.end - this.start + 1) * 0.25; }
    get startBeat() { return this.start * 0.25; }
    get endBeat() { return this.end * 0.25; }
    get audioCtx() { return this.track.context; }
    get sound() { return this.track.buffer; }


    setVelocity(v, cue = false) {
        this.velocity = v;
        if (v > 0) {
            this.rect.classList.add('active');
            this.rect.setAttribute('fill-opacity', `${(this.velocity / 100)}`);
        } else {
            this.rect.classList.remove('active');
            this.rect.setAttribute('fill-opacity', '1.0');
        }
        if (cue) {
            if (this.velocity > 0) {
                this.previewSound();
                if (this.track.isPlaying) {
                    this.cueSound(this.track.master, 0, this.track.currentBeat);
                }
                else {
                    this.cancelSound();
                }
            }
        }
    }

    clear() {
        this.setVelocity(0, true);
    }

    save() {
        return this.velocity === 0 ? '-' : this.velocity >= 100 ? '!' : '*';
    }

    load(s) {
        const v = (s === '!') ? 100 : (s === '*') ? 60 : 0;
        this.setVelocity(v, false);
    }


    cueSound(dest, delayBeats, offsetBeats) {
        if (dest !== null) {
            let when = this.audioCtx.currentTime;

            // special case when play button is pressed the first time after a STOP event
            if (this.startBeat === 0 && delayBeats === 0 && offsetBeats === 0) {
                this.playSound(dest, when);
            }
            else if (delayBeats > 0) {
                when = when + (this.startBeat + delayBeats) * 60 / this.bpm;
                this.playSound(dest, when);
            } 
            else if (offsetBeats >= 0 && this.startBeat > offsetBeats) {
                when = when + (this.startBeat - offsetBeats) * 60 / this.bpm;
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
        const ctx = this.audioCtx;
        if (ctx === null) return;

        if (dest == null) dest = this.audioCtx.destination;
        const sound = this.track.buffer;
        if (dest === null || sound === null || this.velocity <= 0) return;

        const R = 0.2;
        const gain = this.track.gain;
        if (when == 0) when = ctx.currentTime;
        let duration = Math.max(0, (this.end - this.start + 1)) * 0.25 * 60 / this.bpm;
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
            this._gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.25);
        }
    }

    reposition() {
        this.rect.setAttribute('x', `${this.track.stepToX(this.start)}`);
        this.rect.setAttribute('y', `${this.track.trackY}`);
        this.rect.setAttribute('width', `${this.track.cellWidth}`);
        this.rect.setAttribute('height', `${this.track.cellHeight}`);
        if (this.velocity > 0) {
            this.rect.setAttribute('fill-opacity', `${(this.velocity / 100)}`);
            this.rect.classList.add('active');
        } else {
            this.rect.setAttribute('fill-opacity', '1.0');
            this.rect.classList.remove('active');
        }
        if (Math.ceil((this.start+1) / 4) % 2 == 0) { 
            this.rect.classList.add('darker');
        }
    }

    generateCode() {
        if (this.velocity >= 100) {
            return `playNote(${this.track.note}, beats = ${this.beats})\n`;
        }
        else if (this.velocity > 0) {
            return `playNote(${this.track.note}, beats = ${this.beats}, velocity = ${this.velocity})\n`;
        }
        else {
            return `rest(0.25)\n`;
        }
    }
}


class DrumTrack {

    constructor(config, sequencer) {

        this.sequencer = sequencer;

        // list of cells for this track
        this.cells = [ ]; // List<DrumCell>

        // group contains the text attribute and all of the cells
        this.group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.text = document.createElementNS("http://www.w3.org/2000/svg", 'text');

        this.changeVoice(config);        

        this.text.setAttribute('x', `${sequencer.headerWidth - 15}`);
        this.text.setAttribute('y', `${this.trackY + this.cellHeight / 2}`);
        this.text.classList.add('drum-name');
        this.text.innerHTML = `${this.name} (${this.note})`;
        this.group.append(this.text);

        for (let i = 0; i < this.sequencer.steps; i++) {
            let cell = new DrumCell(this, i);
            this.cells.push(cell);
            this.group.append(cell.group);
        }
    }

    get context() { return this.sequencer.context; }
    get master() { return this.sequencer.master; }
    get bpm() { return this.sequencer.bpm; }
    get steps() { return this.sequencer.steps; }
    get currentBeat() { return this.sequencer.currentBeat; }
    get isPlaying() { return this.sequencer.isPlaying; }
    get trackY() { return this.sequencer.trackToY(this.track); }
    get cellWidth() { return this.sequencer.cellWidth; }
    get cellHeight() { return this.sequencer.cellHeight; }
    stepToX = (step) => this.sequencer.stepToX(step);


    async changeVoice(config) {
        this.name = config['name'];   // display name (e.g. "Kick")
        this.note = config['note'];   // note number (e.g. 1, 2, 3)
        this.track = config['track']; // track index (0, 1, 2, 3, ...)
        this.sound = config['sound']; // audio file name
        this.gain = ('gain' in config) ? config['gain'] : 1.0;
        this.buffer = null;           // audio buffer
        this.text.innerHTML = `${this.name} (${this.note})`;
        if (this.context != null) {
            this.buffer = await this.sequencer.loadAudioBuffer(this.sound);
        }
    }

    onUpdate(cell) {
        this.sequencer.onUpdate(cell);
    }

    clear() {
        this.cells.forEach((cell) => cell.clear());
    }

    incrementMeasures() {
        for (let i=0; i<this.steps; i++) {
            if (i >= this.cells.length) {
                let cell = new DrumCell(this, i)
                this.cells.push(cell);
                this.group.append(cell.group);                
            }
        }
    }

    decrementMeasures() {
        for (let cell of this.cells) {
            if (cell.start >= this.steps) {
                cell.group.remove();
            }
        }
        const delta = this.steps - this.cells.length;
        this.cells.splice(delta);
    }

    cancelSound() {
        this.cells.forEach(cell => cell.cancelSound());
    }

    cueSound(delayBeats, offsetBeats) {
        for (let cell of this.cells) {
            if (cell.start+1 <= this.sequencer.steps) {
                cell.cueSound(this.sequencer.master, delayBeats, offsetBeats);
            }
        }
    }

    reposition() {
        this.text.setAttribute('x', `${this.sequencer.headerWidth - 15}`);
        this.text.setAttribute('y', `${this.trackY + this.cellHeight / 2}`);
        this.text.classList.add('drum-name');        
        this.cells.forEach(cell => cell.reposition());
    }

    save() {
        let s = '';
        for (let cell of this.cells) {
            s += cell.save();
        }
        return { track : this.track, cells : s };
    }

    load(config) {
        if (config.track == this.track) {
            for (let i = 0; i<this.steps; i++) {
                if (i >= this.cells.length) {
                    let cell = new DrumCell(this, i)
                    this.cells.push(cell);
                    this.group.append(cell.group);
                }
                if (i < config.cells.length) {
                    this.cells[i].load(config.cells[i]);
                }
            }
        }
    }


    generateEmbed() {
        let generate = false;
        let pattern = '';
        for (const cell of this.cells) {
            pattern += cell.save();
            if (cell.velocity > 0) generate = true;
        }
        return generate ? `&track${this.track}=${patternToHex(pattern)}` : '';
    }


    generateCode() {
        let build = false;
        let code = "# " + this.name + "\nmoveTo(0)\n";
        let rest = 0;
        for (let cell of this.cells) {
            if (cell.velocity > 0) {
                if (rest > 0) {
                    code += `rest(${rest})\n`;
                    rest = 0;
                }
                code += cell.generateCode();
                build = true;  // only generate code if at least one cell is on
            }
            else {
                rest += 0.25;
            }
        }
        return build ? (code + "\n") : "";
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

        this.trackGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.timelineGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.playhead = document.createElementNS("http://www.w3.org/2000/svg", 'line');

        this.trackGroup.classList.add('track-group');
        this.timelineGroup.classList.add('timeline-group')
        this.playhead.classList.add('playhead');

        this.parent.append(this.trackGroup);
        this.parent.append(this.timelineGroup);
        this.parent.append(this.playhead);

        this.codeHint = this.container.querySelector('.code-hint'); // DivElement

        this.tracks = [ ];   // List<Drum>();
        this.sounds = { };   // Map<String?, AudioBuffer>();

        for (let t of this.voice['tracks']) {
            let track = new DrumTrack(t, this);
            this.trackGroup.append(track.group);
            this.tracks.push(track)
        }
        this.redraw();
        this.setPlayhead(0);

        this.isPlaying = false;
        this.looped = false;
        this.last_beat = 0;

        // Drag to paint notes
        this.updated = false;

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
        this.container.querySelector('.embed-expand')?.addEventListener('click', (e) => this.showEmbedCode());
        this.container.querySelector('.embed-collapse')?.addEventListener('click', (e) => this.hideEmbedCode());
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
    get measures() { return Math.max(1, Math.min(this.maxMeasures, Math.round(this.steps / this.stepsPerMeasure))); }
    get stepsPerBeat() { return 4; }
    get beatsPerMeasure() { return 4; }
    get stepsPerMeasure() { return this.stepsPerBeat * this.beatsPerMeasure; }
    get maxMeasures() { return 3; }
    get currentBeat() { return this.composer.currentBeat % this.totalBeats; }
    get width() { return this.container.getBoundingClientRect().width; }
    get height() { return 250; }
    get voice() { return this.config['voices'][this.voiceIndex]; }
    get trackCount() { return this.voice['tracks'].length; }
    get headerWidth() { return 120; }
    get headerHeight() { return 35; }
    get cellWidth() { return (this.width - this.headerWidth - this.measures * 4) / this.steps; }
  
    get cellHeight() { return (this.height - this.headerHeight) / this.trackCount; }
    get totalBeats() { return this.steps / 4.0; }


    onUpdate() {
        this.updated = true;
        setTimeout(() => { 
            if (this.updated) {
                this.updated = false;
                this.updateCodeHint();
                this.updateEmbedCode();
            }
        }, 1000);
        this.composer.saveState();
    }


    incrementMeasures() {
        if (this.measures < this.maxMeasures) {
            this.steps = (this.measures + 1) * this.stepsPerMeasure;
            this.composer.stopAll();
            this.tracks.forEach(track => track.incrementMeasures());
            this.redraw();
            this.composer.saveState();
            this.updateCodeHint();
        }
    }

    decrementMeasures() {
        if (this.measures > 1) {
            this.steps = (this.measures - 1) * this.stepsPerMeasure;
            this.composer.stopAll();
            this.tracks.forEach(track => track.decrementMeasures());
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
        this.tracks.forEach(track => track.reposition());
        this.container.querySelector(".bars .value").innerHTML = `${this.measures}`;
        this.container.querySelector(".bars .units").innerHTML = this.measures > 1 ? "bars" : "bar";
        this.container.querySelector(".tempo .value").innerHTML = `${this.bpm}`;
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
        this.voiceIndex = Math.max(0, Math.min(index, this.config['voices'].length - 1));
        for (let t of this.voice['tracks']) {
            const i = t.track;
            if (!isNaN(i) && i >= 0 && i < this.tracks.length) {
                const track = this.tracks[i];
                track.changeVoice(t);
            }
        }
        this.redraw();
        this.composer.saveState();
    }


    save() {
        let state = [ ];
        for (let track of this.tracks) {
            state.push(track.save());
        }
        let config_state = {};
        config_state['steps'] = this.steps;
        config_state['tracks'] = state;
        config_state['voiceIndex'] = this.voiceIndex;
        return config_state;
    }

    load(state) {
        if (state instanceof Object && state['tracks'] instanceof Array)  {
            this.steps = parseInt(state['steps']);
            this.steps = this.measures * this.stepsPerMeasure;  // make sure the lines up with time signature
            let vi = parseInt(state['voiceIndex']);
            if (isNaN(vi)) vi = 0;
            vi = Math.max(0, Math.min(vi, this.config['voices'].length - 1));
            if (vi != this.voiceIndex) {
                this.changeVoice(vi);
                this.updateVoiceMenu();
            }
            if (isNaN(this.steps)) this.steps = 16;

            for (let t of state['tracks']) {
                const i = t.track;
                if (!isNaN(i) && i >= 0 && i < this.tracks.length) {
                    this.tracks[i].load(t);
                }
            }
        }
    }

    trackToY(track) {
        return this.headerHeight + this.cellHeight * track;
    }

    stepToX(step) {
        return this.headerWidth + this.cellWidth * step + (step / this.stepsPerMeasure) * 4;
    }

    beatsToX(beats) {
        return this.headerWidth + this.cellWidth * this.steps * beats / this.totalBeats;
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
        this.tracks.forEach(t => t.clear());
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
            this.tracks.forEach(track => track.cancelSound());
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
            this.tracks.forEach(track => track.cueSound(delayBeats, offsetBeats));
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
            text.setAttribute('y', `${this.headerHeight / 2 + 4}`);
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

    generateCode() {
        let code = "";
        for (let track of this.tracks) {
            code += track.generateCode();
        }
        return code;
    }


    generateEmbedLink() {
        const url = window.location.origin + window.location.pathname;
        let query = `?embedded=true&bpm=${this.bpm}&steps=${this.steps}&voice=${this.voiceIndex}`;
        for (let track of this.tracks) {
            query += track.generateEmbed();
        }
        return url + query;
    }

    showEmbedCode() {
        this.updateEmbedCode();
        this.container.querySelector('.embed-expand')?.classList.add('hidden');
        this.container.querySelector('.embed-collapse')?.classList.remove('hidden');
        this.container.querySelector('.embed-info')?.classList.remove('hidden');
    }

    hideEmbedCode() {
        this.container.querySelector('.embed-expand')?.classList.remove('hidden');
        this.container.querySelector('.embed-collapse')?.classList.add('hidden');
        this.container.querySelector('.embed-info')?.classList.add('hidden');

    }

    updateEmbedCode() {
        const el = this.container.querySelector(".embed-info");
        if (el) {
            const styles = "width: 95%; min-width: 500px; overflow: hidden; border: none;";
            const link = this.generateEmbedLink();
            const code = `<iframe height="325" src="${link}" style="${styles}" scrolling="no"></iframe>`;
            el.innerText = code;
        }
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
            for (let track of this.tracks) {
                track.buffer = await this.loadAudioBuffer(track.sound);
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


function patternToHex(pattern) {
    let byte = 0;
    let hex = '';
    for (let i=0; i<pattern.length; i++) {
        byte += (pattern[i] != '-') ? 8 : 0;
        if ((i + 1) % 4 == 0) {
            hex += byte.toString(16);
            byte = 0;
        } else {
            byte >>= 1;
        }
    }
    return hex;
}

function hexToPattern(hexString, steps) {
    let pattern = '';
    for (const char of hexString) {
        let byte = parseInt(char, 16);
        if (Number.isInteger(byte)) {
            for (let i=0; i<4; i++) {
                pattern += (byte & 0x01 === 1) ? '!' : '-';
                byte >>= 1;
            }
        } else {
            pattern += '----';
        }
    }
    while (pattern.length < steps) { pattern += '-'; }
    return pattern.substring(0,steps);
}
