---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: "Drum Machine"
description: Learn how to use the moveTo function to create a drum machine.
level: Intermediate
time: 20-35 minutes
license: by-nc-sa
splash: /images/splash/drum-machine-splash.jpg
project: https://tunepad.com/project/491
audio: https://api.tunepad.com/api/projects/491/audio/
disclaimer: For educational purposes only.
---

# STEP 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Drum Machine”.

# STEP 2: Machine Function
A common way to create beats and rhythms is to use a step sequencer. A step sequencer breaks up time into even slices or steps (like 16th notes or 32nd notes). 

<div class="noprint">
This Roland 808 drum machine from the 1980s let musicians program in rhythms with 16 switches representing times when various drum sounds would be played. 

<a href="/images/splash/drum-machine-splash.jpg" target="_blank">
<img src="/images/splash/drum-machine-splash.jpg" alt="Screenshot of a Roland 808 drum machine from the 1980s" width="350px" style="margin: 1rem;"></a>
</div>

Modern digital step sequencers often represent drum machines as grids where each row represents a different drum sound and each column represents a consecutive time slice (image from the <a href="/interactives/composer/" target="_blank">TunePad Beat Composer</a>).

<a href="/images/splash/composer-splash.png" target="_blank">
<img src="/images/splash/composer-splash.png" alt="Screenshot of a TunePad beat composer" width="300px" style="margin: 1rem;"></a>

We're going to make a drum machine in Python using our own function called `machine`. Our function will use **strings** to represent different sound patterns for each drum. To do this, we'll also need a new TunePad function called `moveTo` that lets us fast-forward or rewind time by moving the beat counter to any position we want.

```python
def machine(note, pattern):
    moveTo(0)
    for s in pattern:
        if s == '!':
            playNote(note, beats=0.25, velocity=100)
        else:
            rest(0.25)

```

# STEP 3: Machine Description
This function is only 7 lines long, but there's a lot going on. Let's break it into easier pieces. 

* First, the function takes two parameters, `note` and `pattern`. `note` is just a number representing the drum sound to play (like 0 for kick, 2 for snare, or 4 for hat). `pattern` is something called a string in Python. You can think of a string as a list of characters. For example, in this string, "**Hello, I'm a string**", there are 18 characters starting with '**H**' and ending with '**g**' and including the spaces. Python uses either double quotes (") or single quotes (') to define a string.

* The first line of the function uses `moveTo` to move back to the beginning of the measure. We'll see why this is important when we make multiple calls to machine (below).

* The function uses a **for loop** to iterate over each character in the string, one at a time.

* Line 4 has a statement called called a **conditional**, or an **if-then-else** statement. What we're trying to do is say **_if_** the character is a '!', play a sound really loud (`velocity = 100`). Otherwise, rest. In a minute, we'll revisit this to also let us play quiet beats. Notice again that we use the colon character and indentation to set up blocks of code. 

OK, but how do we use this function? Here's a simple example beat with five sounds. Each call to machine is like a row in the drum machine. We use the '-' character to mean no sound, but really this can be any character except at '!'.

```python
from machine_function import *

machine(8,  "------!!--------")   # tom 1
machine(6,  "--------------!-")   # tom 2
machine(10, "-------!!!*-----")   # clap
machine(4,  "-!!!-!!!-!!!-!!!")   # hat
machine(2,  "----!----!!-!---")   # snare
machine(0,  "!!------!!!!----")   # kick
```


# STEP 4: Adding elif
So, how about both loud and soft sounds to add a little texture to our beat. For that, we add a new statement called `elif` that stands for ("else if") or ("otherwise if"). This is the same function as before, but we're redefining it to recognize both '!' and '*' characters as different volume indicators.

```python
def machine(note, pattern):
    moveTo(0)
    for s in pattern:
        if s == '!':
            playNote(note, beats=0.25, velocity=100)
        elif s == '*':
            playNote(note, beats=0.25, velocity=80)
        else:
            rest(0.25)
```

# STEP 5: Adding elif Copy
Here's one last version of our drum beat with both loud and soft notes. Press the play button to hear how it sounds. You can also press the DRUM icon to try replacing these drum sounds with different variations.

```python
from revised_machine_function import *

machine(8,  "------!*--------")   # tom 1
machine(6,  "--------------!-")   # tom 2
machine(10, "-------!*!*-----")   # clap
machine(4,  "-*!*-*!*-*!*-*!*")   # hat
machine(2,  "----!----**-!---")   # snare
machine(0,  "!*------!*!*----")   # kick
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
