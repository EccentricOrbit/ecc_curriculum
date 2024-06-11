---
date: 2024-01-08
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: Notes and Melody
description: For this activity set we learn about note names and values. Then we’ll use those note values to start adding melody and harmony to our projects. We’ll also think about what ingredients go into a good melody.
level: Beginner
time: 50 minutes
license: by-nc-sa
splash: /images/splash/piano-cartoon-splash.png
nextURL: /curriculum/activities/livecode-bad-bunny
nextTitle: Lists, Chords, and Bad Bunny
prevURL: /curriculum/activities/livecode-variables
prevTitle: Variables and Lists
---

# Learning Note Names
In TunePad musical notes are numbers. C1 is a very low note on the piano keyboard. It has the number 24, and you can play it with this Python code:
```python
playNote(24)   # C1
```
* Notes with higher pitches have higher numbers. 
* Notes are grouped into sets of 12 called an **octave**. 
* For example, the note C2 has the number 24, which is 12 notes higher than C1.

Try playing different notes on the piano keyboard to hear how they sound. The note numbers and note names are show on each key.  You can make the keyboard show lower and higher octaves by pressing the arrow buttons.

<note-explorer patch="/sounds/voices/grand-piano/patch.json"></note-explorer>

# Activity: Make a Melody!

## Step 1: Start with a Piano
* Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). 
* Name your project “My Melody”.
* Add a **Keys** cell to your project.

## Step 2: Play Different Notes
You can play a note in TunePad with the `playNote` function.

<img src="/images/play-note.png" style="width: 90%;" alt="The TunePad playNote functions">

Try making up your own melody with the note numbers from 60 to 72. Here's an example. 
```python
playNote(60)
playNote(69)
playNote(67)
playNote(67)
```
This example is the same as playing these notes on the piano:

<img src="/images/music/melody1.png" width="400px;" alt="sheet music">

# Step 2: Add a Rest
A rest is a way of adding pause or silence to music. You can add a rest to your code with the `rest` function.

<img src="/images/rest.png" alt="TunePad rest function." style="width: 50%;">

Try adding a rest somewhere in your code. Here's an example:
```python
playNote(60)
playNote(69)
rest(2)
playNote(67)
rest(1)
playNote(67)
```
<img src="/images/music/melody2.png" width="500px;" alt="sheet music">

# Step 3: Change your Timing
You can make notes longer or shorter in TunePad with the beats **parameter**.
Try adding the `beats` parameter to some of your notes. Common beat values are 2, 1, 0.5, and 0.25.
```python
playNote(60)
playNote(69, beats = 2)
rest(1)
playNote(67, beats = 0.5)
rest(0.5)
playNote(67, beats = 0.5)
rest(0.5)
```
<img src="/images/music/melody3.png" width="500px;" alt="sheet music">

