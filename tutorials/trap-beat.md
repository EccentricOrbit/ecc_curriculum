---
layout: layouts/activity.njk
tags: [ "learn", "livecoders" ]
category: Tutorial
title: Advanced Trap Beat
description: Build a custom trap beat in TunePad using loops, functions, and parameters. 
level: Intermediate
time: 25 minutes
license: by-nc-sa
splash: /images/splash/trap-beat-splash.png
project: https://tunepad.com/project/77996
audio: https://api.tunepad.com/api/projects/77996/audio/
---

# Step 1: Define Variables
Add these three lines to the top of your code to define variable names for the drum sounds.
Feel free to experiment with different values to get different kinds of sounds.
```python
kick = 1
snare = 2
hat = 4
```

# Step 2: Basic Pattern
Here's code for a basic drum pattern. Add this code to your project after the variables and then press PLAY ▶ to hear how it sounds.
The `playNote` function tells TunePad to play a sound. The `beats` parameter says how long the note should play:
```python
playNote(kick, beats = 0.75)
playNote(kick, beats = 0.25)
playNote(snare, beats = 0.5)
playNote(kick, beats = 1)
playNote(kick, beats = 0.5)
playNote(snare, beats = 1)
```
When you're done, the beat pattern should sound like this.

<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=3&track4=0101&track5=9440" scrolling="no" class="composer-iframe"></iframe>


# Step 3: Stuttered Hats
In this section, we're going to define our own functions to create stutter-step hi-hat sounds.

### Define helper functions
Add this snippet to the beginning of your code right after the variable definitions.

```python
# divide 16th notes into even stutter steps
def stutter(count):
    for i in range(0, count):
        playNote(hat, beats = 0.25 / count)


# repeat 16th notes for the given number of times
def hats(count):
    for i in range(0, count):
        playNote(hat, beats = 0.25)
```

### Use the functions
Now we're going to use these two functions to create a stuttered hat pattern. 

```python
# ------ hi-hat pattern ------
moveTo(0)
hats(7)
stutter(2)
hats(1)
stutter(3)
hats(4)
stutter(5)
stutter(2)
```

# Try It
Try experimenting with the hi-hat pattern to make it your own composition.
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
