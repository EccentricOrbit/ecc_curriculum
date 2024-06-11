---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: "Hats Off"
description: In this tutorial you'll use for-loops to create hi-hat patterns.
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/hats-off-splash.jpg
project: https://tunepad.com/project/486
audio: https://api.tunepad.com/api/projects/486/audio/
disclaimer: For educational purposes only.
---

# STEP 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Hats Off”.

# STEP 2: Hi-Hat Patterns
In this tutorial we'll experiment with Python loops to create hi-hat patterns.
## Loops
In both coding and music there are many times we want to repeat something over and over again. For example, say we wanted to play a run of eighth notes (♪) on the hi-hat. We could just type in 8 `playNote` instructions for 0.5 beats each. Create a new **Drum** cell in TunePad, and use this code:

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


# STEP 3: Doing it Better
So, what's wrong with this?

1. We had to do a lot of copying and pasting to enter our code.
2. We generated a lot of repetitive code, which makes it harder to read.
3. The code is hard to change and reuse. What if we wanted to use a different drum sound or play 16 sixteenth notes instead of 8 eighth notes? We'd have to go through the code line-by-line making the same change over and over again.

## How can we do this better? 
In Python we can use a loop to repeat the same code over and over again for any number of times. Here's our same example again, but this time using a loop. Now we only need 2 lines of code instead of 8!
```python
for i in range(8):
    playNote(4, beats=0.5)
```

# STEP 4: Loops
In this example, we created a loop that repeats 8 times. Each pass of the loop plays one of our notes. To see why this is better, try changing the code so that it plays 16 sixteenth notes instead of 8 eight notes. Or try changing the drum sound from a hat to something else.

## Anatomy of a Loop
* The word for means that we're starting a loop. 
* The next part is the name of a variable that python will use to count with. We named our variable i, but we could have used other names as well.
* The in range(8) means that we're going to loop for 8 times in a row.
* The last part is the colon character. This tells Python that the next line(s) will get repeated as part of the loop. 
* Everything inside the loop needs to be indented by four spaces.

<a href="/images/Figure2.12.png" target="_blank">
<img src="/images/Figure2.12.png" alt="Anatomy of a for-loop" width="450px" style="margin: 1rem;"></a>

## More Loops
Now, let's try expanding this example with different loop counts and beat durations. 

**Try experimenting with your own changes.** 
```python
for i in range(6):
    playNote(4, beats=0.5)

for i in range(2):
    playNote(4, beats=0.25)

for i in range(4):
    playNote(4, beats=0.125)

for i in range(8):
    playNote(4, beats=0.125 * 0.5)

playNote(4, beats=0.5)

for i in range(3):
    playNote(4, beats=0.5)

for i in range(2):
    playNote(4, beats=0.25)

for i in range(8):
    playNote(4, beats=0.125 * 0.5)
    
for i in range(2):
    playNote(4, beats=0.25)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
