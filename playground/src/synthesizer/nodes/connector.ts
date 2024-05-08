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
import { clamp, toInt, toNum, toStr, dBToGain } from "../../core/utils";
import { SynthNode } from "./node";



//-----------------------------------------------------------------------
// connectors are wired between connected nodes in the synth chain.
// connectors have output gain levels and can be used connnect analyzer
// nodes to inspect different links in the chain.
//-----------------------------------------------------------------------
export class SynthConnector {

    /// unique id number for this connector in this patch
    id = 0;

    get context(): BaseAudioContext { return this.source.context; }

    /// synth node with source signal feeding into this connector
    readonly source: SynthNode;

    /// the node's final output level is set through this gain node
    readonly level: GainNode;

    /// level value in decibels
    dB = 0.0;

    /// used to splice in a multi-channel analyzer node
    private _pre: GainNode | null = null;
    private _analyzers = new Array<AnalyserNode>();
    private _splitter : ChannelSplitterNode | null = null;
    private _merger : ChannelMergerNode | null = null;
    private _buffer : Float32Array | null = null;


    readonly type: string = '';


    constructor(source: SynthNode, config: any) {
        this.source = source;
        this.id = toInt(config['id'], -1);
        this.level = new GainNode(this.context);
        this.dB = toNum(config['level'], 0.0);
        this.level.gain?.setValueAtTime(dBToGain(this.dB), 0);
        this.type = toStr(config['type'], '');
    }

    updateLevel(dB: number) {
        this.dB = dB;
        (this._pre ?? this.level).gain?.setValueAtTime(dBToGain(dB), 0);
    }

    destroy() {
        this.level.disconnect();
    }

    attachAnalyzer(fftSize : number, channels : number, minDB : number = -60, maxDB : number = 5) {

        // maximum of 6 channels
        channels = clamp(channels, 1, 6);

        // splice the analyzers into the chain
        this._pre = new GainNode(this.context);
        this._splitter = this.context.createChannelSplitter(channels);
        this._merger = this.context.createChannelMerger(channels);

        this._pre.gain?.setValueAtTime(dBToGain(this.dB), 0);
        this.level.gain?.setValueAtTime(1.0, 0);

        this.source.level.disconnect(this.level);
        this.source.level.connect(this._pre);
        this._pre?.connect(this._splitter);
        this._merger?.connect(this.level);


        // create the analyzers
        for (let c = 0; c < channels; c++) {
            let analyzer = new AnalyserNode(this.level.context);
            this._analyzers.push(analyzer);
            analyzer.fftSize = fftSize;
            analyzer.minDecibels = minDB;
            analyzer.maxDecibels = maxDB;
            this._splitter?.connect(analyzer, c, 0);
            analyzer.connect(this._merger, 0, c);
            if (c == 0) {
                this._buffer = new Float32Array(analyzer.frequencyBinCount);
            }
        }
    }


    detachAnalyzer() {
        if (this._pre != null) {
            this.level.gain?.setValueAtTime(dBToGain(this.dB), 0);
            this.source.level.disconnect(this._pre);
            this._pre?.disconnect();
            this._splitter?.disconnect();
            this._merger?.disconnect();
            for (let analyzer of this._analyzers) {
                analyzer.disconnect();
            }

            this.source.level.connect(this.level);
            this._pre = null;
            this._buffer = null;
            this._splitter = null;
            this._merger = null;
            this._analyzers = [ ];
        }
    }

    getFloatTimeDomainData(channel : number, buff : Float32Array) {
        if (channel < this._analyzers.length) {
            const analyzer = this._analyzers[channel];
            if (this._buffer != null && buff.length == this._buffer.length) {
                analyzer.getFloatTimeDomainData(this._buffer!);
                for (let i = 0; i < buff.length; i++) { 
                    buff[i] += this._buffer![i];
                }
            }
        }
    }
}

