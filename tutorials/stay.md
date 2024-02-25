---
layout: layouts/activity.njk
tags: tutorials
title: Stay Remix
subtitle: The Kid Laroi (ft. Justin Bieber)
authors: Remix by Helen Feng
description: Recreate Stay by The Kid Laroi (ft Justin Bieber). Practice using functions and parameters to define musical phrases.
level: Intermediate
time: 30-40 minutes
license: by-nc-sa
splash: /images/splash/stay-splash.jpg
project: https://tunepad.com/project/67340
audio: https://api.tunepad.com/api/projects/67340/audio/
disclaimer: This tutorial is based on STAY by The Kid Laroi and Justin Bieber, Columbia Records (2021). For educational purposes only.
---

# STEP 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and sign in.
* Create a new project and change the name to “Stay”.
* Set the temp to 170 BPM (beats per minute)

<img src="/images/drumpad.png" alt="Drum pad" width="200px" style="float: right; margin: 0 1rem;">

# STEP 2: Drums
* Add **Drum** to your project and set the instrument to **Drums → 909 Drumkit**
* Add this Python code and hit the **Play** button to hear how it sounds.
```python
kick = 1
snare = 3
playNote(kick, beats = 1, velocity = 80)
playNote(snare, beats = 0.5, velocity = 80)
playNote(kick, beats = 0.5, velocity = 100)
playNote(kick, beats = 1, velocity = 80)
playNote(snare, beats = 1, velocity = 100)
```
<img src="/images/bass.png" alt="Bass frets" width="200px" style="float: right; margin: 0 1rem;">

# STEP 3: Bass
* Add a Bass to your project, and set the instrument to **Bass → Synth Pop Bass**
* All the notes of the bass part are the same length, so we can play them with a loop like an arpeggio.
```python
notes = [ 30, 32, 34, 29 ]
for note in notes:
    playNote(note, beats = 4)
```

<img src="/images/keys.png" alt="Piano keyboard" width="200px" style="float: right; margin: 0 1rem;">

# STEP 4: Chords
* The chord progression consists of four chords played on top of the bass line.
* Add a new **Keys** cell to your project and set the instrument to **Synth → Leads → Bright Lead**

```python
playNote([ 42, 46, 49 ], beats = 4, velocity=60)
playNote([ 44, 48, 51 ], beats = 4, velocity=60)
playNote([ 46, 49, 53 ], beats = 4, velocity=60)
playNote([ 44, 48, 53 ], beats = 4, velocity=60)
```
<img src="/images/keys.png" alt="Piano keyboard" width="200px" style="float: right; margin: 0 1rem;">

# STEP 5: Melody
* The melody consists of repeated phrases that shift over time.
* To help make our code more readable, we're going to define several functions for each musical phrase.
* Then we use our functions to actually play the melody.
* Add a new **Keys** cell to your project and set the instrument to **Synth → Leads → Bright Lead**
```python
def phrase1(first_note):
    playNote(first_note, beats=0.5)
    playNote(48, beats=0.5)
    playNote(49, beats=0.5)
    playNote(56, beats=1.5)
    playNote(49, beats=1)

def phrase2():
    playNote(32, beats=1)
    playNote(48, beats=0.5)
    playNote(49, beats=1.5)
    playNote(44, beats=1)
    
def phrase3():
    playNote(29, beats=1)
    playNote(48, beats=0.5)
    playNote(49, beats=1.5)
    playNote(44, beats=0.5)
    playNote(46, beats=0.5)
    
def phrase4():
    playNote(29, beats=1)
    playNote(48, beats=0.5)
    playNote(49, beats=0.5)
    playNote(48, beats=0.5)
    playNote(44, beats=0.5)
    playNote(46, beats=0.5)
    
phrase1(30)
phrase2()

phrase1(34)
phrase3()

phrase1(30)
phrase2()

phrase1(34)
phrase4()
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
