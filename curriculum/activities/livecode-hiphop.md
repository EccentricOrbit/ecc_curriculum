---
date: 2024-01-05
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: "Loopy Hip-Hop Beat"
description: Learn how to use Python loops to code a simple Hip-Hop beat
level: Intermediate
time: 45 minutes
license: by-nc-sa
splash: /images/splash/sprinkler-splash.jpg
project: https://tunepad.com/project/80571
audio: https://api.tunepad.com/api/projects/80571/audio/
prevURL: /curriculum/activities/livecode-syntax-errors
prevTitle: Syntax Errors and Mystery Melody
nextURL: /curriculum/activities/livecode-reggaeton
nextTitle: Functional Reggaetón Beat
---
Here's a hip-hop groove that combines electronic clap sounds, ticking hi-hats, and scattered kick drums.
To add these new sounds, we're going to make use of **loops** in Python code.

# What's a Loop?
A loop in Python is a way of repeating some of our code over and over again.

<a href="/images/Figure2.12.png" target="_blank">
<img src="/images/Figure2.12.png" alt="Anatomy of a for-loop" width="450px" style="margin: 1rem;"></a>

* The word `for` means that we're starting a loop. 
* The next part is the name of a variable that Python will use to count with. 
* We named our variable `i`, but we could have used other names as well.
* The `in range(8)` means that we're going to loop for 8 times in a row.
* The last part is the colon character. This tells Python that the next line(s) will get repeated as part of the loop. 
* Everything inside the loop needs to be indented by four spaces.

# Step 1: Create a new project
* Log into [TunePad](https://tunepad.com/project/) and create a new project.
* Name your project **Hip Hop Beat**

# Step 2: Sprinkler Hi-Hats
* Add a new **Drum** cell to your project
* Set the instrument to **Drums → Headlines Drums** 
* Add this code for the hi-hats.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="step1" tempo="120" time="4/4">
for i in range(16):
    playNote(5, beats = 0.5)  # play 16 hats in a row, each half a beat long
/
rest(0.5)
/
for i in range(13):
    playNote(5, beats = 0.25) # play 13 more hats each a quarter of a beat long
</tunepad-code>

All we're doing here is using a loop (line 1) to play 16 hi-hat sounds in a row (line 2).
Notice that we **indent** line 2 by four spaces. That tells Python that line 2 is the code
that gets repeated. Starting on line 6 we do almost the exact same thing except that we play
13 hi-hats at a faster rate.

# Step 3: Claps

* Now we're going to add our clap sounds on the even numbered beats (2, 4, 6 ...)
* For simplicity, we're going to keep everything together in the same cell. 
* We use the `moveTo(0)` function on line 9 to rewind back to the beginning so that everything plays at the same time.
* If we didn't have the `moveTo`, then all of the hi-hats would play before the claps even start.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="step2" tempo="120" time="4/4">
/# Hi-Hats
for i in range(16):
    playNote(5, beats = 0.5)  # play 16 hats in a row, each half a beat long
rest(0.5)
for i in range(13):
    playNote(5, beats = 0.25) # play 13 more hats each a quarter of a beat long
/
/# Claps
moveTo(0)   # rewind to the beginning
for i in range(6):
    rest(1)
    playNote(11)
</tunepad-code>

This code uses another loop to repeat a rest followed by a clap six times in a row.

# STEP 4: Kicks

For the last part, we're going to sprinkle in some kick drum sounds. Feel free to experiment and 
customize this arrangement.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="step3" tempo="120" time="4/4">
/# Hi-Hats
for i in range(16):
    playNote(5, beats = 0.5)  # play 16 hats in a row, each half a beat long
rest(0.5)
for i in range(13):
    playNote(5, beats = 0.25) # play 13 more hats each a quarter of a beat long
/
/# Claps
moveTo(0)   # rewind to the beginning
for i in range(6):
    rest(1)
    playNote(11)
/
/# Kick Drums
moveTo(0)
playNote(0, beats = 2)
playNote(0, beats = 1.5)
playNote(0, beats = 0.5)
playNote(0, beats = 0.5)
playNote(0)
playNote(0, beats = 1.5)
rest(3)
playNote(0, beats = 1)
playNote(0, beats = 0.5)
/
</tunepad-code>
