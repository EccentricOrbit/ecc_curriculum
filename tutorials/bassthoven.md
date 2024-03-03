---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: "Bassthoven"
description: Use Python lists to create longer melodies with this remix of Bassthoven by Kyle Exum.
level: Advanced
time: 30 minutes
license: by-nc-sa
splash: /images/splash/bassthoven-splash.png
project: https://tunepad.com/project/36897
audio: https://api.tunepad.com/api/projects/36897/audio/
disclaimer: Tutorial based on Bassthoven by Kyle Exum. This project is for educational purposes.
---

# OVERVIEW
For this activity we’ll recreate Bassthoven by Kyle Exum. Because this song has a long melody, we’ll learn how to play sequences of notes written out as Python lists. Start by creating a new project in TunePad and naming it Bassthoven.


# STEP 1: Variables
Create a new Keyboard instrument, and add some variables for our different note names.
```python
A = 69    # set the variable A equal to 69
B = 71
C = 72
D = 74
E = 76
Eb = 75   # E flat
Gs = 68   # G sharp
_ = None
```

The last line is a little strange. It defines one more variable. 
In Python the underscore `_` character is a valid variable name.
This variable has a special value called `None`. 
Calling `playNote` with this value is the same thing as a rest. It plays nothing.

# STEP 2: Phrases
For this song we’re going to define four musical phrases that get repeated to make the melody.
Each phrase gets its own variable.
Each variable will hold lists of numbers with the sequence of notes to be played.
We use the underscore character `_` to play nothing.
Sometimes we subtract 12 from a note. That means to play the note an octave lower.

```python
# four basic phrases that repeat throughout
p1 = [ E, Eb, E, Eb, E, B, D, C, A, _, _, _ ]
p2 = [ A, C - 12, E - 12, A, B, _, _, _ ]
p3 = [ B, E - 12, Gs, B, C, _, _, _, C, _, _, _ ]
p4 = [B, E - 12, C, B, A, _, _, _, A, _, _, _ ]
```

<img src="/images/keys.png" width="200px" style="float: right; margin-right: 1rem;">

# STEP 3: Playing the Phrases
Now that we’ve defined our variables, we can start to play the melody. One way to do this is to use a Python for-loop to iterate through every note. One cool thing about Python is that we can join lists together using the plus sign (+).   

Here’s what everything looks like together.
```python
_ = None
A = 69
B = 71
C = 72
D = 74
E = 76
Eb = E - 1    # E flat
Gs = A - 1    # G sharp

# four basic phrases that repeat throughout
p1 = [ E, Eb, E, Eb, E, B, D, C, A, _, _, _ ]
p2 = [ A, C - 12, E - 12, A, B, _, _, _ ]
p3 = [ B, E - 12, Gs, B, C, _, _, _, C, _, _, _ ]
p4 = [ B, E - 12, C, B, A, _, _, _, A, _, _, _ ]
p5 = [ A, _, _, _, A, _, _, _, A, _, _, _, A, _, _, _ ]

for note in p1 + p5 + p2 + p3 + p1 + p2 + p4:
	playNote(note, beats = 0.5)

for note in p1 + p2 + p3 + p1 + p2 + p4:
	playNote(note, beats = 0.5)
```

<img src="/images/bass.png" width="200px" style="float: right; margin-right: 1rem;">

# STEP 4: Bass!
This song wouldn’t be called Bassthoven without the bass. Add a Bass to your project and change the voice to 808 Bass.

You can copy the code below for the bass pattern:
```python
rest(12)
for i in range(4):
    playNote(21)
    rest(2)
    playNote(21)
    rest(1)
    playNote(16, beats = 0.5)
    rest(1)
    playNote(16, beats = 0.5)
    rest(1)
    playNote(21)
    rest(2)
    playNote(21)
    rest(1)
    playNote(28, beats = 0.5)
    rest(1)
    playNote(16, beats = 0.5)
    rest(1)
```

# STEP 5: Drums
To finish up, let’s layer in the drums. Create a new Drum instrument and add this code.  
```python
rest(12)
for i in range(16):
    playNote(0)
    playNote(2, beats = 0.5)
    playNote(2, beats = 0.5)
    playNote(10)
    playNote(0)
```

# Try It
You can try this project in TunePad: {{ project }}
