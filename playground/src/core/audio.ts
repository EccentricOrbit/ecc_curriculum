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
import { toInt } from './utils';

/**
 * Clock subscribers receive events when clock properties change.
 */
interface ClockSubscriber {
    onClockReset() : void;
    onClockTimeChange() : void;
    onTempoChange() : void;
    onTimeSignatureChange() : void;
}


/**
 * Metronomes can request beat pulses from the clock
 */
interface Metronome {
    pulse(beats : number) : void /// beat is the current beat in a measure
}


/**
 * Thin wrapper around the audio context timer that lets you set time
 * and synchronize multiple subscribers playing at the same time.
 */
export class TunePadAudio {

    /// time at which clock was last started or paused
    private _start = 0;

    /// subscribers can set the time to an arbitrary beat
    private _elapsedBeats = 0;

    /// common beats per minute for all subscribers to the clock
    private _bpm = 120;
    get bpm() : number { return this._bpm; }
    set bpm(tempo : number) { this.setTempo(tempo); }

    /// time signature
    private _meter = "4/4";
    get meter() : string { return this._meter; }
    set meter(m : string) { this.setTimeSignature(m); }

    /// beats per measure
    private _beatsPerMeasure = 4;
    get beatsPerMeasure() : number { return this._beatsPerMeasure; }

    /// denominator of the time signature (e.g. 4, 2, 8...)
    private _beatValue = 4; // quarter note is the default
    get beatValue() { return this._beatValue; }

    /// musical key
    private _key = "C major";
    get key() : string { return this._key; }
    set key(keyName : string) { this._key = keyName; }


    /// current time of the audio context
    get contextTime() { return this.context.currentTime; }

    /// elapsed time in seconds since we last called play
    get time() { return (this.isPaused) ? this._start : this.contextTime - this._start; }

    /// elapsed time as hh:mm:ss string
    get timeString() : string {
        let m = `${Math.floor(this.time / 60) % 60}`;
        let s = `${Math.round(this.time) % 60}`;
        let c = `${Math.floor(this.time * 100) % 100}`;
        if (m.length == 1) m = `0${m}`;
        if (s.length == 1) s = `0${s}`;
        if (c.length == 1) c = `0${c}`;
        return `${m}:${s}.${c}`;
    }

    /// elapsed time in beats
    get beats() : number { return (this.time * this.bpm / 60) + this._elapsedBeats; }

    /// list of current subscribers to the clock that are currently playing
    private _subscribers = new Set<ClockSubscriber>();

    /// list of all subscribers for global events such as time signature changes
    private _listeners = new Set<ClockSubscriber>();

    /// underlying implementation uses the audio context timer
    context : AudioContext = new AudioContext();

    /// is the clock paused?
    get isPaused() { return this._subscribers.size == 0; }

    /// list of subscribed metronomes
    private _metronomes = new Set<Metronome>();

    /// singleton pattern
    static _instance : TunePadAudio | null;


    /// init the singleton instance and start the audio engine
    /// ok to call this method more than once.
    public static init() : TunePadAudio {
        if (TunePadAudio._instance == null) {
            TunePadAudio._instance = new TunePadAudio();
        }
        return TunePadAudio._instance;
    }

    private constructor() { }


    addSubscriber(subscriber : ClockSubscriber) {
        this._listeners.add(subscriber);
    }

    removeSubscriber(subscriber : ClockSubscriber) {
        this._listeners.delete(subscriber);
    }


    isPlaying(subscriber : ClockSubscriber) : boolean {
        return this._subscribers.has(subscriber);
    }


    /**
     * Start playing for this subscriber
     */
    play(subscriber : ClockSubscriber) {
        if (this.isPaused) {
            this._start = this.contextTime - this._start;
        }
        this._subscribers.add(subscriber);
        this._listeners.add(subscriber);
    }


    /**
     * Pause this subscriber only ...
     */
    pause(subscriber : ClockSubscriber) {
        this._listeners.add(subscriber);
        if (this.isPlaying(subscriber)) {
            this._subscribers.delete(subscriber);
            if (this.isPaused) {
                this._start = (this.contextTime - this._start);
            }
        }
    }


    /**
     * Reset the clock back to zero beats and stop all subscribers
     */
    stopAll() {
        this._elapsedBeats = 0;
        this._start = 0;
        this._subscribers.clear();
        this._listeners.forEach(s => s.onClockReset());
    }


    /**
     * Automatically stops all subscribers
     */
    setTime(elapsedBeats : number) {
        this._elapsedBeats = elapsedBeats;
        this._start = 0;
        this._listeners.forEach(s => s.onClockTimeChange());
        this._subscribers.clear();
    }


    setTempo(tempo : number) {
        const lastBeats = this.beats;

        if (tempo != this._bpm) {
            this._bpm = Math.max(5, tempo);
            this._start = this.contextTime - lastBeats * 60 / this._bpm;
            this._listeners.forEach((s) => s.onTempoChange());
        }
    }


    setTimeSignature(s : string) {
        // sanity check the time signature string
        if (s.split('/').length != 2) s = "4/4";
        this._beatsPerMeasure = toInt(s.split('/')[0], -1);
        this._beatValue = toInt(s.split('/')[1], -1);

        if (this._beatsPerMeasure < 0 || this._beatValue < 0) {
            this._beatsPerMeasure = 4;
            this._beatValue = 4;
        }

        const newMeter = `${this._beatsPerMeasure}/${this._beatValue}`;
        if (this._meter != newMeter) {
            this._meter = newMeter;
            this._listeners.forEach(s => s.onTimeSignatureChange());
        }
    }


    startMetronome(metronome : Metronome) {
        this._metronomes.add(metronome);
        if (this._timer == -1) {
            const start_time = this.contextTime;
            let beat = 0;
            this._metronomes.forEach(m => m.pulse(0));

            this._timer = window.setInterval(() => {
                if (this._metronomes.size == 0) {
                    window.clearInterval(this._timer);
                    this._timer = -1;
                } else {
                    const beat_len = 60 / this.bpm;
                    const elapsed = (this.contextTime - start_time);
                    const b = Math.floor(elapsed / beat_len) % this.beatsPerMeasure;
                    if (b != beat) {
                        beat = b;
                        this._metronomes.forEach(m => m.pulse(beat));
                    }
                }
            }, 30);
        }
    }
    private _timer = -1;


    stopMetronome(metronome : Metronome) {
        this._metronomes.delete(metronome);
    }


    isMetronomePlaying(metronome : Metronome) : boolean{
        return this._metronomes.has(metronome);
    }
}
