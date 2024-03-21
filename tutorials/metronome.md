---
layout: layouts/activity.njk
tags: learn
category: Tutorial
title: Make a Metronome
description: Use TunePad's playNote function to make a simple metronome that makes a tick-tock sound on every beat
level: Beginner
time: 15 minutes
license: by-nc-sa
splash: /images/splash/metronome-splash.png
project: https://tunepad.com/project/76376
audio: https://api.tunepad.com/api/projects/76376/audio/
---

# Introduction
In this short tutorial, we're going to use TunePad's `playNote` function to make a simple metronome that makes a tick-tock sound on every beat. 

The basic building block of any song or loop in TunePad is the `playNote` function. Using `playNote` tells TunePad to play a sound like a musical note or a drum beat. In Python programming, `playNote` is what's called a function. In later tutorials, we'll show you how to define your own functions, but for now, we're just going to use one that's been provided for us. The `playNote` function requires at least one parameter, which is the note (or notes) that we want to play.

# STEP 1
* Press the **ADD CELL** button and seleect Drums
* Change the instrument to **Drums --> Percussion Sounds**
* Add this Python code
```python
playNote(3)
playNote(6)
playNote(3)
playNote(6)
```
In this code the numbers 3 and 6 are the two different sounds to play.

# STEP 2
Notice that to call a function, we type its name followed by parentheses. Inside the parentheses is our list of parameters. In this case, there's just one parameter, which is the sound to play.

It's also possible to play multiple notes at the same time by sending `playNote` a **list** of notes instead of a single value. In Python, we create a list by enclosing values inside of square brackets and separating them with commas. Try changing the code to play sound 3 every odd beat and sounds 3 and 6 together on the even beats.
```python
playNote(3)
playNote([3, 6])
playNote(3)
playNote([3, 6])
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
