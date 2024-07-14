---
layout: layouts/activity.njk
tags: [ 'tutorials', 'livecoders' ]
category: Tutorial
title: "Major and Minor Scales"
subtitle: What are scales? How do you code them in TunePad?
description: Learn about scales in music by recreating Let Her Go in TunePad
authors: by Clarissa Shieh
level: Beginner
time: 30 minutes
license: by-nc-sa
splash: /images/splash/music-scales.png
video: 
slides: 
project: https://tunepad.com/project/81586
audio: https://api.tunepad.com/api/projects/81586/audio/
disclaimer: For educational purposes only. Based on Let Her Go by Passenger (2012), Embassy of Music.
---
# Welcome!
**Please complete the pre-survey before completing the activity: <a href="https://forms.gle/igzSe7XsesKwnowe6" target="_blank">https://forms.gle/igzSe7XsesKwnowe6</a>**

# What are Scales?
Scales are a very useful tool in music involving a set of eight notes put in order by their pitch. If you play an instrument, you may have played scales as a warm-up when practicing. Many songs utilize scales, whether that’s in a typical ascending or descending form, or jumbling up the order of the notes to create a melody.

There are two main types of scales: major and minor. All scales are made up of a series of what are called whole and half steps. There are 12 semitones in music:

A, A#/B♭, B, C, C#/D♭, D, D#/E♭, E, F, F#/G♭, G, G#/A♭

A whole step is between any two notes that are two semitones apart. A half step is when there is only one semitone between each note. In TunePad, to create a half step, just add/subtract 1 to the number inside your ```python playNote()``` command and add/subtract 2 to create a whole step.

Major scales tend to have a happier and brighter sound. They follow a special pattern of whole (W) and half (H) steps: W W H W W W H.

<img src="/images/scale-steps.png" alt="Step pattern in major scale" width="500" style="margin-bottom: 2em">

On the other hand, minor scales have a more sad and dark tone. Like major scales, they also have their own pattern of whole and half steps: W H W W H W W.

# How do I use the interactive?
Below is an interactive designed to help you create scales in TunePad. This interactive contains the major and minor scales of the 7 basic notes (think the white keys on a piano): A, B, C, D, E, F, and G. 

In the top left corner, there is a button where you can toggle between major and minor scales. 

Right below it is a rainbow colored wheel that you can rotate to see the different scales. Each note coordinates with a corresponding color that is displayed in the sheet music scale below and the Python code at the bottom.

The lines below the music notes on the staff signify whole and half steps. Solid lines are whole steps and dashed lines are half steps.

<img src="/images/scale-interactive.png" alt="Major setting on scale interactive" 
width="500" style="margin-bottom: 2em">

# How can I code scales in TunePad?
Let’s practice what we learned about scales in TunePad by coding the introduction of the song Let Her Go by Passenger! Let Her Go utilizes the C Major scale to create this popular melody. 

## Step 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Let Her Go” and set the BPM to 90. 

## Step 2: Interactive
Keep the scale interactive open next to your project for easy access. The default start page displays the C Major scale, so we're all set! 

## Step 3: Code
Add a **Guitar** cell to your project.

Now, use the interactive tool to code the line of music below. 

_Hint: all of the notes you'll need (except one) are all in the C Major scale. Use the music notes and code block in the interactive to help you! For the one note that is outside of the C Major scale, think about whole steps and how we code them in TunePad._
<img src="/images/let-her-go-sheet-music.png" alt="Let Her Go sheet music" 
width="800" style="margin-bottom: 2em">

# Finished?
**Please complete the post-survey after completing the activity: <a href="https://forms.gle/MgP7bxFJ6VnqyoTU8" target="_blank">https://forms.gle/MgP7bxFJ6VnqyoTU8</a>**

# Stuck?
If you're stuck, open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a> for the solution.
