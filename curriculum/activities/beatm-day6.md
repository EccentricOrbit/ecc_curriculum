---
layout: layouts/activity.njk
tags: beatmakers
category: Curriculum
title: Arpeggios
description: An arpeggio is a chord that is broken up and played rapidly one note at a time. Arpeggios combine melody, harmony, and rhythm all in one. With Python it’s easy to use a for loop to play an arpeggio.
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/stranger-things-splash.jpg
video: https://drive.google.com/file/d/1Er4rBmwG3Jj7FyCdDEIc8GfMkdx-Nuav/view?usp=sharing
slides: https://docs.google.com/document/d/1GJFpag52fC_8d6yRB6AliR6dF6JXxbo4yqCQENfbcxI/edit?usp=sharing
project: https://tunepad.com/project/27933
audio: https://api.tunepad.com/api/projects/27933/audio/
---

# Step 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Stranger Things”.

# Step 2: Heartbeat
We’ll start with the heartbeat drums that give the theme its sense of excitement, unease, and anxiety. 
It’s the quickened pulse of a human heartbeat. Create a new Drum cell in TunePad, and use this code:
```python
playNote(1, beats = 0.5)
playNote(1, beats = 0.5, velocity = 50)
rest(1)

playNote(1, beats = 0.5)
playNote(1, beats = 0.5, velocity = 50)
rest(1)
```
The heartbeat sounds like a LUB-dub, LUB-dub. Notice that we use the `velocity` parameter to make the first LUB kicks louder than the second dub kicks.

# Step 3: Ominous Drone
We’re going to add a low, ominous drone that slowly fades in and out of the mix.  
Add a new Keys cell to your project and switch the voice to **Synth → Leads → Searing Lead**.

<a href="/images/stranger-things-fig1.png" target="_blank">
<img src="/images/stranger-things-fig1.png" alt="Screenshot of a TunePad keyboard instrument" width="450px" style="margin: 1rem;"></a>


Use this code for your drone sound:
```python
with lowpass(frequency = [0, 1100, 0], beats = 40):
    playNote(16, beats = 40)
```
This uses an audio production tool called a **lowpass filter** that slowly opens and closes over 40 beats.

# STEP 4: Arpeggio
Add a Keys cell to your project and change the voice to **Synth → Bass → PWM Synth Bass**.

An _arpeggio_ is a chord broken into a series of individual notes played in rapid succession. 
Arpeggios are used everywhere in music and contribute rhythmic, harmonic, and melodic elements to a song. 
The Stranger Things theme uses an iconic arpeggio consisting of a C Major 7 chord played up and then back down in order of pitch.
```python
chord = [ 24, 28, 31, 35, 36, 35, 31, 28 ]
for note in chord:
    playNote(note, beats = 0.5)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
