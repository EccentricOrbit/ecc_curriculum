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

import { SynthNode } from './node';
import { SynthConnector } from './connector';
import { Note } from '../../core/note';
import { clamp, toNum } from '../../core/utils';


//-----------------------------------------------------------------------
// Simplified ADSR Envelope Node
//-----------------------------------------------------------------------
export class ADSRNode extends SynthNode {

    /// 'attack' value of the ADSR envelope for this note (seconds)
    A = 0.1;

    /// 'decay' value of the ADSR envelope for this note (seconds)
    D = 0.1;

    /// 'sustain' value of the ADSR envelope for this note (0.0 - 1.0)
    S = 1.0;

    /// 'release' value of the ADSR envelope for this note (seconds)
    R = 0.2;

    // curve shapes: 1 -> line, >1 -> exp, <1 -> log.
    aShape = 5.0;
    dShape = 2.0;
    rShape = 2.0;


    /// sample rate for envelope curves
    static readonly samplesPerSecond = 300;

    /// the envelope is created with three gain nodes chained together.
    private _attack : GainNode;
    private _decay : GainNode;
    private _release : GainNode;

    attackCurve : number[] = [ ];
    decayCurve : number[] = [ ];
    releaseCurve : number[] = [ ];

  
    constructor(context : BaseAudioContext, config : any) {
        super(context, config);
        this.A = toNum(config['A'], this.A);
        this.D = toNum(config['D'], this.D);
        this.S = toNum(config['S'], this.S);
        this.R = toNum(config['R'], this.R);
        this.R = Math.max(this.R, 0.01);

        this.aShape = toNum(config['a shape'], this.aShape);
        this.dShape = toNum(config['d shape'], this.dShape);
        this.rShape = toNum(config['r shape'], this.rShape);

        this._attack = context.createGain();
        this._decay = context.createGain();
        this._release = context.createGain();

        this._attack.gain.value = 0.0;
        this._decay.gain.value = 1.0;
        this._release.gain.value = 1.0;

        this._attack.connect(this._decay);
        this._decay.connect(this._release);
        this._release.connect(this.level);

        this._buildCurves();
    }


    connect(source : SynthConnector, dest : string) {
        source.level.connect(this._attack);
    }


    playNote(note : Note) {
        let when = this.context.currentTime;
        try {
            this._attack.gain?.cancelScheduledValues(0);
            this._decay.gain?.cancelScheduledValues(0);
            this._release.gain?.cancelScheduledValues(0);

            // this logic is necessary for drum samples to have the right punch level
            if (this.A > 0) {
                this._attack.gain?.setValueAtTime(0.0, when);
            } else {
                this._attack.gain?.setValueAtTime(1.0, when);
            }
            this._decay.gain?.setValueAtTime(1.0, when);
            this._release.gain?.setValueAtTime(1.0, when);

            when = this.context.currentTime + 0.01;

            if (this.A > 0) {
                this._attack.gain?.setValueCurveAtTime(this.attackCurve, when, this.A);
            } else {
                this._attack.gain?.setValueAtTime(1.0, when);
            }
            if (this.D > 0) {
                this._decay.gain?.setValueCurveAtTime(this.decayCurve, when + this.A, this.D);
            } else {
                this._decay.gain?.setValueAtTime(this.S, when + this.A);
            }
        }
        catch (x) {
            console.log('Exception in ADSR playNote $x.');
        }
    }


    releaseNote() {
        const when = this.context.currentTime;
        if (this.R > 0) {
            this._attack.gain?.cancelScheduledValues(when);
            this._decay.gain?.cancelScheduledValues(when);
            this._release.gain?.setValueCurveAtTime(this.releaseCurve, when, this.R);
        } else {
            this._release.gain?.setValueAtTime(0.0, when);
        }
    }


    scheduleNote(note : Note, when : number, duration : number, release : number) {
        const offset = (when < 0) ? -when : 0;
        when = (when < 0) ? 0 : when;
        let start = when + this.context.currentTime;

        // this logic is necessary for drum samples to have the right punch level
        if (this.A > 0) {
            this._attack.gain?.setValueAtTime(0.0, start);
        } else {
            this._attack.gain?.setValueAtTime(1.0, start);
        }
        this._decay.gain?.setValueAtTime(1.0, start);
        this._release.gain?.setValueAtTime(1.0, start);   // exception here

        start += 0.01;

        if (this.A > 0 && this.A > offset) {
            const a = this.A - offset;
            this._attack.gain?.setValueCurveAtTime(this.attackCurve, start, a);
        } else {
            this._attack.gain?.setValueAtTime(1.0, start);
        }

        if (this.D > 0 && this.A + this.D > offset && duration > this.A) {
            const d = (offset >= this.A) ? this.D - (offset - this.A) : this.D;
            const s = (offset >= this.A) ? start : start + this.A - offset;
            this._decay.gain?.setValueCurveAtTime(this.decayCurve, s, d);
            if (this.A + this.D > duration) {
                this._decay.gain?.cancelScheduledValues(start + duration - offset);
            }
        } else {
            this._decay.gain?.setValueAtTime(this.S, Math.max(0, start + this.A + this.D - offset));
        }

        if (duration + this.R > offset) {
            const r = (offset >= duration) ? this.R - (offset - duration) : this.R;
            this._release.gain?.setValueCurveAtTime(this.releaseCurve, start + duration - offset, r);
        } else {
            this._release.gain?.setValueAtTime(0.0, start);
        }
    }


    cancelNotes() {
        super.cancelNotes();
        const when = this.context.currentTime;
        this._release.gain?.cancelScheduledValues(when);
        this._release.gain.value = 0.0;
        this._attack.gain?.cancelScheduledValues(when);
        this._attack.gain.value = 0.0;
        this._decay.gain?.cancelScheduledValues(when);
        this._decay.gain.value = 0.0;
    }


    destroy() {
        super.destroy();
        this._attack.disconnect();
        this._decay.disconnect();
        this._release.disconnect();
    }


    updateParameter(pname : string, newValue : any) {
        super.updateParameter(pname, newValue);
        switch(pname) {
            case 'A': this.A = toNum(newValue, this.A); break;
            case 'D': this.D = toNum(newValue, this.D); break;
            case 'S': this.S = toNum(newValue, this.S); break;
            case 'R': this.R = toNum(newValue, this.R); break;
            case 'a shape': this.aShape = toNum(newValue, this.aShape); break;
            case 'd shape': this.dShape = toNum(newValue, this.dShape); break;
            case 'r shape': this.rShape = toNum(newValue, this.rShape); break;
        }
        this.R = Math.max(this.R, 0.01);
        this._buildCurves();
    }


    /// build Attack, Decay, and Release curves
    _buildCurves() {
        this._buildAttackCurve(this.aShape);
        this._buildDecayCurve(this.dShape);
        this._buildReleaseCurve(this.rShape);
    }


    _buildAttackCurve(shape : number) {
        shape = clamp(shape, 0.001, 8.0);
        this.attackCurve = [ ];
        const samples = Math.ceil(ADSRNode.samplesPerSecond * this.A);
        if (samples > 0) {
            for (let i = 0; i <= samples; i++) {
                let p = i / samples;
                p = Math.pow(p, shape);
                this.attackCurve.push(p);
                //num db = 50 * (i / samples - 1);
                //_Acurve.add(dBToGain(db).toDouble());
            }
        }
    }

    _buildDecayCurve(shape : number) {
        shape = clamp(shape, 0.001, 4.0);
        this.decayCurve = [ ];
        const samples = Math.ceil(ADSRNode.samplesPerSecond * this.D);
        if (samples > 0) {
            for (let i = 0; i <= samples; i++) {
                let p = i / samples;
                p = 1 - Math.pow(p, shape);
                this.decayCurve.push((1.0 - this.S) * p + this.S);
            }
        }
    }

    _buildReleaseCurve(shape : number) {
        shape = clamp(shape, 0.001, 4.0);
        this.releaseCurve = [ ];
        const samples = Math.ceil(ADSRNode.samplesPerSecond * this.R);
        if (samples > 0) {
            for (let i = 0; i <= samples; i++) {
                let p = i / samples;
                p = 1 - Math.pow(p, shape);
                this.releaseCurve.push(p);
            }
        }
    }

/*
    Future<Float32List> getVisualizationData() {
        int samples = ((A + D + R) * 0.2 * samplesPerSecond).ceil();
        double l = toNum(level.gain?.value, 1.0).toDouble();
        var Acurve = List<double>.from(_Acurve.map((v) => v * l));
        var Dcurve = List<double>.from(_Dcurve.map((v) => v * l));
        var Scurve = List<double>.filled(samples, S.toDouble() * l);
        var Rcurve = List<double>.from(_Rcurve.map((v) => v * S * l));
        return Future.sync(() => Float32List.fromList(Acurve + Dcurve + Scurve + Rcurve));
    }
*/
}
