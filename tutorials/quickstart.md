---
layout: layouts/activity.njk
tags: [ 'learn', 'activity' ]
category: Activity
title: "Quick Start Guide"
description: Get started creating music with code. This guide walks through the basics of coding music with Python in TunePad
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/quick-start.png
project: https://tunepad.com/project/67954
date: 2023-12-31
---

# Welcome to TunePad
TunePad is an online learning platform for creating music with the Python programming language.
TunePad was developed at Northwestern University with funding from the National Science Foundation.
It's free for everyone to use, and we will never sell your personal information.

<h1>What is TunePad?</h1>
    <ul>
        <li><a href="https://tunepad.com" target="_blank">TunePad</a> a free, online platform for creating music with Python code. </li>
        <li>TunePad was developed at Northwestern University with funding from the National Science Foundation.</li>
        <li>TunePad is <b>free for everyone</b> to use. We don't make money from advertising, and we will never sell your personal information.</li>
    </ul>

<h1>What is Python?</h1>
    <img src="/images/python-logo.svg" alt="Python logo" style="width: 130px; float: right; position: relative; top: -2rem;">
    <ul>
        <li><a href="https://www.python.org/" target="_blank">Python</a> is one of the most widely-used programming languages in the world.</li>
        <li>Python is easy to read and write, which makes it a popular choice for beginners.</li>
        <li>It’s also powerful, which makes it a good choice for professionals.</li>
        <li>Python is used for data science, artificial intelligence, web development, art, music, and video game development.</li>
        <li>Python is a “text-based” language, which means that you type code instead of dragging blocks.</li>
    </ul>

# How it Works
TunePad projects consist of a collection of **cells**.
Cells can include text and images, or they can include playable musical instruments like the piano below.
To play an instrument in TunePad, you write short snippets of Python code using the **`playNote`** function.

# Try It
Here's an emebedded TunePad project.
The first cell is programmed to play five notes using a kick drum sound.
Press the ▶ button below to hear how it sounds.

<tunepad-project name="Welcome to TunePad" tempo="120">
<tunepad-cell-list>

<tunepad-cell patch="rock-drums" name="Kicks" uuid="cell0" timeline="score" theme="light" class="tutorial" show-instrument="false">
/playNote(0)
/playNote(0)
/playNote(0)
/playNote(0, beats = 0.5)
/playNote(0, beats = 0.5)
/
</tunepad-cell>

# Adding Snare Drums
To make this beat more interesting, we can add layers of sound. 
This cell adds two snare drum sounds to play on beats 2 and 4.
Try playing this cell while also playing the kick drums at the same time.
In TunePad all cells will synchronize together.

<tunepad-cell patch="808-drums" name="Snares" uuid="cell1" timeline="hidden" theme="light" class="tutorial" show-instrument="false">
# play two snare drums on beats 2 and 4
/rest(1)        # skip a beat
/playNote(2)    # play sound number 2 (snare drum)
/rest(1)
/playNote(2)
/
</tunepad-cell>

The text that comes after the hashtag symbol (#) is called a **comment**. It’s a note for human coders to help document their code. Anything that comes after the hashtag on a line is ignored by Python.

# Hi-Hats
Let's keep layering sounds! This cell uses a **loop** in Python to add hi-hat sounds between the kicks and snares.

<tunepad-cell patch="808-drums" name="Hats" uuid="cell2" timeline="hidden" theme="light" class="tutorial" show-instrument="false">
/# play hi-hats
/for i in range(4):
/    rest(0.5)   # rest for half a beat
/    playNote(4, beats = 0.25)    # play two hi-hat sounds
/    playNote(4, beats = 0.25)    # each for 0.25 beats
/
</tunepad-cell>

# Bass!!
Don't forget the bass! This cell adds a simple bass line.

<tunepad-cell patch="electric-bass" name="Bass" uuid="cell3" timeline="waveform" theme="light" class="tutorial" show-instrument="false">
/playNote(33, beats = 4)
/playNote(36, beats = 4)
/playNote(35, beats = 4)
/playNote(34, beats = 3)
/playNote(34, beats = 1)
</tunepad-cell>


# Harmony?
In TunePad, you can add as many cells as you want to your project and select from over 170 different instrument.
You can change your code while the music is playing to test out different ideas live and in real time.

<tunepad-cell patch="rhodes" name="Keys" uuid="cell4" timeline="midi" theme="light" class="tutorial">
/# You can play a chord in TunePad by using a list of note values
/playNote([57, 60, 64], beats = 4)
/playNote([55, 60, 64], beats = 4)
/playNote([55, 59, 62], beats = 4)
/playNote([55, 58, 60], beats = 4)
/
</tunepad-cell>

# Arpeggios
To wrap this example up, let's add some arpeggios. Arpeggios are just chords played one note at a time.
In Python we can use a for loop to experiment with different patterns of notes.

<tunepad-cell patch="jazz-bass" name="Lead" uuid="cell5" timeline="midi" theme="light" class="tutorial">
/for note in [ 57, 60, 64, 60] * 2:
/    playNote(note, beats = 0.5)
/
/for note in [ 55, 60, 64, 60] * 2:
/    playNote(note, beats = 0.5)
/
/for note in [ 55, 59, 62, 59] * 2:
/    playNote(note, beats = 0.5)
/
/for note in [55, 58, 60, 58] * 2:
/    playNote(note, beats = 0.5)
/
</tunepad-cell>

# What's Next?
To start creating your own music, go to [tunepad.com](https://tunepad.com) and log in with a gmail account or 
create a new account with a different email address. Once you're logged in, click on the **New Project** button.

For a step-by-step guide, try our tutorials or read our other guides:
* [Song Tutorials](/tutorials)
* [TunePad Docs](/docs)
