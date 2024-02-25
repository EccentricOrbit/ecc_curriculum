---
layout: layouts/activity.njk
tags: tutorials
title: Halloween Theme
subtitle: John Carpenter
description: Practice using functions and parameters in Python to play repeated patterns. Practice with variables, lists, and operators
level: Intermediate
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/halloween-splash.jpg
project: https://tunepad.com/project/75530
audio: https://api.tunepad.com/api/projects/75530/audio/
disclaimer: This tutorial is based on the Michael Myers Theme by John Carpenter from the movie Halloween (1978). For educational purposes only.
---
<img src="/images/five-four.png" width="250px" style="float: right; margin-right: 1rem; border: 1px solid #0005;">

# STEP 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and sign in. 
* Create a new project and change the name to “Halloween”.
* Set the temp to 270 BPM (beats per minute)
* Set the **time signature** to 5 / 4.


# STEP 2: Spooky Chords
* Add a **Keys** cell to your project and set the instrument to **Keyboard → Piano**
* Get ready for some seriously spooky chords

```python
rest(10)
playNote(30, beats = 10)
playNote([30, 33], beats = 10)
playNote([28, 34], beats = 20)
playNote(30, beats = 10)
playNote([30, 33], beats = 10)
playNote([28, 34], beats = 20)
```

# STEP 3: Suspenseful Melody
* Add a **Keys** cell to your project, and set the instrument to **Keyboard → Piano**
* This code uses functions to play repeated patterns. 
* We create the function called `pattern` at the top the code and then use it at the bottom.

```python
# create a function that defines a repeated pattern
def pattern(b):
    playNote(b)
    playNote(b - 7)
    playNote(b - 7)
    
    playNote(b)
    playNote(b - 7)
    playNote(b - 7)
    
    playNote(b)
    playNote(b - 7)
    playNote(b + 1)
    playNote(b - 7)

    
# now use the pattern function to play the melody
pattern(85)
pattern(85)
pattern(85)
    
pattern(84)
pattern(84)
    
pattern(85)
pattern(85)

pattern(84)
pattern(84)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
