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
import { Note } from "../core/note";
import { SynthNode } from "./nodes/node";
import { SynthEvent } from "./event";
import { SynthChain } from "./chain";
import { SynthParameter } from "./param";
import { clamp } from "../core/utils";
import { SoundLoader } from "./sounds";

export interface Patch {
    name : string,
    nodes : Array<any>,
    routing : Array<any>
}

function isPatch(object: any): object is Patch {
    return (
        typeof object.name === 'string' &&
        object.version === '2.0' &&
        object.format === 'tunepad-patch' &&
        Array.isArray(object.nodes) &&
        Array.isArray(object.routing)
    );
}

/// Generic note/audio synthesizer. The various instruments (bass, marimba,
/// drums, guitar) use samples and modullar synthesis to generate sounds.
export class Synthesizer {

    /// allow a maximum of 24 simultaneous notes
    static readonly MAX_GENERATORS = 24;

    /// tempo (beats per minute)
    get bpm() : number { return this._bpm; }
    set bpm(tempo : number) { this._bpm = clamp(tempo, 5, 300); }
    private _bpm = 90;

    /// list of currently scheduled or playing notes
    notes = new Array<SynthEvent>();

    /// is the synth currently playing a sound
    get isPlaying() {
        for (const chain of this.bank) { if (chain.free > 0) return true; }
        return false;
    }

    /// configuration settings for this synth patch
    patch : Patch = {
        name : 'piano',
        nodes : new Array<any>(),
        routing: new Array<any>()
    };

    /// name of this patch
    voice = 'simple sine';

    /// bank of tone generators that we can checkout to play notes
    bank = new Array<SynthChain>();

    /// list of scheduled sound generators
    sound_gens = new Array<SynthChain>();

    /// shortcut parameters that can be adjusted by user
    parameters = new Array<SynthParameter>();

    /// optional analyzer node for visualizing audio stream
    private _analyzer : AnalyserNode | null = null;

    private _analyzers = new Map<number, any>();


    /// creates a synthesizer with default patch
    constructor() {  }


    /// play and hold a note until releaseNote is called
    ///   note: note to be played (pitch and duration)
    ///   dest: ultimate audio destination
    playNote(note : Note, dest : AudioNode) : SynthEvent | null {
        let generator = this._allocateGenerator(dest.context, dest.context.currentTime!);
        if (generator == null) return null;
        generator.cancelNotes();
        generator.playNote(note, dest);
        const event = new SynthEvent(note, generator);
        this.notes.push(event);
        return event;
    }


    /// play and hold a custom sound until releaseNote is called
    ///   note: note to be played (pitch and duration)
    ///   dest: ultimate audio destination
    /*
    playSound(note : Note, soundURL : string, dest : AudioNode) : SynthEvent {
        const generator = new SynthChain.sound(dest.context, soundURL);
        generator.playNote(note, dest);
        const event = new SynthEvent(note, generator);
        this.notes.push(event);
        return event;
    }
    */

    /// schedule a note to be played in the future
    ///   note: note to be played (pitch and duration)
    ///   dest: ultimate audio destination
    ///   start: the start time for the note in beats
    ///   delta: time before the start of the next measure (in beats)
    ///          when this note is to be scheduled. if negative, it means
    ///          to skip the beginning of a loop
    scheduleNote(note: Note, dest: AudioNode, start: number, delta: number = 0): SynthChain | undefined {

        //-------------------------------------------------
        // convert from beats to seconds
        //-------------------------------------------------
        const now = dest.context.currentTime!;
        const duration = note.duration * (60 / this.bpm);
        start = (start + delta) * (60 / this.bpm);

        //-------------------------------------------------
        // allocate generator that's free at the note start time
        //-------------------------------------------------
        const generator = this._allocateGenerator(dest.context!, now + start);
        generator?.scheduleNote(note, start, duration, dest);
        return generator;
    }

/**
    scheduleSound(note: Note, soundURL: string, dest: AudioNode, start: number, delta: number = 0): SynthChain | null {
        const now = dest.context.currentTime;
        const duration = note.duration * (60 / this.bpm);
        start = (start + delta) * (60 / this.bpm);

        const generator = SynthChain.sound(dest.context!, soundURL);
        const release = generator.scheduleNote(note, start, duration, dest);
        this.sound_gens.push(generator);
        return generator;
    }
*/

    /// release a sustained note event
    release(event : SynthEvent) {
        if (event.released) return;
        event.released = true;
        event.chain.releaseNote();
        const timeout = Math.ceil(event.chain.release * 1000) + 100;
        setTimeout(() => {
            this.notes = this.notes.filter((e) => e !== event);
            event.chain.disconnect();
            this._releaseGenerator(event.chain);
        }, timeout);
    }


    releaseNote(note: Note) {
        this.notes.forEach((event) => {
            if (event.note.note == note.note) {
                this.release(event);
            }
        });
    }


    /// immediately release all notes that are currently being sustained
    releaseAll() {
        this.notes.forEach((event) => { this.release(event); });
    }


    /// cancel all scheduled notes
    cancelAllNotes() {
        for (const chain of this.bank) {
            this._releaseGenerator(chain);
        }
        for (const chain of this.sound_gens) {
            chain.cancelNotes();
        }
        this.sound_gens = [ ];
    }


    /// batch schedule notes and effects using an audio trace
    ///   dest: ultimate audio destination
    ///   start: the start time for the note in beats
    ///   delta: time before the start of the next measure (in beats)
    ///          when this note is to be scheduled. if negative, it means
    ///          to skip the beginning of a loop
    /*
    scheduleNotes(trace : Trace, dest : AudioNode, delta : number) {
        const now = dest.context.currentTime;
        const offset = Math.max(0, -delta);

        //-------------------------------------------------
        // cleanup old effects
        //-------------------------------------------------
        for (let i=0; i < this._effects.length; i++) {
            const fx = this._effects[i];
            if (fx.free > 0 && fx.free < now) {
                fx.disconnect();
                delete this._effects[i];
            }
        }
        this._effects = this._effects.filter(e => (typeof e !== 'undefined'));

        //-------------------------------------------------
        // cleanup previously scheduled sound generators
        //-------------------------------------------------
        for (let i=0; i<=this.sound_gens.length; i++) {
            const chain = this.sound_gens[i];
            if (chain.free < now) {
                delete this.sound_gens[i];
            }
        }
        this.sound_gens = this.sound_gens.filter(e => (typeof e !== 'undefined'));

        //-------------------------------------------------
        // schedule new notes
        //-------------------------------------------------
        List<Effect> estack = [ ];
        Effect rootFx = EmptyEffect(dest.context!);
        rootFx.beats = trace.beats;
        estack.add(rootFx);
        _effects.add(rootFx);
        rootFx.connect(dest, bpm, delta);

        for (TraceEvent t in trace.trace) {
        if (t.command == TraceEvent.START) {
        }
        else if (t.command == TraceEvent.PUSH_FX) {

            // TODO: don't allow duplicate effects in the stack?
            Effect parent = estack.last;
            Effect fx = Effect(t, dest.context!);
            fx.connect(parent.node, bpm, delta);
            estack.add(fx);
            _effects.add(fx);
        }
        else if (t.command == TraceEvent.POP_FX) {
            if (estack.length > 1) estack.removeLast();
        }
        else if (t.command == TraceEvent.PLAY && t.end >= offset) {
            SynthChain ? gen = scheduleNote(t.note, estack.last.node, t.time, delta);
            estack.forEach((fx) { fx.afterEffect(gen, t.time, t.note.duration, bpm, delta); });
        }
        else if (t.command == TraceEvent.SOUND && t.end >= offset && t['sound-url'] is String) {
            SynthChain ? gen = scheduleSound(t.note, t['sound-url'], estack.last.node, t.time, delta);
            estack.forEach((fx) { fx.afterEffect(gen, t.time, t.note.duration, bpm, delta); });
        }
        }
    }
    List<Effect> _effects = [ ];
*/

/**
 * Render audio into a buffer using an offline audio context
 */
/*
  Future<AudioBuffer> recordIntoBuffer(Trace trace, num start, num beats,
    [ Function? onProgress = null ]) async {

    // used to report total recording time...
    DateTime starting = DateTime.now();

    num duration = beats * (60 / bpm);
    num rate = 44100;
    int frames = (rate * duration).round();
    OfflineAudioContext oac = OfflineAudioContext(2, frames, rate);

    scheduleNotes(trace, oac.destination!, (start > 0) ? -start : 0);

    // ------------------------------------------------------------------
    // javascript timer tracks oac progress...
    // ------------------------------------------------------------------
    num stime = oac.currentTime!;
    Timer.periodic(const Duration(milliseconds : 500), (t) {
      num elapsed = oac.currentTime! - stime;
      if (elapsed >= duration) {
        t.cancel();
      } else if (onProgress != null) {
        onProgress(min(1.0, elapsed / duration));
      }
    });

    AudioBuffer recording = await oac.startRendering();

    if (onProgress != null) onProgress(1.0);
    return recording;
  }
*/

    /// set the pitch bend "wheel" to the given number of cents.
    /// this only applies to currently scheduled or playing notes.
    pitchBend(cents : number) {
        this.notes.forEach((event) => event.chain.pitchBend(cents));
    }


    /**
     * URL should point to a JSON file with patch details.
     * Links to audio samples in a patch will be relative to the URL path
     * After loading the JSON object, sets up audio nodes and loads all audio resources
     */
    async loadPatch(url : string, context: AudioContext) : Promise<boolean> {
        try {
            let response = await fetch(url);
            let json = await response.json();

            if (isPatch(json)) {
                const path = url.split('/').slice(0, -1).join('/') + "/";
                this.voice = json.name;
                this.patch = json;
                this.parameters = [ ];
                this._destroyAllGenerators();
                this.sound_gens = [];

                for (const node of this.patch.nodes) {
                    if (node["type"] === "sample" && Array.isArray(node["samples"])) {
                        for (const sample of node["samples"]) {
                            if (sample["sample"] != null) {
                                const name = path + sample['sample'];
                                sample["sample"] = name;
                                await SoundLoader.loadAudioBuffer(name, context);
                            }
                        }
                    }
                    else if (node['type'] === 'reverb') {
                        await SoundLoader.loadCustomSound(node['impulse'], context);
                    }
                    else if (node['type'] === 'buffer source') {
                        await SoundLoader.loadCustomSound(node['buffer'], context);
                    }
                }                
                return true;
            }
        }
        catch(e) {
            console.log("Failed to load audio patch.", e);
        }
        finally {
            return false;
        }
/*




        for (const config of patch['parameters']) {
            this.parameters.push(SynthParameter.fromJSON(config));
        }

        /// allocate at least one tone generator
        const chain = new SynthChain(context);
        chain.loadPatch(patch);
        this.bank.push(chain);
        return true;
    */
    }


    /// return a synthesizer node (modular synth node) matching the given
    /// node id number. node from the first tone generator will be used.
    /// return null if there are not tone generators or no matching nodes
    getNodeById(id : number) : SynthNode | undefined {
        return (this.bank.length > 0) ? this.bank[0]?.getNodeById(id) : undefined;
    }


    /// update parameter value for a node in all tone generators
    updateParameter(nodeId : number, pname : string, value : any) {

        /// update any node instances in active tone generators
        this.bank.forEach((chain) => { chain.updateParameter(nodeId, pname, value); });

        /// update the patch itself to match the new parameter value
        for (const node of this.patch.nodes) {
            if (node['id'] == nodeId) node[pname] = value;
        }
    }

    /*

  /// update connector gain level
  void updateConnectorLevel(int nodeId, int connectorId, num dB) {
    bank.forEach((chain) { chain.updateConnectorLevel(nodeId, connectorId, dB); });
    if (patch['routing'] is List) {
      for (Map conn in patch['routing']) {
        if (conn['id'] == connectorId) {
          conn['level'] = dB;
        }
      }
    }
  }


  /// ask the synthesizer to keep analyzer nodes attached to the given node connector
  void attachAnalyzer(int nodeId, int connectorId, int fftSize, int channels) {
    _analyzers[connectorId] = {
      'nodeId' : nodeId,
      'connectorId' : connectorId,
      'fftSize' : fftSize,
      'channels' : channels
    };
  }

  void detachAnalyzer(int nodeId, int connectorId) {
    bank.forEach((chain) { chain.detachAnalyzer(nodeId, connectorId); });
    _analyzers.remove(connectorId);
  }


  /// collects time domain data from all attached analyzers at the given connector
  void getFloatTimeDomainData(int nodeId, int connectorId, int channel, Float32List buff) {
    buff.fillRange(0, buff.length, 0);  // zero out list
    bank.forEach((chain) {
      if (chain.free > 0) {
        chain.getFloatTimeDomainData(nodeId, connectorId, channel, buff);
      }
    });
  }
*/

    /// checkout a tone generator to play a sound
    private _allocateGenerator(context : BaseAudioContext, when : number) : SynthChain | undefined {
        if (this.bank.length > 0 && this.bank[0].context != context) {
            this._destroyAllGenerators();
        }

        for (const chain of this.bank) {
            if (chain.free < when && chain.context == context) {
                this._analyzers.forEach((m) => {
                    if (chain.free == 0) {
                        chain.attachAnalyzer(m['nodeId'], m['connectorId'], m['fftSize'], m['channels']);
                    }
                });
                return chain;
            }
        }


        if (this.bank.length < Synthesizer.MAX_GENERATORS) {
            const chain = new SynthChain(context);
            chain.loadPatch(this.patch);
            this.bank.push(chain);
            this._analyzers.forEach((a) => {
                chain.attachAnalyzer(a['nodeId'], a['connectorId'], a['fftSize'], a['channels']);
            });
            return chain;
        } else {
            return undefined;
        }
    }


    _releaseGenerator(generator: SynthChain) {
        generator.cancelNotes();
        this._analyzers.forEach((m) => {
            generator.detachAnalyzer(m['nodeId'], m['connectorId']);
        })
    }


    _destroyAllGenerators() {
        this.bank.forEach((chain) => { chain.destroy(); });
        this.bank = [ ];
    }

}
