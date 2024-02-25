---
layout: layouts/activity.njk
tags: tutorials
title: Still D.R.E.
subtitle: Dr. Dre (ft. Snoop Dogg)
description: Learn to use variables in Python to make your code more readable. Use loops to create repeated musical elements.
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/still-dre-splash.jpg
video: https://drive.google.com/file/d/1mP2mVS8Jmuc4Ngyp1ecZ0m4lQDZSfysp/view?usp=sharing
slides: https://docs.google.com/presentation/d/1uGQr4CZrCok1f5ET55KI3unJ94lXqKJcWkeU5mRlRWE/edit
project: https://tunepad.com/project/44
audio: https://api.tunepad.com/api/projects/44/audio/
disclaimer: This tutorial is based on Still D.R.E. by Dr. Dre (ft. Snoop Dogg) (1999), Aftermath, Interscope. For educational purposes only.
---

# Step 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and sign in. 
* Create a new project and change the name to “Still DRE”.
* Set the temp to 90 BPM (beats per minute)

<img src="/images/bass.png" width="200px" style="float: right; margin-right: 1rem;">

# STEP 2: Bass
* Add a Bass cell to your project.
* Set the instrument to **Bass → Jazz Upright Bass**
* Add these four lines of code:
```python
playNote(21, beats = 3)
playNote(23, beats = 1)
playNote(16, beats = 3)
playNote(16, beats = 1)
```
<img src="/images/splash/drumkit-splash.png" width="250px" style="float: right; margin-right: 1rem;">

# STEP 3: Drums

* Add a Drum cell to your project 
* Set the instrument to **Drums → Rock Drumkit**
* This code uses **variables** to play the drum sounds. 
```python
kick = 0
snare = 2
hat = 5

playNote(kick, beats = 0.5)
playNote(hat, beats = 0.5)
playNote(snare, beats = 0.25)
playNote(kick, beats = 0.75)
playNote(kick, beats = 0.5)
playNote(hat, beats = 0.5)
playNote(snare)
```
<img src="/images/keys.png" width="250px" style="float: right; margin-right: 1rem;">

# STEP 4: Piano
The last step is to add the piano chords that make this song instantly recognizable.
* Add a new Keys cell to your project.
* Set the instrument to **Keyboard → Piano**
* This code uses loops to play repeated chords
```python
for i in range(8):
    playNote([72, 76, 81], beats = 0.25)
    rest(0.25)

for i in range(3):
    playNote([71, 76, 81], 0.25)
    rest(0.25)

for i in range(5):
    playNote([71, 76, 79], 0.25)
    rest(0.25)
```

## IMPORTANT 
* Some of this code is indented by four spaces
* We use indented code to tell Python what to repeat inside a loop
* Use exactly 4 spaces so that Python doesn’t get confused


# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
