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
### Learning Objectives
* Practice using loops and lists to play arpeggios
* Practice using arpeggios to create fun musical patterns.

# Arpeggios

<img src="/images/sheet-music.png" alt="Sheet music" width="400" style="margin: 1rem;" />

* An arpeggio is a chord that is broken up and played rapidly, one note at a time.
* Arpeggios combine harmony, melody, and rhythm.
* Arpeggios are a great way to add complexity to your music.
* To play an arpeggio, you can also use loops without the `range` function.

<img src="/images/for-loop.png" alt="Parts of a for loop" width="500" style="margin: 1rem;" />

Try this example in a TunePad piano cell:

```python
notes = [ 48, 52, 55, 52, 48 ]
for note in notes:
	playNote(note)

playNote(notes, beats = 4)
```
	
You can try experimenting with different notes in the list.

# Activity — Stranger Things Theme

In this tutorial, you'll use arpeggios and for-loops to recreate the theme song from Stranger Things.

<a href="/tutorials/stranger-things" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/stranger-things-splash.jpg" style="margin: 0.5rem 0" alt="Stranger Things" width="400">Open the Stranger Things Tutorial</a>

