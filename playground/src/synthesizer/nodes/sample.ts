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
import { SoundLoader } from '../sounds';
import { EffectCurve } from './curve';
import { SynthNode } from './node';
import { SynthConnector } from './connector';
import { Note } from '../../core/note';
import { toNum, toStr } from '../../core/utils';


interface PitchedSample {
    sample : string,
    step: number
}

function isPitchedSample(p: any): p is PitchedSample {
    return (
        typeof p === 'object' &&
        'sample' in p && typeof p.sample === 'string' &&
        'step' in p && typeof p.step === 'number'
    );
}

//-----------------------------------------------------------------------
// Sample Node: uses an array of samples mapped to pitches
//-----------------------------------------------------------------------

export class SynthSampleNode extends SynthNode {

    sources = new Array<AudioBufferSourceNode>();

    /// playback rate parameter
    playback = 1.0;

    /// bridge to the playback rate parameter
    pIn : GainNode;

    /// the detune parameter
    detune = 0.0;

    /// bridge to the detune parameter
    dIn : GainNode;

    /// which built-in sample pack are we using?
    sample_pack = 'piano';
    samples = new Array<PitchedSample>();

    /// calculated playback rate based on note pitch and sample pack
    private _rate = 1.0;

    /// drumkits use different algorithm for matching notes to sounds
    drumkit = false;


    constructor(context : BaseAudioContext, config : any) {
        super(context, config);
        this.playback = toNum(config['playback'], this.playback);
        this.detune = toNum(config['detune'], this.detune);
        this.sample_pack = toStr(config['sample-pack'], this.sample_pack);

        this.dIn = new GainNode(context);
        this.pIn = new GainNode(context);
        this.dIn.gain.value = toNum(config['detune-mod'], 1.0);
        this.pIn.gain.value = toNum(config['playback-mod'], 1.0);

        if ('samples' in config && Array.isArray(config['samples'])) {
            this.loadSamplePack(config['samples']);
        }
    }


    private loadSamplePack(samples : Array<any>) {
        this.samples = samples
            .filter(s => isPitchedSample(s))
            .sort((a, b) => a.step - b.step);
        this.samples.forEach(s => SoundLoader.loadAudioBuffer(s.sample, this.context));
    }


    playNote(note : Note) {
        this.scheduleNote(note, 0, 0, 0);
    }


    private findBestSample(note : Note) : PitchedSample | undefined {
        let samp : PitchedSample | undefined;
        if (this.drumkit) {
            // different from the dart implementation (!) which uses note.step
            samp = this.samples.find(s => s.step === Math.round(note.note));
        }
        else {
            let score = 100000;
            for (const s of this.samples) {
                // perfect pitch
                if (s.step == note.note) {
                    return s;
                }
                // stop searching if we're greater than the target
                else if (s.step > note.note) {
                    const d = (s.step - note.note) + 3; // 3-step penalty for overshooting
                    return (d < score) ? s : samp;
                }
                // keep searching while we're below the target pitch
                else {
                    const d = (note.note - s.step);
                    if (d < score) {
                        samp = s;
                        score = d;
                    }
                }
            }
        }
    }


    scheduleNote(note : Note, when : number, duration : number, release : number) {
        let sampleDuration = 0;
        const offset = (when < 0) ? -when : 0;
        when = Math.max(0, when);

        const sample = this.findBestSample(note);

        if (sample) {
            const buffer = SoundLoader.getAudioBuffer(sample.sample);

            if (buffer) {
                const delta = (note.note - sample.step);
                const now = this.context.currentTime;
                const pb = Math.pow(2, delta / 12);
                const source = new AudioBufferSourceNode(this.context);
                source.connect(this.level);
                this.sources.push(source);

                this.dIn.connect(source.detune);
                this.pIn.connect(source.playbackRate);

                source.buffer = buffer;
                //source?.detune?.value = detune;
                source.playbackRate.value = pb * this.playback;

                source.start(when + now, offset);
                if (duration > 0) {
                    source.stop(when + now + duration + release);
                }
                source.addEventListener('ended', (e) => {
                    this.sources = this.sources.filter((item) => item !== source);
                    // these gain nodes seem to get automatially disconnected by webaudio on end
                    //pIn.disconnect(source);
                    //dIn.disconnect(source);
                    source.disconnect();
                });
                sampleDuration = buffer.duration / (pb * this.playback);
                this._rate = pb;
            }
        }
        //return min(sampleDuration, duration);
    }


    cancelNotes() {
        super.cancelNotes();
        this.sources.forEach((source) => {
            source.stop();
            source.disconnect();
        });
        this.sources = new Array<AudioBufferSourceNode>();
        this._rate = 1.0;
    }


    destroy() {
        super.destroy();
        this.sources.forEach((source) => {
            source.stop();
            source.disconnect();
        });
        this.sources = new Array<AudioBufferSourceNode>();
        this._rate = 1.0;
    }


    pitchBend(cents : number) {
        const when = this.context.currentTime;
        this.sources.forEach((source) => {
            source.detune?.setTargetAtTime(this.detune + cents, when, 0.1);
        });
    }


    /// bend the pitch of a note by the given number of cents (hundredths of a half step)
    /// The main parameter is an array of floating-point numbers representing the curve the
    /// note will change along its duration. The specified values are spaced equally along this duration.
    ///    start - start time of the bend in seconds
    ///    cents - pitch bend value curve over time
    schedulePitchBend(start : number, cents : EffectCurve) {
        if (this.sources.length > 0) {
            const last = this.sources[this.sources.length - 1];
            cents.apply(last.detune, start, this.context, this.detune);
        }
    }


    connect(source : SynthConnector, dest : string) {
        if (dest == 'detune') {
            source.level.connect(this.dIn);
        } else if (dest == 'playback') {
            source.level.connect(this.pIn);
        }
    }


    /// update a node parameter by name
    updateParameter(pname : string, newValue : any) {
        if (pname == 'playback') {
            this.playback = toNum(newValue, this.playback);
            this.sources.forEach((source) => {
                source.playbackRate?.setValueAtTime(this._rate * this.playback, this.context.currentTime);
            });
        } 
        else if (pname == 'detune') {
            this.detune = toNum(newValue, this.detune);
            this.sources.forEach((source) => {
                source.detune?.setValueAtTime(this.detune, this.context.currentTime);
            });
        }
        else if (pname == 'sample-pack') {
            //loadSamplePack(toStr(newValue, sample_pack));
        }
        else if (pname == 'playback-mod') {
            this.pIn.gain.value = toNum(newValue, 1.0);
        }
        else if (pname == 'detune-mod') {
            this.dIn.gain.value = toNum(newValue, 1.0);
        }
        else {
            super.updateParameter(pname, newValue);
        }
    }

/*
    Future<Float32List> getVisualizationData() async {
        SynthSampleNode wavegen = SynthSampleNode(context, { });
        wavegen.loadSamplePack(sample_pack);

        AnalyserNode analyzer = AnalyserNode(context);
        GainNode gain = GainNode(context);

        analyzer.fftSize = 512;
        analyzer.smoothingTimeConstant = 0;
        gain.gain?.value = 0.0;

        var buff = Float32List(analyzer.frequencyBinCount!);
        wavegen.level.connectNode(analyzer);
        wavegen.level.gain?.value = 2.0;
        analyzer.connectNode(gain);
        gain.connectNode(context.destination!);
        wavegen.playNote(Note(72));
        await Future.delayed(const Duration(milliseconds : 100));
        analyzer.getFloatTimeDomainData(buff);
        wavegen.releaseNote();
        analyzer.disconnect();
        wavegen.destroy();
        return buff;
    }
*/
}
