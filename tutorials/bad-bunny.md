---
layout: layouts/activity.njk
tags: [ "tutorials", "livecoders" ]
category: Tutorial
title: Bad Bunny Remix
description: Learn to use lists in Python to create chords. Practice using chords together to make progressions.
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/bad-bunny-splash.png
project: https://tunepad.com/project/43861
audio: https://api.tunepad.com/api/projects/43861/audio/
disclaimer: This tutorial creates a beat inspired by LA CANCIÓN (J Balvin and Bad Bunny). For educational purposes only.
---

# STEP 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and sign in. 
* Create a new project and change the name to “Bad Bunny”.
* Set the temp to 90 BPM (beats per minute)

<img src="/images/keys.png" width="200px" style="float: right; margin-right: 1rem;">

# STEP 2: Chords
* Add a Keys cell to your project and set the instrument to **Keyboard → Organ**
* This code uses four variables to hold the chords we want to play
* Each chord is a **list** of note numbers
```python
chord1 = [ 48, 52, 55, 59 ]
chord2 = [ 52, 55, 60, 62 ]
chord3 = [ 50, 55, 59 ]
chord4 = [ 50, 53, 57, 59 ]

playNote(chord1, beats = 4)
playNote(chord2, beats = 4)
playNote(chord3, beats = 4)
playNote(chord4, beats = 4)
```

# STEP 3: Drums
* Add a Drum cell to your project 
* Set the instrument to **Drums → Headlines Drums**
* This code uses **variables** to play the drum sounds. 
```python
kick = 0
snare = 2

playNote(kick, 0.75)
playNote(snare, beats = 0.25)
playNote(kick, beats = 0.5)
playNote(snare, beats = 0.5)
playNote(kick, beats = 0.75)
playNote(snare, beats = 0.25)
playNote(kick, beats = 0.5)
playNote(snare, beats = 0.5)
```

# STEP 4: Hi-Hats (optional)
The last step adds hi-hats using a loop in Python. Feel free to try this code out if you want to.

Add a new Drum cell to your project and set the instrument to **Drums → Headlines Drums**
```python
hat = 5

for i in range(14):
    playNote(hat, beats = 0.25)

for i in range(4):
    playNote(hat, beats = 0.25 / 2)
```

## IMPORTANT 
* Some of this code is indented by four spaces
* We use indented code to tell Python what to repeat inside a loop
* Use exactly 4 spaces so that Python doesn’t get confused

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
