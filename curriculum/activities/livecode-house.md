---
date: 2024-01-03
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: "Code a Chicago House Beat"
description: Learn how to code and customize a Chicago-style House beat.
level: Beginner
time: 45 minutes
license: by-nc-sa
splash: /images/splash/chicago-splash.png
project: https://tunepad.com/project/80571
audio: https://api.tunepad.com/api/projects/80571/audio/
prevURL: /curriculum/activities/livecode-quickstart
prevTitle: Getting Started
nextURL: /curriculum/activities/livecode-syntax-errors
nextTitle: Syntax Errors and Mystery Melody
---
In this activity we're going to learn how to code a Chicago-style House beat.
House music originated in Chicago's underground club culture and has since become 
a [worldwide phenomenon](https://www.npr.org/2022/03/29/1089533733/house-music-is-alive-and-well-in-south-africa).
House is characterized by a thumping **four-on-the-floor** beat pattern and high energy tempos in the 120 to 130 beats per minute range. Take a minute to listen to this example track, and try to pick out all of the different drum sounds.

<audio controls>
    <source src="https://upload.wikimedia.org/wikipedia/commons/transcoded/8/88/House_Music_Demo.ogg/House_Music_Demo.ogg.mp3" type="audio/mpeg">
    <source src="https://upload.wikimedia.org/wikipedia/commons/transcoded/8/88/House_Music_Demo.ogg/House_Music_Demo.ogg" type="audio/ogg">
</audio>

Here's what the basic House patteren looks like. Notice that there's a kick drum placed at the start of every beat (four-on-the-floor). There are also snare drums at the start of beats 2 and 4.

<iframe height="325" src="/interactives/composer/?embedded=true&bpm=120&steps=16&voice=3&track2=c444&track4=0101&track5=1111" style="width: 95%; min-width: 500px; overflow: hidden; border: none;" scrolling="no"></iframe>

Now that we have an idea of what a House beat sounds like, let's code it in Python.


# Step 1: Log In to TunePad
* Go to [tunepad.com](https://tunepad.com)
* Click on **Sign In**
* Click on **Sign in with Google**
* Enter your Gmail address and password

# Step 2: Create a new TunePad Project
Click on the **New Project** button to create an empty project. 
It should look like the picture below.

<a href="/images/empty-project.png" target="_blank">
<img src="/images/empty-project.png" alt="Screenshot of an empty TunePad project" width="400px"></a>

# Step 3: Kick Drums
* Click on the **Add Cell** button in your new project.
* Click on the **Drum** button to add a new drum cell.
* Change the name of the cell to **Kicks**. 
* Set the instrument to **Drums → Headlines Drums** and add this code.
* Press the Play button to hear how it sounds.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="kicks" tempo="120" time="4/4">
/# Kick drum (play note 0 four times in a row)
playNote(0)
playNote(0)
playNote(0)
playNote(0)
</tunepad-code>


Note that the first line of code above starts with a hashtag symbol (#). In Python programming, anything that comes after a hashtag is called a *comment*. Comments are notes for human programmers that are ignored by Python. Line 1 is there to help
remind us which lines of code play the kick drum part.

# Step 4: Snare Drums

* Click on the **Add Cell** button again to add a second **Drum** cell.
* Call this cell **Snares**
* For the snare drum part, we want to add hits to beats 2 and 4 while skipping beats 1 and 3.
* The easiest way to do this is to use the `rest` function.
* Try playing both the Kick and Snare cells together at the same time.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="snares" tempo="120" time="4/4">
/# Snare drum (note 2)
rest(1)     # skip beat 1
playNote(2)
rest(1)     # skip beat 3
playNote(2)
</tunepad-code>

# Step 5: Hi-Hats

* In House music, hi-hat sounds get sprinkled between the kicks and snares to add energy and originality.
* Here's a very simple pattern that you can customize. 
* In the next activity we'll learn how to use loops in Python to make more interesting hi-hat patterns.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="hats" tempo="120" time="4/4">
/# Hi-hats (note 5)
rest(0.5)               # rest for a half a beat
playNote(5)             # play a hi-hat sound
playNote(5)
playNote(5)
playNote(5, beats = 0.5)  # play the last hi-hat for only half a beat
</tunepad-code>

Try playing all three cells together at the same time to hear how they sound.

# Step 6: Turbo Kicks

Here's a slightly more complicated version of the kick drum cell that uses a **Python loop** to repeat each drum sound 
four times in a row. It also plays a softer echo of each kick, which can add variety and energy to your beat.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="turbo-kicks" tempo="120" time="4/4">
for i in range(4):
    playNote(0, beats = 0.5)   # play the kick drum for half a beat
    playNote(0, beats = 0.5, velocity = 60)  # play it again more softly
</tunepad-code>

# Tips for Live Coding
* Practice makes perfect. Practice typing out lines of code so that you can do it fluidly, confidently, and accurately.
* Make use of Copy+Paste for repeated lines of code (you can also use a loop, which we'll show in the next beat activity).
* Write some starter code ahead of time. That way you don't have to code everything from scratch.
* Add or remove a hashtag at the beginning of lines of code to add or remove elements from live music.