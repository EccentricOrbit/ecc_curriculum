---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: "Join Us For A Bite"
description: Learn about loops in Python and TunePad's rewind/gain/cents functions through recreating Join Us For A Bite by JT Music! JT Music Official - https://linktr.ee/jt_music
level: Intermediate
time: 20-30 minutes
license: by-nc-sa
authors: tutorial by Soji Oduneye
splash: /images/splash/fnaf-splash.jpg  
video: 
slides: 
project: https://tunepad.com/project/76878
audio: https://api.tunepad.com/api/projects/76878/audio/
disclaimer: For educational purposes only. Based on "Join Us For A Bite" by JT Music (2016), Youtube.
---

# Step 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project "Join Us For A Bite".

# Step 2: Melody
We’ll start with the main melody. This is usually the catchiest part of a song! 
First you should create a new `Keys` cell in TunePad, select `Synths` > `Arps` > `Squiggly Pluck`, and use this code:
```python
rest(0.5)
playNote(60,0.5)
playNote(68,0.5)
playNote(60,0.25)
playNote(67,0.5)
playNote(65,1.75)

rest(0.25)
playNote(61, 0.25)
playNote(61, 0.25)
playNote(61, 0.25)

playNote(63, 0.25)
playNote(65, 0.25)
playNote(63, 0.25)

playNote(72,0.75)
playNote(70,0.5)
playNote(68,0.5)
playNote(70,0.25)
playNote(68,0.25) 
```
Sounds cool right? This code is like instructions for playing a song on a computer. Each playNote command is like hitting a key on a piano. The first number in playNote tells us which note to play, like which piano key to press. The second number is how long to hold the note down. It's measured in beats, kind of like counting in your head while tapping your foot to music. If the number is 1, you hold the note for one beat. If it's 0.5, you hold it for half a beat. This helps make the song sound just right, with some notes lasting longer than others.
 

# Step 3: Supporting Chord #1
Though the melody sounds nice alone, we can create a fuller sound by giving the melody some support. Create a `Piano` cell, and try out this code:
```python
for i in range(0, 4):
    rest(0.5)
    playNote(96, 0.5)
    playNote(94, 0.5)
    playNote(96, 0.5)
```
We know that songs often repeat their melodies, so creating a `for-loop` is a great idea for us to save time and space in our code. Notice the syntax "for i in range(4)". This tells us that every time that the loop repeats, it will add 1 to i up until (not including!) 4 starting from 0.

# Step 4: Supporting Chord #2
Good job! Let's add some more supporting chords. Create a new `Piano` cell and try:
```python
playNote([80, 75, 72], beats = 1)
rest(1)

playNote([77, 72, 68], beats = 1)
rest(1)

playNote([73, 68, 65], beats = 1)
rest(1)

playNote([79, 70, 67], beats = 1)
rest(1)

playNote([80, 75, 72], beats = 1)
rest(1)

playNote([77, 72, 68], beats = 1)
rest(1)

playNote([73, 68, 64], beats = 1)
rest(1)

playNote([75, 70, 63], beats = 1)
rest(1)
```

# Step 5: Supporting Chord #3
Good job! Let's add one last supporting chord. Create a new `Guitar` cell, select `Acoustic Guitar` and try:
```python
def strum(chord):
    playNote(chord, beats = 0.5)
    playNote(chord, beats = 0.75)
    playNote(chord, beats = 0.75)

rest(16)

strum([ 44, 48, 51 ])
strum([ 41, 44, 48 ])
strum([ 46, 49, 53 ])
strum([ 39, 43, 46 ])
strum([ 44, 48, 51 ])
strum([ 41, 44, 48 ])
strum([ 44, 49, 53 ])
strum([ 55, 51, 46 ])
```

# Step 6: Drum Build Up
Let's finish off the project with some drums. Create a new `Drum` cell, select `808 DrumKit`, and try:
```python
rest(28)
with bend(cents = -10):
    with gain([0,4], 4):    
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 0.5)
        playNote(0, 1)
```
In this code, we're making music with a computer, and we're using a special trick called a "pitch bend" to make the notes sound a bit different. First, we have a quiet moment with `rest(28)`, which means we wait for 28 beats before we start playing notes again.

When we play notes with `playNote`, we're like hitting keys on a piano. But here's the cool part: we use with `bend(cents = -10)` to make the notes sound slightly lower than they normally would. Imagine you're singing a note and then you make your voice go a bit lower—that's what the bend does to the computer's notes.

The `cents` part is a way to measure how much we change the note. Just like inches can measure how tall you are, cents measure how much we're bending the note. A "cent" is really, really tiny; it takes 100 of them to change a note to the next one on a piano. Here, we're only changing the note by -10 cents, which is just a tiny bit lower, so it's not a big change but it adds something special to the music.

We also use with `gain([0,4], 4)` to make the notes start quiet and get louder. So, as we play each note with the pitch bend making them slightly lower, they also start really soft and gradually become louder. This combination of getting louder and the slight bend in pitch creates a cool effect that makes the music more interesting.

Lastly, the pitch bend can be set to change over time or stay the same for all the notes. In our example, we're keeping it the same for a little while as we play our notes. This way, the music has a unique sound that's different from just hitting piano keys normally.

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>