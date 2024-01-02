
/**
 * This class synchronizes and manages all of the sequencers on the page.
 */
class Composer {

    constructor() {
        this.bpm = 100;
        this.context = null;
        this.start_time = 0;
        this.sequencers = [];
        this.sequencers.push(new Sequencer(this, 'drums', 8));
        this.loadState();

        // start the audio context on the first click
        document.addEventListener("click", function() { initAudio(); }, {once : true});
    }

    get currentBeat() {
        return (this.context.currentTime - this.start_time) * this.bpm / 60.0;
    }

    get isPlaying() {
        for (let s in this.sequencers) {
            if (s.isPlaying) return true;
        }
        return false;
    }

    saveState() {
        window.localStorage.setItem('bpm', `${bpm}`);
    }
    
    loadState() {
        let tempo = window.localStorage.getItem('bpm');
        if (isNaN(tempo)) {
            setTempo(100);
        } else {
            setTempo(parseInt(tempo));
        }
    }
    
    initAudio() {
        if (this.context === null) {
            this.context = new AudioContext();
            for (let s in this.sequencers) {
                s.initAudio(this.context);
            }
        }
    }
    
    play() {
        if (!this.isPlaying) {
            this.start_time = this.context.currentTime;
        }
    }
    
    pause() {
        if (this.isPlaying) {
            this.pauseAll();
        }
    }
    
    pauseAll() {
        for (let sequencer in this.sequencers) {
            sequencer.pause();
        }
    }
    
    stop() {
        for (let sequencer in this.sequencers) {
            sequencer.stop();
        }
    }

    setTempo(newBPM) {
        newBPM = Math.min(999, Math.max(newBPM, 5));
        if (this.isPlaying && this.context != null) {
            let last_beats = (this.context.currentTime - this.start_time) * this.bpm / 60;
            this.start_time = this.context.currentTime - last_beats * 60 / newBPM;
        }
        this.bpm = newBPM;
        sequencers.forEach(function(s) { s.tempoChange(); });
        let bpmField = querySelector('#tempo-field');
        if (bpmField) { bpmField.value = `${newBPM}`; }
        saveState();
    }
    

/*
    /// bind tempo button event handlers
    _bindSpinnerButton(querySelector('#tempo-up') as ButtonElement?, () { setTempo(bpm + 1); }, () {});
    _bindSpinnerButton(querySelector('#tempo-down') as ButtonElement?, () { setTempo(bpm - 1); }, () {});

    InputElement? f = querySelector('#tempo-field') as InputElement?;
    if (f != null) {
      f.onKeyPress.listen((e) { if (e.keyCode == 13) f.blur(); });
      f.onBlur.listen((e) { setTempo(toInt(f.value, 120)); });
      f.onInput.listen((e) { f.value = f.value!.replaceAll(RegExp(r'[^0-9]'), ''); });
      f.innerHtml = '$bpm';
    }
  }
*/

}



/**
 * Represents a highlighted cell in the sequencer that will generate a sound
 */
class DrumCell {

    constructor(sequencer, start, track) {
        this.sequencer = sequencer;
        this.start = start;  /// start time as a step count (each step is 0.25 beats)
        this.end = start;    /// end time as step count (if end == start, the note is 0.25 beats long)
        this.track = track;  /// which track (row) is this note on
        this.group = null;   /// contains all of the visual note elements (svg.GElement)
        this.rect = null;    /// the main highlighted rectangle (svg.RectElement)
        this.velocity = 0;   /// loudness

        this.group = new SVGGElement();
        this.rect = new SVGRectElement();
        this.rect.attributes['class'] = 'grid-note';
        this.group.append(this.rect);
        this.reposition();

        this.rect.addEventListener("pointerdown", (e) => {
            if (this.velocity === 0) {
                this.velocity = 100;
                this.previewSound();
            } else {
                this.velocity = 0;
                this.sequencer.removeNote(this);
            }
            this.sequencer.saveState();
            e.stopPropagation();
        });

        this.rect.addEventListener("pointerenter", (e) => {
            this.sequencer.setCodeHint(this);
            if (e.buttons > 0 && this.velocity === 0) {
                this.velocity = 100;
                this.previewSound();
                this.sequencer.saveState();
            }
            e.stopPropagation();
        })
    }

    get startBeat() { return this.start * 0.25; }
    get endBeat() { return this.end * 0.25; }

    save() {
        return {
            'start' : start,
            'end' : end,
            'track' : track,
            'velocity' : velocity
        };
    }

    load(Map state) {
    this.start = toInt(state['start'], 0);
    this.end = toInt(state['end'], 0);
    this.track = toInt(state['track'], 0);
    this.velocity = toInt(state['velocity'], 100);
    reposition();
  }


  void cueSound(AudioNode? dest, num delayBeats, num offsetBeats) {
    if (dest != null) {
      num? when = dest.context!.currentTime;
      if (delayBeats > 0 || startBeat == 0) {
        when = when! + (startBeat + delayBeats) * 60 / sequencer.bpm;
        playSound(dest, when);
      } else if (offsetBeats >= 0 && startBeat > offsetBeats) {
        when = when! + (startBeat - offsetBeats) * 60 / sequencer.bpm;
        playSound(dest, when);
      }

    }
  }


  void previewSound() {
    if (!sequencer.isPlaying) {
      cancelSound();
      AudioNode? dest = sequencer.context?.destination;
      if (dest != null) {
        num when = dest.context!.currentTime! + 0.25;
        playSound(dest, when);
      }
    }
  }


  void playSound([AudioNode? dest = null, num? when = 0 ]) {
    AudioBuffer? sound = sequencer.trackBuffer(track);
    num pitch = sequencer.trackPitchShift(track);
    dest ??= sequencer.context?.destination;
    if (dest == null || sound == null) return;
    num R = 0.2;
    if (when == 0) when = dest.context!.currentTime;
    num duration = max(0, (end! - start + 1)) * 0.25 * 60 / sequencer.bpm;
    _gain = dest.context!.createGain();
    _gain!.gain!.value = (velocity.clamp(0, 100) / 150);
    _gain!.gain!.setTargetAtTime(0, when! + duration, 0.33 * R);
    _source = dest.context!.createBufferSource();
    _source!.buffer = sound;
    _source!.playbackRate!.value = pitch;
    _source!.connectNode(_gain!);
    _gain!.connectNode(dest);
    _source!.start(when);
  }
  AudioBufferSourceNode? _source = null;
  GainNode? _gain = null;


  void cancelSound() {
    if (_gain != null) {
      _gain!.gain!.linearRampToValueAtTime(0, _gain!.context!.currentTime! + 0.25);
    }
  }


  void stopSound() {
    if (_gain != null) {
      _gain!.gain!.value = 0.0;
    }
  }


  bool overlaps(DrumCell other) {
    if (other.track != track) return false;
    if (other.start <= start && other.end! >= start) return true;
    if (other.start <= end! && other.end! >= end!) return true;
    if (other.start >= start && other.end! <= end!) return true;
    return false;
  }


  void reposition() {
    rect.setAttribute('x', '${sequencer.stepToX(start)}');
    rect.setAttribute('y', '${sequencer.trackToY(track)}');
    rect.setAttribute('width', '${sequencer.cellWidth * (end! + 1 - start)}');
    rect.setAttribute('height', '${sequencer.cellHeight}');

    rhand.setAttribute('x', '${sequencer.stepToX(end! + 1) - 10}');
    rhand.setAttribute('y', '${sequencer.trackToY(track)}');
    rhand.setAttribute('width', '10');
    rhand.setAttribute('height', '${sequencer.cellHeight}');

    lhand.setAttribute('x', '${sequencer.stepToX(start)}');
    lhand.setAttribute('y', '${sequencer.trackToY(track)}');
    lhand.setAttribute('width', '10');
    lhand.setAttribute('height', '${sequencer.cellHeight}');
  }


  int get velocity => _vel;
  set velocity(int v) {
    _vel = v.clamp(0, 100);
    if (v >= 100) {
      rect.classes.remove('dim');
    } else {
      rect.classes.add('dim');
    }
  }
}
