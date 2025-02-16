/**
 * Updates as of Feb 16, 2025
 *   Removed global recording checkbox
 *   Fixed user-select issue on drum pads
 *   Fixed playhead timeline-manipulator bug
 * 
 * TODO:
 * line 578: remove hit??
 * scope.updateCodeHint only permanent hits
 * don't cut off sounds at the end of a bar
 */
class DrumScope {

    constructor() {
        this.bpm = 80;              // tempo
        this.sounds = { };          // cache of audio buffers
        this.context = null;        // audio context
        this.master = null;         // GainNode
        this.start_time = 0;
        this.start_beat = 0;
        this.isPlaying = false;
        this.looped = false;
        this.quantize = true;
        this.midi = true;
        this.last_beat = 0;
        this.timeline = new Timeline(this);
        this._needsUpdate = false;
        this.metronomeEnabled = false;
        this.metronomeSound = null;
        this.nextMetronomeTime = 0;


        this.tracks = { };          // audio tracks draw waveform trace
        document.querySelectorAll(".drum-tracks .track").forEach((el) => {
            const drum = el.getAttribute("data-drum");
            this.tracks[drum] = new AudioTrack(el, this);
        });

        document.querySelector('#metronome-check').addEventListener('change', (e) => {
            this.metronomeEnabled = e.target.checked;
        });
        document.querySelector(".play-button").addEventListener('click', e => this.play());
        document.querySelector(".pause-button").addEventListener('click', e => this.pause());
        document.querySelector(".stop-button").addEventListener('click', e => this.stop());
        document.querySelector(".clear-button").addEventListener('click', e => this.clear());
        document.querySelector('.copy-code-button').addEventListener('click', (e) => this.copyCode());
        

        // start the audio context on the first click
        //document.addEventListener("click", (e) => { this.initAudio(); }, {once : true});
        setTimeout(() => { 
            this.initAudio();
            this.initDrumPads()
            this.updateCodeHint();
            this.loadMetronomeSound();
        }, 100);

        setInterval(() => {
            if (this._needsUpdate) {
                this._updateCodeHint();
                this._needsUpdate = false;
            }
        }, 500);

        addEventListener('resize', (e) => { this.timeline.resize() });

        bindSpinnerButton(document.querySelector('.tempo-up'),
            () => this.changeTempo(1),
            () => this.mute(),
            () => {
                this.unmute();
                for (let t in this.tracks) { this.tracks[t].draw(); }
            });
        bindSpinnerButton(document.querySelector('.tempo-down'), 
            () => this.changeTempo(-1),
            () => this.mute(),
            () => {
                this.unmute();
                for (let t in this.tracks) { this.tracks[t].draw(); }
            });
        document.querySelector('.tempo .value').addEventListener('blur', (e) => {
            let t = parseInt(e.target.innerHTML);
            this.setTempo( isNaN(t) ? this.bpm : t );
            for (let t in this.tracks) this.tracks[t].draw();
        });
        document.querySelector('.tempo .value').addEventListener('keypress', (e) => {
            if (e.charCode === 13) e.target.blur();
        });
        document.querySelector('#quantize-check').addEventListener('change', (e) => {
            this.quantize = e.target.checked;
        });
        document.querySelector('#midi-check').addEventListener('change', (e) => {
            this.midi = e.target.checked;
        });

        // connect to MIDI
        navigator.requestMIDIAccess().then(
            (midi) => {
                //midiAccess = midi;
                console.log("Connected to MIDI.");
                midi.onstatechange = this._midiConnection;
                for (let input of midi.inputs.values()) {
                    input.onmidimessage = this._midiEvent;
                }
            },
            () => { console.log("Failed to initialize web MIDI."); }
        );

    }

    get measures() { return 2; }
    get beatsPerMeasure() { return 4; }
    get totalBeats() { return this.measures * this.beatsPerMeasure; }

    /**
     * How many beats have elapsed since the last time STOP was pressed
     */
    get currentBeat() {
        if (this.isPlaying) {
            return this.start_beat + (this.context.currentTime - this.start_time) * this.bpm / 60.0;
        } else {
            return this.start_beat;
        }
    }
 

    animate() {
        if (this.context !== null && this.isPlaying) {
            const beat = this.currentBeat % this.totalBeats;
            if (beat >= (this.totalBeats - 0.5) && !this.looped) {
                this.cueSounds(this.totalBeats - beat, 0);
                this.looped = true;
            }
            else if (this.last_beat > beat) {
                if (this.looped) {
                    this.clear();
                }
                this.looped = false;
            }

            // schedule metronome
            this.scheduleMetronome();

            this.last_beat = beat;
            this.timeline.draw(beat);
            requestAnimationFrame(time => this.animate());
        }
    }


    async loadMetronomeSound() {
        const response = await fetch("/sounds/voices/metronome/metronome.wav");
        const arrayBuffer = await response.arrayBuffer();
        this.metronomeSound = await this.context.decodeAudioData(arrayBuffer);
    }

    scheduleMetronome() {
        if (!this.metronomeEnabled || !this.isPlaying) return;

        const currentTime = this.context.currentTime;
        
        while (this.nextMetronomeTime < currentTime + 0.1) {
            this.playMetronomeSound(this.nextMetronomeTime);
            this.nextMetronomeTime += 60 / this.bpm;
        }
    }

    playMetronomeSound(time) {
        if (!this.metronomeSound) return;

        const source = this.context.createBufferSource();
        source.buffer = this.metronomeSound;
        
        const gainNode = this.context.createGain();
        gainNode.gain.value = 0.5

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(time);
    }
    play() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        if (!this.isPlaying && this.context !== null) {
            this.isPlaying = true;
            this.start_time = this.context.currentTime;
            document.querySelector('.play-button').classList.add('hidden');
            document.querySelector('.pause-button').classList.remove('hidden');
            this.looped = false;
            this.last_beat = this.currentBeat % this.totalBeats;
            this.setPlayhead(this.last_beat);
            this.master = null;
            this.master = this.context.createGain();
            this.master.gain.value = 1.0;
            this.master.connect(this.context.destination);

            if (this.last_beat < (this.totalBeats - 0.5)) {
                this.cueSounds(0, this.last_beat);
            }
            this.nextMetronomeTime = this.context.currentTime;
            
            this.animate();
        }        
    }

    pause() {
        this.start_beat = this.currentBeat;
        this.isPlaying = false;
        document.querySelector('.pause-button').classList.add('hidden');
        document.querySelector('.play-button').classList.remove('hidden');
        this.stopSounds();
        this.updateCodeHint();
    }
    
    stop() {
        this.isPlaying = false;
        this.pause();
        this.setPlayhead(0);
        this.start_beat = 0;
        this.stopSounds();
    }

    clear() {
        for (let t in this.tracks) {
            if (!this.tracks[t].isRecording) {
                this.tracks[t].clear();
            }
        }
        this.master && this.master.gain.setValueAtTime(0.0, 0.1);
        this.master = this.context.createGain();
        this.master.gain.value = 1.0;
        this.master.connect(this.context.destination);
        this.updateCodeHint();
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

    changeTempo(delta) {
        this.setTempo(this.bpm + delta);
    }

    setTempo(tempo) {
        let newBPM = Math.min(300, Math.max(tempo, 5));
        if (this.isPlaying) {
            this.start_beat = this.currentBeat;
            this.start_time = this.context.currentTime;
            this.stopSounds();
            let beat = this.currentBeat % this.totalBeats;
            if (beat < (this.totalBeats - 0.5)) {
                this.cueSounds(0, this.last_beat);
            }
            else {
                this.cueSounds(this.totalBeats - beat, 0);
            }
        }
        this.bpm = newBPM;
        document.querySelector(".tempo .value").innerHTML = `${this.bpm}`;
    }

    stopSounds() {
        for (let t in this.tracks) {
            this.tracks[t].stopSounds();
        }
    }


    cueSounds(delayBeats, offsetBeats) {
        if (this.context != null && this.master != null) {
            for (let t in this.tracks) {
                this.tracks[t].cueSounds(this.master, delayBeats, offsetBeats);
            }
        }
    }

    setPlayhead(beats) {
        this.start_beat = beats;
        this.timeline.draw(beats);
    }
    
    initAudio() {
        if (this.context === null) {
            this.context = new AudioContext();
        }
    }

    initDrumPads() {
        document.querySelectorAll(".drum-pads button").forEach((e) => {
            const drum = e.getAttribute("data-drum");
            this.loadAudioBuffer(drum);
            e.addEventListener('pointerdown', (evt) => {
                this.playSound(drum);
            });
            e.addEventListener('pointerenter', (evt) => {
                if (evt.buttons > 0) {
                    this.playSound(drum);
                }
            });
        });
        document.addEventListener('keydown', (key) => {
            document.querySelectorAll(".drum-pads button").forEach((e) => {
                if (e.getAttribute("data-trigger") === key.key || e.getAttribute("data-note") === key.key) {
                    const drum = e.getAttribute("data-drum");
                    this.playSound(drum);
                    e.classList.add('clicked');
                }
            });
        });
        document.addEventListener('keyup', (key) => {
            document.querySelectorAll(".drum-pads button").forEach((e) => {
                e.classList.remove('clicked');
            });
        });
    }

    /// asynchronously loads a sound from the given URL and uses name as the hash key
    async  loadAudioBuffer(name) {
        if (this.sounds[name]) return this.sounds[name];
        if (this.context != null) {
            try {
                const path = "/sounds/voices/rock-drums/" + name + ".wav";
                let response = await fetch(path);
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


    playSound(drumName, velocity = 100) {
        if (drumName in this.tracks) {
            this.tracks[drumName].playSound(this.currentBeat % this.totalBeats, velocity);
            this.updateCodeHint();
        }
    }

    //----------------------------------------------------------
    // Fired when midi devices are added or removed. The 
    // parameter passed is a MIDIConnectionEvent.
    //----------------------------------------------------------
    _midiConnection = ( event ) => {
        let port = event.port; // MIDIPort
        if (port.type === "input" && port.state === "connected") {
            port.onmidimessage = this._midiEvent;
        }
    }


    _midiEvent = (event) => {
        if (!this.midi) return;
        let cmd = event.data[0] >> 4;
        let channel = event.data[0] & 0xf;
        let note = event.data[1] % 12;   /// note map everything back onto the range 0 - 12
        let velocity = 100;
        if (event.data.length >= 3) velocity = event.data[2];
        if (cmd === 9 && velocity === 0) cmd = 8; // Note OFF
        if (cmd == 8 || cmd == 9) {
            document.querySelectorAll(".drum-pads button").forEach((e) => {
                if (e.getAttribute("data-note") === `${note}`) {
                    const drum = e.getAttribute("data-drum");
                    if (cmd === 8) {
                        e.classList.remove('clicked');
                    } else {
                        this.playSound(drum, velocity);
                        e.classList.add('clicked');
                    }
                }
            });
        }
    }

    generateCode() {
        let code = "";

        for (let t in this.tracks) {
            let track = this.tracks[t];
            code += track.generateCode();
        }
        return code;
    }

    _updateCodeHint() {
        this._needsUpdate = false;
        let code = this.generateCode();
        let lines = code.split('\n');
        code = '';
        if (lines.length < 10) {
            for (let i=0; i<10; i++) lines.push('');
        }
        for (let line of lines) {
            code += '<code>' + line + '<\code>\n';
        }
        const codeHint = document.querySelector('.code-hint');
        if (codeHint) codeHint.innerHTML = code;
        document.querySelector('.copy-code-button').innerHTML = 'Copy to Clipboard';
        Prism.highlightAll();
    }

    updateCodeHint() {
        this._needsUpdate = true;
    }

    copyCode() {
        let code = this.generateCode();
        navigator.clipboard.writeText(code);
        document.querySelector('.copy-code-button').innerHTML = 'Copied';
    }
}

class Timeline {
    constructor(scope) {
        this.MARGIN = 155;
        this.scope = scope;
        this.parent = document.querySelector('#timeline'); // SVGSVGElement
        this.container = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.playhead = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.playhead.classList.add('playhead');
        this.timeline = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.container.append(this.timeline);
        this.container.append(this.playhead);
        this.parent.append(this.container);
        this.width = 100;
        this.height = 100;
        this.manipulator = document.querySelector('#drumscope .timeline-manipulator');

        let dragging = false;
        let deltaX = 5;
        this.manipulator.addEventListener('pointerdown', (e) => {
            this.scope.pause();
            this.scope.setPlayhead(this.xToBeat(e.offsetX));
            deltaX = e.offsetX - e.clientX;
            dragging = true;
        });
        document.addEventListener('pointermove', (e) => {
            if (dragging) this.scope.setPlayhead(this.xToBeat(e.clientX + deltaX));
        });
        document.addEventListener('pointerup', (e) => {
            dragging = false;
        });
        this.resize();
    }

    resize() {
        let rect = this.parent.getBoundingClientRect();
        this.width = Math.round(rect.width);
        this.height = Math.round(rect.height);
        this.parent.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        this.width -= this.MARGIN;
        this.timeline.innerHTML = "";
        this.container.setAttribute('transform', `translate(${this.MARGIN} 0)`);

        let bug = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        bug.setAttribute("d", "M -8 0 H 8 V 12 L 0 25  L -8 12 Z");
        this.playhead.append(bug);
        let pline = document.createElementNS("http://www.w3.org/2000/svg", 'line'); 
        pline.setAttribute('x1', '0');
        pline.setAttribute('x2', '0');
        pline.setAttribute('y1', '0');
        pline.setAttribute('y2', `${this.height}`);
        this.playhead.append(pline);

        let tick = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        tick.setAttribute('x1', '0');
        tick.setAttribute('x2', `${this.width}`);
        tick.setAttribute('y1', '0');
        tick.setAttribute('y2', '0');
        tick.classList.add('major-tick');
        this.timeline.append(tick);

        for (let b = 0; b <= this.scope.totalBeats; b++) {
            tick = document.createElementNS("http://www.w3.org/2000/svg", 'line');
            let x = this.beatToX(b);
            tick.setAttribute('x1', `${x}`);
            tick.setAttribute('x2', `${x}`);
            tick.setAttribute('y1', '0');
            tick.setAttribute('y2', '25');
            tick.classList.add('major-tick');
            this.timeline.append(tick);

            if (b < this.scope.totalBeats) {
                let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                text.setAttribute('x', `${x + 10}`);
                text.setAttribute('y', '17');
                text.innerHTML = `${(b % this.scope.beatsPerMeasure) + 1}`;
                text.classList.add('beat-number');
                this.timeline.append(text);
            }
                
            for (let s = 1; s < 4; s++) {
                let stick = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                x = this.beatToX(b + s * 0.25);
                stick.setAttribute('x1', `${x}`);
                stick.setAttribute('x2', `${x}`);
                stick.setAttribute('y1', '0');
                stick.setAttribute('y2', '17');
                stick.classList.add('minor-tick');
                this.timeline.append(stick);
            }
        }
        this.draw();
    }

    draw(beat = 0) {
        const x = this.beatToX(beat);
        this.playhead.setAttribute('transform', `translate(${x} 0)`);
    }

    beatToX(beat) {
        return (this.width / this.scope.totalBeats) * beat;
    }

    xToBeat(x) {
        return Math.max(0.0, ((x - this.MARGIN) / this.width) * this.scope.totalBeats);
    }
}

class DrumHit {
    constructor(beat, velocity, permanent) {
        this.beat = beat;
        this.alpha = 1.0;
        this.velocity = velocity;
        this.permanent = permanent;
    }

    fade() {
        if (!this.permanent) this.alpha *= 0.8;
    }
}


class AudioTrack {

    constructor(container, scope) {
        this.scope = scope;
        this.container = container;
        this.drum = container.getAttribute("data-drum");
        this.name = container.getAttribute("data-name");
        this.note = container.getAttribute("data-note");
        this.canvas = container.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.velocity = 100;
        this.hits = [ ];  // when drum hits are triggered
        this.resize();
        this.draw();
        this.master = null;
        this.isRecording = false;
        this.isMuted = false;
        this.isLocked = false;
        this.animationFrame = null;
        this.lastToggleTime = 0;
        this.recordButton = container.querySelector('.record-button');
        this.muteButton = container.querySelector('.mute-button');
        this.lockButton = container.querySelector('.lock-button');


        this.recordButton.addEventListener('click', () => this.toggleRecord());
        this.muteButton.addEventListener('click', () => this.toggleMute());
        this.lockButton.addEventListener('click', () => this.toggleLock());

        this.canvas.addEventListener('click', (e) => {
            if (this.isLocked) return;
            let beat = this.xToBeat(e.offsetX);
            if (this.scope.quantize) {
                beat = this.quantizeBeat(beat);
            }
            if (this.hasHit(beat)) {
                this.removeHit(beat);
            } else {
                this.addHit(new DrumHit(beat, this.velocity, this.isRecording));
                if (this.scope.isPlaying) {
                    this.stopSounds();
                    this.cueSounds(this.scope.master, 0, this.scope.currentBeat % this.scope.totalBeats);
                }
                this.cueSound();
            }
            this.draw();
            this.scope.updateCodeHint();
        });
        setInterval(() => this.fadeOutAnimation(), 100);
    }

    animateRecord(timestamp) {
        if (!this.isRecording) {
            this.recordButton.classList.remove('active');
            return;
        }

        if (timestamp - this.lastToggleTime > 500) {
            this.recordButton.classList.toggle('active');
            this.lastToggleTime = timestamp;
        }

        this.animationFrame = requestAnimationFrame(this.animateRecord.bind(this));
    }

    toggleRecord() {
        this.isRecording = !this.isRecording;
        if (this.isRecording) {
            this.animationFrame = requestAnimationFrame(this.animateRecord.bind(this));
        } else if (this.animationFrame) {
            this.recordButton.classList.remove('active');
            cancelAnimationFrame(this.animationFrame);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.muteButton.classList.toggle('active', this.isMuted);
        this.muteButton.innerHTML = this.isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }

    toggleLock() {
        this.isLocked = !this.isLocked;
        this.lockButton.classList.toggle('active', this.isLocked);
        this.lockButton.innerHTML = this.isLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
    }

    // return true only if hit is permanent
    hasHit(beat) {
        return this.hits.some(hit => (hit.beat === beat && hit.permanent));
    }

    addHit(hit) {
        this.hits.push(hit);
        this.hits.sort((a, b) => a.beat - b.beat);
    }

    removeHit(beat) {
        this.hits = this.hits.filter(hit => !(hit.beat === beat && hit.permanent));
    }

    resize() {
        let rect = this.container.getBoundingClientRect();
        this.canvas.width = Math.round(rect.width) * 2;
        this.canvas.height = Math.round(rect.height) * 2;
    }

    playSound(beat, velocity = 100) {
        if (!this.isMuted) {
            this.cueSound(null, 0, velocity);
            if (!this.isLocked) {
                if (this.scope.quantize) {
                    beat = this.quantizeBeat(beat);
                }
                beat = beat % this.scope.totalBeats;
                if (!this.hasHit(beat)) {
                    const hit = new DrumHit(beat, velocity, this.isRecording);
                    this.addHit(hit);
                    this._drawSound(hit);
                }
            }
        }
    }


    cueSound(dest = null, when = 0, velocity = 100) {
        if(this.isMuted) return;
        const context = this.scope.context;
        const sound = this.scope.getAudioBuffer(this.drum);
        if (context == null || sound == null) return;
        if (dest == null) dest = context.destination;
        if (this.master === null) {
            this.master = context.createGain();
            this.master.gain.value = 0.9;
            this.master.connect(dest);
        }
        if (when === 0) when = context.currentTime;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const p = Math.log2(Math.min(1.0, velocity / 110.0) + 1);
        gain.gain.value = p;
        gain.connect(this.master);
        source.buffer = sound;
        source.connect(gain);
        source.start(when);
    }

    stopSounds() {
        if (this.master) {
            this.master.disconnect();
            this.master = null;
        }
    }


    cueSounds(dest, delayBeats, offsetBeats) {
        const context = this.scope.context;
        const bpm = this.scope.bpm;

        if (dest !== null && context !== null) {
            for (const hit of this.hits) {
                let when = context.currentTime;
                if (hit.permanent) {
                    if (hit.beat === 0 && delayBeats === 0 && offsetBeats === 0) {
                        this.cueSound(dest, when, hit.velocity);
                    }
                    else if (delayBeats > 0) {
                        when = when + (hit.beat + delayBeats) * 60 / bpm;
                        this.cueSound(dest, when, hit.velocity);
                    } 
                    else if (offsetBeats >= 0 && hit.beat > offsetBeats) {
                        when = when + (hit.beat - offsetBeats) * 60 / bpm;
                        this.cueSound(dest, when, hit.velocity);
                    }
                }
            }
        }
    }

    fadeOutAnimation() {
        // fade drum hits
        if (this.hits.some(hit => !hit.permanent)) {
            this.hits.forEach((hit) => { hit.fade(); });
            this.hits = this.hits.filter(hit => hit.alpha > 0.1);
            this.draw();
        }
    }

    generateCode() {
        let code = "";
        const permahits = this.hits.filter(hit => hit.permanent);
        if (permahits.length > 0 && !this.isMuted) {
            code += `# ${this.name}\n`;
            code += `${this.name} = ${this.note}\n`;
            code += "moveTo(0)\n";

            let playhead = 0;
            for (const hit of permahits) {
                if (hit.beat > playhead) {
                    code += `rest(${(hit.beat - playhead).toFixed(2)})\n`;
                } else if (hit.beat < playhead) {
                    code += `rewind(${(playhead - hit.beat).toFixed(2)})\n`;
                }
                if (hit.velocity !== 100) {
                    code += `playNote(${this.drum}, beats=0.5, velocity=${hit.velocity})\n`;
                } else {
                    code += `playNote(${this.drum}, beats=0.5)\n`;
                }
                playhead = hit.beat + 0.5;
            }
        }
        return code ? code + "\n\n" : code;
    }

    clear() {
        if (!this.isLocked) {
            this.hits = this.hits.filter(hit => hit.permanent);
            this.stopSounds();
            this.draw();
        }
    }

    draw() {
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        c.clearRect(0, 0, w, h);
        c.save();
        {
            c.strokeStyle = '#333';
            c.lineWidth = 1;
            c.lineJoin = 'round';
            c.beginPath();
            c.moveTo(0, h/2);
            c.lineTo(w, h/2);
            c.stroke();

            c.beginPath();
            for (let b = 1; b < this.scope.totalBeats; b++) {
                c.moveTo(this.beatToX(b), 0);
                c.lineTo(this.beatToX(b), h);
            }
            c.stroke();
            c.lineWidth = 3;
            c.beginPath();
            for (let m = 1; m < this.scope.measures; m++) {
                c.moveTo(this.beatToX(m * this.scope.beatsPerMeasure), 0);
                c.lineTo(this.beatToX(m * this.scope.beatsPerMeasure), h);
            }
            c.stroke();
            for (const hit of this.hits) {
                this._drawSound(hit);
            }
        }
        c.restore();
    }


    beatToX(beat) {
        return (this.canvas.width / this.scope.totalBeats) * beat;
    }

    xToBeat(x) {
        return (x / (this.canvas.width / 2)) * this.scope.totalBeats;
    }

    quantizeBeat(beat) {
        const b = Math.floor(beat);
        return b + Math.round((beat - b) * 4) / 4;
    }


    _drawSound(hit) {
        const sound = this.scope.getAudioBuffer(this.drum);
        if (sound === null) return;

        const beat = hit.beat;
        const velocity = hit.velocity;
        const perm = hit.permanent;
        const c = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = velocity / 110;
        const d = sound.getChannelData(0);  // Float32Array
        const sps = sound.sampleRate;       // samples per second
        const bps = this.scope.bpm / 60.0;  // beats per second
        const pps = (w / this.scope.totalBeats) * bps;        // pixels per second 
        const spp = sps / pps;              // samples per pixel

        c.save();
        {
            c.lineWidth = 2;
            c.strokeStyle = perm ? '#000000' : `rgba(227,48,76, ${hit.alpha})`;
            c.beginPath();
            c.moveTo(this.startpx, h/2);
            let x = 0.0, y = 0.0, s = this.beatToX(beat);
            for (let i = 0; i < d.length; i += 8) {
                y = h/2 - h/2 * d[i] * p;
                x = s + i / spp;
                c.lineTo(x, y);
            }
            c.stroke();
        }
        c.restore();
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