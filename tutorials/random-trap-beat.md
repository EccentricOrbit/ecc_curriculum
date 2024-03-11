---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: "Random Trap Beat"
description: Build a simple Trap beat using the Python programming language with loops, conditionals, and randomness.
level: Intermediate
time: 25-30 minutes
license: by-nc-sa
splash: /images/splash/random-trap-beat-splash.jpg
project: https://tunepad.com/project/799
audio: https://api.tunepad.com/api/projects/799/audio/
disclaimer: For educational purposes only. Based on based on imamusicmogul's video, "How Every Trap Beat is Made".

---

# STEP 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Stranger Things”.

# STEP 2: Hats
The hi-hats form the foundation for the trap rhythm. We're going to open with a simple run of 8 hats played at eighth note intervals. We do this using a Python **for-loop** that counts from 0 all the way up to (but not including) 8. We also define a **variable** called **hat** that represents the sound we want to play. You can try changing that number to hear different sounds. Create a new Drum cell in TunePad, use this code, and press the **play** button to hear how it sounds.

```python
hat = 4
for i in range(0, 8):
    playNote(hat, beats=0.5)
```

# STEP 3: Random Stutter Hats
A defining sound of trap beats is random stuttered runs of hi-hats that break up the simple 8th note pattern. To do that, we can use the randint function in Python that generates a random integer. Here we ask if a random number between 0 and 10 is greater than 2.

```python
# repeat 16 times
for i in range(0, 16):
    # generate a random number between 0 and 10 (inclusive).
    if randint(0, 10) > 2:
        # if the number is greater than 2, play a regular hat beat
        playNote(4, beats=0.5)
    else:
        # otherwise, play a stutter of two 16th note hats
        playNote(4, beats=0.25)
        playNote(4, beats=0.25)
```

# STEP 4: Beat Machine
For the rest of the drum pattern, we're going to define a helper **function** called **beatMachine**. This function needs two **parameters**: a number or **list** for the sound to play, and it takes a **string** representing the pattern of notes in the rhythm.

An _arpeggio_ is a chord broken into a series of individual notes played in rapid succession. 
Arpeggios are used everywhere in music and contribute rhythmic, harmonic, and melodic elements to a song. 
The Stranger Things theme uses an iconic arpeggio consisting of a C Major 7 chord played up and then back down in order of pitch.
```python
# FUNCTION: beatMachine
# PARAMETERS:
#   sound - sound to play
#   pattern - a string with the beat pattern to play


def beatMachine(sound, pattern):
    moveTo(0)  # move to the beginning of the measure (beat 0)

    # repeat for every letter in the pattern
    for x in pattern:
        if x == '-':
            # if the letter is a dash (-) character rest for an 8th note
            rest(0.5)
        else:
            # otherwise play the sound for an 8th note
            playNote(sound, beats=0.5)
```

# STEP 5: Kicks

Now let's use our beatMachine function to make a kick drum pattern. Trap uses a somewhat staggered and irregular pattern of kicks. Try playing the kicks at the same time as the stutter hats. You can play all of the sounds defined below to hear the full effect of the trap beat.

```python
from Beat_Machine import *

kicks = [0, 1]  # a list of two kick sounds that get played together
beatMachine(kicks, '*---------*-----*---------*--*--')
```

# STEP 5: Snares, Claps, and Open Hats

Our trap beat sounds sparse so far, so let's sprinkle in characteristic snare hits, claps, and open hi-hats. We're going to keep using our **beatMachine** function to make this easy. Try changing the pattern to hear different variations of trap. Just remember to keep your strings each 16 letters long.

```python
from Beat_Machine import *

snare = 2
clap = 10
openhat = 5
beatMachine(snare,   '----*----*--*-------*-------*---')
beatMachine(clap,    '----*-------*--------*-------*--')
beatMachine(openhat, '-------*--------*-------------*-')
```

# STEP 6: Keys

[imamusicmogul](https://www.youtube.com/watch?v=6TqefAORtok)'s original video added bells to play in the background of the beat. Here we're going to use the Marimba instrument to get the same effect. We do this by assigning variables for the notes we want and then creating a list of for the melody. A for-loop iterates through the list and plays each note in turn. 

```python
C = 36     # try changing this number to see what happens!
Db = C + 1
G = C + 7
Ab = C + 8  # A-flat
Bb = C + 10  # B-flat
C2 = C + 12

melody = [C, G, Ab, Bb, Db, Ab, Bb, C2]

for note in melody:
    with lowpass(frequency = 50 + 22000 * (0.8)):
        playNote(note, beats=2)

```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
