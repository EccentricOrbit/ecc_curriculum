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
import { toNum, dBToGain } from "../../core/utils";
import { Note } from "../../core/note";
import { SynthConnector } from "./connector";
import { SynthModulator } from "./modulator";
import { EffectCurve } from "./curve";


export class SynthNode {

    readonly context : BaseAudioContext;

    /// the node's final output level is set through this gain node
    level : GainNode;

    /// unique id number for this node in this patch
    id = 0;

    /// param modulator attachment points
    modulators = new Array<SynthModulator>();

    /// list of outgoing connectors
    connectors = new Array<SynthConnector>();


    constructor(context : BaseAudioContext, config : any) {
        this.context = context;
        this.id = parseInt(config.id);
        this.level = context.createGain();
        const db = toNum(config.level, 0.0);
        this.level.gain?.setValueAtTime(dBToGain(db), 0);
        this.level.gain.value = dBToGain(db);
        this.addModulator('gain', toNum(config['gain-mod'], 1.0), this.level.gain!);
    }


    /// connect to this node from a source node. the dest string specifies
    /// which parameter or input to connect to
    connect(connector : SynthConnector, dest : string) {
        for (let mod of this.modulators) {
            if (mod.connect(connector, dest)) { return; }
        }
        if (dest == 'level') {
            connector.level.connect(this.level.gain!);
        } else {
            connector.level.connect(this.level);
        }
    }


    addConnector(connector : SynthConnector) {
        this.connectors.push(connector);
        this.level?.connect(connector.level);
    }


    addModulator(name : string, value : number, param : AudioParam) {
        const mod = new SynthModulator(this.context, name, value);
        mod.gain.connect(param);
        this.modulators.push(mod);
    }

    /// start the note immediately (key down / note on)
    playNote(note : Note) { }


    /// release the note (key up / note off)
    releaseNote() { }

    /// schedule a note to be played in the future
    /// when: when to play the note (seconds from current time)
    /// if when is 0, start now
    /// if when is positive, delay that many seconds before starting
    /// if when is negative, possibly play a partial note
    /// if (when + duration) is less than or equal to zero do nothing
    /// release: how much extra time to let the note ring out (seconds)
    scheduleNote(note : Note, when : number, duration : number, release : number) { }

    /// immediately stop playback and cancel all future scheduled notes
    cancelNotes() { }

    /// disconnect audio chain to ensure garbage collection
    destroy() {
        this.level.disconnect();
        this.modulators.forEach(mod => mod.destroy());
        this.connectors.forEach(conn => conn.destroy());
    }

    pitchBend(cents : number) { }

    schedulePitchBend(start : number, cents : EffectCurve) { }

    /// update a node parameter by name
    updateParameter(pname : string, newValue : any) {
        for (let mod of this.modulators) {
            if (mod.updateParameter(pname, newValue)) return;
        }
        if (pname == 'level') {
            const db = toNum(newValue, 0.0);
            this.level.gain?.setValueAtTime(dBToGain(db), 0);
            this.level.gain.value = dBToGain(db);
        }
    }

    updateConnectorLevel(connectorId : number, dB : number) {
        this.connectors.forEach((c) => {
            if (c.id == connectorId) {
                c.updateLevel(dB);
            }
        });
    }

    /// returns data for visualizing node state (e.g. oscillator curve or ADSR envelope shape)
    /*
    getVisualizationData() : Future<Float32List> {
        return Future.sync(() => Float32List(0));
    }
    */

    attachAnalyzer(connectorId : number, fftSize : number, channels : number) {
        for (let c of this.connectors) {
            if (c.id == connectorId) {
                c.attachAnalyzer(fftSize, channels);
            }
        }
    }

    detachAnalyzer(connectorId : number) {
        this.connectors.forEach((c) => {
            if (c.id == connectorId) {
                c.detachAnalyzer();
            }
        });
    }

    getFloatTimeDomainData(connectorId : number, channel : number, buff : Float32Array) {
        this.connectors.forEach((c) => {
            if (c.id == connectorId) {
                c.getFloatTimeDomainData(channel, buff);
            }
        });
    }
}
