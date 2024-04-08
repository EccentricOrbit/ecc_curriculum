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
import { Note } from '../core/note';
import { SynthNode, OutNode, EffectCurve, SynthConnector, ADSRNode, SynthSampleNode } from './nodes';
import { toStr } from '../core/utils';


/// A synth chain is a collection of connected nodes that forms
/// the audio processing chain defined by the synth patch config file.
/// chains can be cached and reused
export class SynthChain {

    static _CHAIN_ID = 0;
    id = 0;

    /// audio context to play note through
    readonly context : BaseAudioContext;

    /// time in seconds when this generator will be free for reuse
    /// * 0 means that it is free now
    free = 0.0;

    /// list of nodes connected to generate sounds
    nodes = new Map<number, SynthNode>();

    /// final output gain node that will get connected to the audio destination
    out : OutNode | null = null;

    /// longest release time for all of the ADSR nodes
    release = 0.0;

    /// handles midi note velocities
    gates = new Array<any>();

    /// create a synth chain from a configuration patch
    constructor(context : BaseAudioContext) {
        this.context = context;
        this.id = SynthChain._CHAIN_ID++;
        this.loadPatch(SynthChain._sine_patch);
    }


    playNote(note : Note, dest : AudioNode) {
        const now = dest.context.currentTime;
        this.free = 365 * 24 * 60 * 60; /// 1 year in future
        this.disconnect();
        const velocity = new GainNode(dest.context);
        velocity.connect(dest);
        velocity.gain.value = note.gain;
        velocity.gain.setValueAtTime(note.gain, now);
        this.out?.level.connect(velocity);
        this.gates.push({ free : this.free, node : velocity });
        this.nodes.forEach((node, k, m) => node.playNote(note));
    }

    releaseNote() {
        this.nodes.forEach((node, k, m) => node.releaseNote());
    }


    scheduleNote(note : Note, when : number, duration : number, dest : AudioNode) {
        const now = dest.context.currentTime;
        this.free = now + when + duration + this.release + 0.05;

        //-----------------------------------------------------------------
        // create a gated velocity node that is only open while the note is playing
        //-----------------------------------------------------------------
        const velocity = new GainNode(dest.context);
        velocity.connect(dest);
        velocity.gain.value = 0;
        velocity.gain?.setValueAtTime(0, 0);
        velocity.gain?.setValueAtTime(note.gain, Math.max(now, now + when));
        velocity.gain?.setValueAtTime(0, Math.max(now, now + when + duration + this.release));
        this.out?.level.connect(velocity);
        this.gates.push({ 'free': this.free, 'node': velocity });

        //print('scheduleNote at ${when.toStringAsFixed(2)} for ${duration.toStringAsFixed(2)} to be free at ${free.toStringAsFixed(2)}');
        try {
            this.nodes.forEach((node, k, m) => {
                node.scheduleNote(note, when, duration, this.release);
            });
        } catch (x) {
            console.log("Note scheduling exception: $x");
        }

        //-----------------------------------------------------------------
        // free up any old velocity gates
        //-----------------------------------------------------------------
        for (let i = 0; i < this.gates.length; i++) {
            if (this.gates[i]['free'] < now) {
                this.gates[i]['node']?.disconnect();
                this.out?.level.disconnect(this.gates[i]['node']);
                delete this.gates[i];
            }
        }
        this.gates = this.gates.filter(g => (typeof g !== 'undefined'));
        return this.release;
    }


    disconnect() {
        this.out?.level.disconnect();
        this.gates.forEach((gate) => { gate['node']?.disconnect(); });
        this.gates = [];
    }

    cancelNotes() {
        this.disconnect();
        this.nodes.forEach(n => n.cancelNotes());
        this.free = 0;
    }

    destroy() {
        this.disconnect();
        this.nodes.forEach(n => n.destroy());
        this.nodes.clear();
    }

    pitchBend(cents : number) {
        this.nodes.forEach(n => n.pitchBend(cents));
    }


    schedulePitchBend(start : number, curve : EffectCurve) {
        this.nodes.forEach((node) => node.schedulePitchBend(start, curve));
    }


    loadPatch(config : any) {
        this.nodes.clear();
        this.out = null;
        this.release = 0.0;

        if (Array.isArray(config.nodes)) {
            for (let c of config.nodes) {
                let node = this.createSynthNode(this.context, c);
                if (node instanceof OutNode) this.out = node;
                this.nodes.set(node.id, node);
            }
        }
        this._updateReleaseValue();

        for (let r of config['routing']) {
            let source = this.nodes.get(r['source']);
            let dest = this.nodes.get(r['dest']);
            if (source && dest) {
                let connector = new SynthConnector(source, r);
                source.addConnector(connector);
                dest.connect(connector, toStr(r['type'], ''));
            }
        }
    }


    private createSynthNode(context : BaseAudioContext, config : any) {
        switch (config.type) {

            //case 'bitcrush': return SynthBitCrushNode(context, config);

            //case 'compressor': return SynthCompressorNode(context, config);

            //case 'const': return SynthConstNode(context, config);

            //case 'distortion': return SynthDistortionNode(context, config);

            case 'gain': return new SynthNode(context, config);

            //case 'inverter': return SynthInverterNode(context, config);

            //case 'lfo':
            //    SynthOscNode lfo = SynthOscNode(context, config);
            //    lfo.gain.gain?.value = 1.0;
            //    return lfo;

            //case 'fm': return SynthOscNode(context, config);

            //case 'modal': return SynthModalNode(context, config);

            //case 'noise': return SynthNoiseNode(context, config);

            //case 'osc': return SynthOscNode(context, config);

            //case 'panner': return SynthPannerNode(context, config);

            //case 'pwm': return SynthPWMNode(context, config);

            //case 'delay': return SynthDelayNode(context, config);

            case 'adsr': return new ADSRNode(context, config);

            //case 'filter': return SynthFilterNode(context, config);

            //case 'mixer': return SynthMixNode(context, config);

            case 'out': return new OutNode(context, config);

            //case 'rand': return SynthRandomSignalNode(context, config);

            case 'sample': return new SynthSampleNode(context, config);

            //case 'drums': return SynthSampleNode(context, config);

            //case 'stereo': return SynthStereoNode(context, config);

            default:
                console.log(`Node not found: ${config['type']}`);
                return new SynthNode(context, config);

            //case 'phaser': return PhaserNode(context, config));

            //case 'ks': return KSNode(context, config));

            //case 'buffer source': return BufferSourceNode(context, config));

            //case 'reverb': return ReverbNode(context, config));
        }
    }


    getNodeById(id : number) : SynthNode | undefined {
        return this.nodes.get(id);
    }


    updateParameter(nodeId : number, pname : string, newValue : any) {
        let node = this.nodes.get(nodeId);
        node?.updateParameter(pname, newValue);
        this._updateReleaseValue();
    }

    updateConnectorLevel(nodeId : number, connectorId : number, dB : number) {
        let node = this.nodes.get(nodeId);
        node?.updateConnectorLevel(connectorId, dB);
    }


    attachAnalyzer(nodeId : number, connectorId : number, fftSize : number, channels : number) {
        let node = this.nodes.get(nodeId);
        node?.attachAnalyzer(connectorId, fftSize, channels);
    }

    detachAnalyzer(nodeId : number, connectorId : number) {
        let node = this.nodes.get(nodeId);
        node?.detachAnalyzer(connectorId);
    }

    getFloatTimeDomainData(nodeId : number, connectorId : number, channel : number, buff : Float32Array) {
        let node = this.nodes.get(nodeId);
        node?.getFloatTimeDomainData(connectorId, channel, buff);
    }


    _updateReleaseValue() {
        this.release = 0.0;
        this.nodes.forEach((node) => {
            if (node instanceof ADSRNode) {
                this.release = Math.max(Math.max(node.A + node.D, node.R), this.release);
            }
        });
    }


    static _sine_patch = {
      "nodes": [
        {
          "type" : "out",
          "A": 0.1,
          "D": 0.1,
          "S": 0.8,
          "R": 0.15,
          "id": 0
        },
        {
          "type" : "osc",
          "waveform" : "sine",
          "relative" : "true",
          "frequency" : 1.0,
          "id": 1,
          "level": 0.1
        }
      ],
      "routing": [
        { "source": 1, "dest": 0, "type": "out" }
      ]
    };


    static _custom_patch = {
      "nodes": [
        {
          "type": "out",
          "id": 0,
          "A": 0.0,
          "D": 0.1,
          "S": 1,
          "R": 0.3,
          "level": 0
        },
        {
          "type": "sample",
          "sample-pack": "custom",
          "samples": [
            {
              "sample": "<SOUNDURL>",
              "step": 60
            }
          ],
          "id": 1,
          "level": 0
        }
      ],
      "routing": [
        { "id": 2, "source": 1, "dest": 0, "type": "audio", "level": 0 }
      ]
    };
}
