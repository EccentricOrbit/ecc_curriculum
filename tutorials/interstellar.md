---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Interstellar Theme
subtitle: Hans Zimmer
description: Recreate the iconic melody from the movie, Interstellar.
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/interstellar-splash.png
project: https://tunepad.com/project/68150
audio: https://api.tunepad.com/api/projects/68150/audio/
disclaimer: This tutorial is based on the Motion Picture Soundtrack by Hans Zimmer (2014) WaterTower Music. For educational purposes only.
---

Interstellar features a hauntingly beautiful soundtrack composed by Hans Zimmer in 2014.
In this short tutorial we'll recreate a simplified part of the melody from the main theme. 
If you're new to TunePad, you might want to try out the [Chicago House Beat](/tutorials/chicago-house) tutorial first.

# STEP 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com) and sign in
* Create a new project and call it "Interstellar"

<div class="noprint">
If you're not familiar with the Interstellar sound track you can listen to the main theme here:
<br><br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/kpz8lpoLvrA?si=FmTMzNj59VNrNMpH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<img src="/images/keys.png" alt="Piano keyboard" width="200px" style="float: right; margin: 0 1rem;">

# STEP 2: Left Hand Part
* In your project, click on the **ADD CELL** button then select **Keys**.
* Change the instrument to **Keyboard → Organ**
* For this part, we're going to play three slow chords (F Major, G Major, A minor)
* We define each chord with a variable and a list of note numbers

```python
FMaj = [ 41, 45, 48 ]
GMaj = [ 43, 47, 50 ]
Amin = [ 45, 48, 52 ]

playNote(FMaj, beats = 6)
playNote(GMaj, beats = 6)
playNote(Amin, beats = 6)
playNote(GMaj, beats = 6)
```

# STEP 3: Right Hand Part
* Click on **ADD CELL** and select **Keys**
* For this part we're going to play a slowly rising pattern that starts at an A note and goes up to E.
* We'll use variables to define each note
* A Python loop creates the pattern

```python
A = 81
B = 83
C = 84
D = 86
E = 88

for note in [A, B, C, D]:
    playNote(note, beats = 1, sustain = 3)
    playNote(E, beats = 2)
    playNote(note, beats = 1, sustain = 3)
    playNote(E, beats = 2)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
