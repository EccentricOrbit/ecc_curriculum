---
layout: layouts/activity.njk
tags: learn
category: Tutorial
title: Major and Minor Chords
description: Define functions to play major and minor chords in TunePad
level: Beginner
time: 25 minutes
license: by-nc-sa
splash: /images/splash/chords-splash.jpg
project: https://tunepad.com/project/76377
audio: https://api.tunepad.com/api/projects/76377/audio/
---

# Introduction
In music, a chord is a group of notes played together at the same time. The combination and timing of chords is much of what gives music its expressive and emotional power. In this tutorial, we're going to look at two of the most common chords: Major Chords and Minor Chords (sometimes also called Major Triads and Minor Triads because they consist of three notes each).

# Major Chords
To form a major chord, we can start with any base note, and then follow a simple pattern to find the next two notes in the chord. For example, to make a C Major chord, we can start with a note like 36 (a number that represents a C note). We then add **four** to get to the second note of our sequence (36 + 4 = 40). And, to finish the chord, we add **three** more to get to the third note of the sequence (40 + 3 = 43).

This same pattern of adding 4 and then adding 3 works for any starting note we want. Here are a few common major chords.

* **C Major** (C = 36, E = 40, G = 43)
* **F Major** (F = 41, A = 45, C = 48)
* **G Major** (G = 43, B = 47, D = 50)
The pattern is always the same: add 4 and then add 3. 

In TunePad, chords are represented by **lists** of numbers that represent the notes to be played together. So, if we had a variable called `baseNote`, then we can always create a major chord with a list that looks like this:
```python
[ baseNote, baseNote + 4, baseNote + 7 ]
```
Since the pattern is always the same, this is a good opportunity to define our own **function** in Python. We've already used functions like `playNote` and `rest` to make sounds in TunePad, and defining and using our own functions is not much harder. In this code window, we define a function called `majorChord`. (Press play in the window to hear how it sounds).

```python
def majorChord(baseNote):
    chord = [baseNote, baseNote + 4, baseNote + 7]
    print(chord)
    return chord

playNote(majorChord(36))  # C Major
playNote(majorChord(36))

playNote(majorChord(43))  # G Major
playNote(majorChord(43))

playNote(majorChord(41))  # F Major
playNote(majorChord(41))

playNote(majorChord(36), beats=2)
```

# Major Chord Function Explained
Here are a few things to notice about our function. We used of the `def` keyword to tell Python that we're defining a function. 

Our function accepts one parameter called `baseNote` enclosed inside parentheses. You can think of a parameter as a special kind of variable that can only be used by the statements inside the function.
We used a colon character to tell Python that there's a block of code coming next that's included in the function.
Lastly, we used a `return` statement to tell Python that this is the value that results when we call the function. Every time we call `majorChord` with a different base note, it returns a list of notes representing that chord. Try clicking on the Output tab to see what the chords that get returned look like.

# Minor Chords
Minor chords are very similar to major chords. The only difference is that the pattern of notes starts with a base note, adds three to get to the second note, and adds four to get to the third note. Here are some common minor chords that all follow the same pattern of adding 3 and then adding 4:

* **D Minor** (D = 38, F = 41, A = 45)
* **E Minor** (E = 40, G = 43, B = 47)
* **A Major** (A = 45, C = 48, E = 52)

Since the pattern is always the same, we can also create a Python function for minor chords.

```python
def minorChord(baseNote):
    return [baseNote, baseNote + 3, baseNote + 7]


playNote(minorChord(38))  # D minor
playNote(minorChord(40))  # E minor
playNote(minorChord(45))  # A minor
playNote(minorChord(40))  # E minor
```

# Wrapup
Here's a final example that puts our two functions together to create a simple melody that mixes common major and minor chords.

```python
def minorChord(baseNote):
    return [baseNote, baseNote + 3, baseNote + 7]


def majorChord(baseNote):
    return [baseNote, baseNote + 4, baseNote + 7]


playNote(majorChord(36))
playNote(majorChord(36))

playNote(minorChord(38))
playNote(minorChord(38))

playNote(majorChord(41))
playNote(majorChord(41))

playNote(majorChord(43), beats =  2)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
