---
layout: layouts/activity.njk
title: "Interstellar Theme"
subtitle:  Recreate the iconic melody from the movie, Interstellar
description: Recreate the iconic melody from the Interstellar in TunePad
authors: Michael Horn
disclaimer: "This tutorial is based on the Interstellar: Original Motion Picture Soundtrack by Hans Zimmer (2014) WaterTower Music. This material is for educational purposes only and may not be sold or commercially reproduced."
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/interstellar-splash.png
project: https://tunepad.com/project/68150
showtoc: true
---
Interstellar features a hauntingly beautiful soundtrack composed by Hans Zimmer in 2014.
In this short tutorial we'll recreate a simplified part of the iconic melody from the main theme. 
If you're new to TunePad, you might want to try out the [Warmup: Chicago House Beat](/activities/warmup) activity first.

### Objectives
* Practice using the `playNote` function with note values
* Learn how to combine left-hand and right-hand piano parts

### Materials
* Chromebook, iPad, laptop, or desktop computer
* Headphones (recommended)
* Printout (optional)

<div class="page-break"></div>

# Step 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com)
* Click on **Sign In**
* Click on **Sign in with Google**
* Enter your Gmail address and password

<div class="noprint">
If you're not familiar with the Interstellar sound track you can listen to the main theme here:
<br><br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/kpz8lpoLvrA?si=FmTMzNj59VNrNMpH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

# Step 2: Create a new TunePad Project
* Click on the **New Project** button to create an empty project.
* Name your project **Interstellar Theme**.

# Step 3: Melody
* In your project, click on the **ADD CELL** button 
* Then select **Keys**.

* In TunePad, a “cell” is an instrument that you can program to play music. 
* Name the new instrument “Kicks” and then add this Python code.

```python
playNote(0)
playNote(0)
playNote(0)
playNote(0)
```

When you’re done, your project should look something like this:

<a href="/images/drum-cell.png" target="_blank">
<img src="/images/drum-cell.png" alt="Screenshot of a TunePad drum cell" width="400px"></a>

You’ve just written a Python program! Press **Play** at the top left to hear how this sounds.


# Step 4: Snare Drums
* For our kick drums we used a TunePad statement called `playNote`. 
* Every time we type a line of code with `playNote`, it adds a sound to our track. 
* Click the **ADD CELL** button again and select **Drums**. 
* Now you should have two drum cells, one appearing above the other in your project. 
* Name the second cell “Snare Drums” and add this Python code. 
* Try playing this cell while playing the kick drums at the same time. In TunePad all cells will *synchronize* together.


```python
# play two snare drums on the up beats only
rest(1)       # skip a beat
playNote(2)   # play a snare drum sound
rest(1)
playNote(2)
```

The text that comes after the hashtag symbol (#) is called a comment, and it’s for human coders to help document their code. Anything that comes after the hashtag on a line is ignored by Python.

# Step 5: Hi-Hats
* Click **ADD CELL** again to add a third drum cell. 
* Change the title of this cell to “Hats” and add this code:

```python
# play four hats between the kicks and snares
rest(0.5)                  # rest for half a beat
playNote(4, beats=0.5)     # play a hat for half a beat
rest(0.5)
playNote(4, beats=0.5)
rest(0.5)
playNote(4, beats=0.5)
rest(0.5)
playNote(4, beats=0.5)
```

Try playing all three of the drum cells together, you should hear a basic House beat pattern:

### KICK - HAT - SNARE - HAT - KICK - HAT - SNARE - HAT

# Step 6: Bass Line
* Add a new cell to your project, but this time select **Bass** instead of Drums. \
* Next add this code:

```python
playNote(21, beats = 4)
playNote(24, beats = 4)
playNote(23, beats = 4)
playNote(22, beats = 3)
playNote(22, beats = 1)
```

# Try it in TunePad
Here's a link to the full project in TunePad:
[{{ project }}]({{project}})