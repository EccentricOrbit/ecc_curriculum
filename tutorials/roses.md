---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Roses
subtitle: SAINt JHN (Imanbek Remix)
description: Get started with TunePad by creating a remix of Roses by SAINt JHN.
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/roses-splash.jpg
slides: https://docs.google.com/presentation/d/12sizoBuHm33JzvQhI-OR5CVw-zCYpVyBJlL-p2as6oI/edit?usp=sharing
project: https://tunepad.com/project/28297
audio: https://api.tunepad.com/api/projects/28297/audio/
---

# Step 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com)
* Click on **Sign In**
* Click on **Sign in with Google**
* Enter your Gmail address and password

# Step 2: Create a new TunePad Project
* Click on the **New Project** button to create an empty project. 
* It should look like the picture below.

<a href="/images/empty-project.png" target="_blank">
<img src="/images/empty-project.png" alt="Screenshot of an empty TunePad project" width="400px"></a>

# Step 3: Kick Drums
* In your project, click on the **ADD CELL** button 
* Then select **Drums**.
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

You’ve just written a Python program!   
Press **Play** at the top left to hear how this sounds.

## Syntax Errors
Occasionally your code won’t work right, and you’ll see a red error message box that looks something like this. This kind of error message is called a “syntax” error. Here the code was written as playnote with a lower-case ‘n’ instead of an upper-case ‘N’. You can fix this error by changing the code to read `playNote` (with an upper-case ‘N’) on line 2.
<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>NameError
    </div>
    <div class="error-description">the name 'playnote' is not defined on line 2.</div>
</div>

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

# STEP 6: Fix Your Kicks
You might notice that the kick drums feel heavy in this mix. We can make some space in the pattern by resting on the up-beats (beats 2 and 4) when the snare drums are playing. Scroll back up to your Kick drum cell and change the code to look like this:
```python
# play kicks on the down beats only
playNote(1)
rest(1)
playNote(1)
rest(1)
playNote(1)
rest(1)
playNote(1)
rest(0.5)                  # rest a half beat
playNote(1, beats = 0.5)   # half beat pickup kick
```

# STEP 7: Adding a Bass Line
Roses has a catchy bass line that repeats for most of the track. 
* Add a new cell to your project, but this time select **Bass** instead of Drums. 
* Once the cell is loaded, change the voice to **Pop Bass**:
This code creates a simplified version of the bass line. When you’re done, try playing everything together to get the full sound.
```python
playNote(5, beats = 0.5)    # start on low F
playNote(17, beats = 0.5)   # up an octave
rest(1)

playNote(10, beats = 0.5)   # A sharp
playNote(22, beats = 0.5)   # up an octave
rest(1)

playNote(8, beats = 0.5)    # G sharp
playNote(20, beats = 0.5)   # up an octave
rest(0.5)
    
playNote(8, beats = 0.5)    # G - C - C
playNote(12, beats = 0.5)
playNote(24, beats = 0.5)

playNote(10, beats = 0.75)  # A sharp
playNote(22, beats = 0.25)
```


# Try it in TunePad
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>