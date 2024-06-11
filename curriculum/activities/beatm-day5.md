---
layout: layouts/activity.njk
tags: beatmakers
category: Lesson Plan
title: Loops
description: Repetition is one of the most important parts of music. Repetition helps build memorable songs that stick in our ears. In Python, a loop is a tool that we can use to repeat things over and over.
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/still-dre-splash.jpg
video: https://drive.google.com/file/d/1mP2mVS8Jmuc4Ngyp1ecZ0m4lQDZSfysp/view?usp=sharing
slides: https://docs.google.com/presentation/d/1uGQr4CZrCok1f5ET55KI3unJ94lXqKJcWkeU5mRlRWE/edit
project: https://tunepad.com/project/44
audio: https://api.tunepad.com/api/projects/44/audio/
---
### Learning Objectives
* Learn about loops in Python
* Learn about loops in music
* Practice using loops to create hi-hat pattern


# Loops in Python
* A loop is a way of repeating something many times.
* Loops are helpful for composing music.
* Here’s an example of what a loop looks like in Python:

<img src="/images/Figure2.12.png" width="500" style="margin: 2rem; max-width: 100%;" alt="Parts of a for loop in Python">

| Part | Meaning | 
| ---- | ------- |
| `for` keyword | Tells Python that we’re starting a loop |
| `loop` variable | Variable that holds the current value of the loop |
| `in` keyword | Tells Python what we’re going to loop through |
| `range` function | Generates a list of numbers to loop through. |
| colon character | Tells Python the loop is starting |
| indent | Everything we want to be repeated gets indented four spaces |


# Repeating Drum Sounds
<img src="/images/splash/hats-off-splash.jpg" width="300" alt="hi-hat" style="margin: 2rem;">
This example repeats a hi-hat sound 8 times in a row:

## Without a loop
```python
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
playNote(4, beats=0.5)
```

## With a loop
```python
for i in range(8):
    playNote(4, beats=0.5)
```

Try using a loop in a TunePad drum cell. Experiment with:
* Changing the number inside the range function
* Changing the beats parameter of playNote
* Changing the note number to different drum sounds


# Repeating Chords
<img src="/images/splash/keys-splash.png" width="300" alt="playing a piano" style="margin: 2rem;">

* We can also use loops to repeat things like chords.
* This is a nice way to add harmony and rhythm to your music.
* Try this code in a piano cell:

```python
for i in range(8):
	playNote([ 48, 52, 55 ], beats = 0.5)
    
for i in range(8):
	playNote([ 55, 59, 62 ], beats = 0.5)
    
for i in range(8):
	playNote([ 57, 60, 64 ], beats = 0.5)
    
for i in range(8):
	playNote([ 53, 57, 60 ], beats = 0.5)
```

# Playing Arpeggios
* You can also use loops without the `range` function.
* This lets you loop through any list you want.
<img src="/images/for-loop.png" width="500" style="margin: 2rem; max-width: 100%;" alt="Parts of a for loop in Python">

Try this example in a TunePad piano cell:
```python
notes = [ 48, 52, 55, 52, 48 ]
for note in notes:
	playNote(note)

playNote(notes, beats = 4)
```
	
This example will play each note in the list, one at a time.
Try experimenting with different notes in the list.

# Activity: Recreate Still D.R.E.
In this activity, practice using loops to make repeated chords.

<a href="/tutorials/still-dre" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/still-dre-splash.jpg" style="margin: 0.5rem 0" alt="Still DRE" width="400">Open the Still D.R.E. Tutorial</a>


# Extra: Loops and Hats
Learn how to create unique hi-hat patterns with for loops

<a href="/tutorials/hats-off" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/hats-off-splash.jpg" style="margin: 0.5rem 0" alt="Hi Hat" width="400">Open the Hats Off Tutorial</a>
