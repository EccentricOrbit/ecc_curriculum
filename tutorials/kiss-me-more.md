---
layout: layouts/activity.njk
tags: tutorials
title: Kiss Me More
subtitle: Doja Cat (ft. SZA)
description: Recreate Kiss Me More by Doja Cat (ft SZA). Practice using variables, loops, and simple arithmetic operators in Python.
level: Intermediate
time: 30-40 minutes
license: by-nc-sa
splash: /images/splash/kiss-me-more-splash.png
project: https://tunepad.com/project/42914
audio: https://api.tunepad.com/api/projects/42914/audio/
disclaimer: This tutorial is based on Kiss Me More by Doja Cat (ft. SZA) (2021), RCA. For educational purposes only.
---

# STEP 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and sign in.
* Create a new project and change the name to “Kiss Me More”.
* Set the temp to 220 BPM (beats per minute)

# STEP 2: Drums
* Add a **Drum** cell to your project and set the instrument to **Drums → 808 Drumkit**
* Add these four lines of Python code:	
* Hit the Play button to hear how it sounds
```python
playNote([1, 4])
playNote(4)
playNote([1, 4, 10])
playNote(4)
```
<img src="/images/bass.png" width="200px" style="float: right; margin-right: 1rem;">

# STEP 3: Bass
* Add a Bass cell to your project, and set the instrument to **Bass → Electric Bass**
* This code uses variables to play notes. 
* We use addition and subtraction (operators) to define different notes relative to C.
```python
C = 24
Ab = C - 4
Bb = C - 2
Db = C + 1
Eb = C + 3

playNote(Bb, beats = 6)
playNote(C)
playNote(Eb)
rest(8)
playNote(Ab, beats = 7)
playNote(Db, beats = 5)
playNote(Db)
rest(1)
playNote(C)
```

# STEP 4: Guitar
The guitar part uses both variables and loops
Add a new **Bass** cell to your project and set the instrument to **Bass → Electric Bass**

```python
C  = 48
Db = C + 1
F  = C + 5
G  = C + 7
Ab = C + 8
Bb = C + 10

for i in range(3):
    playNote(Db)
    playNote(Ab)
    
for i in range(5):
    playNote(Db)
    playNote(G)

for i in range(3):
    playNote(C)
    playNote(G)
    
for i in range(3):
    playNote(C)
    playNote(F)
    
playNote([ Ab, C + 12 ])
rest(1)
playNote([ G, Bb ])
```

## STEP 5: Organ 
Add a new **Keys** cell to your project and set the instrument to **Keyboard → Crystal Organ**
```python
playNote([22, 44, 53, 49], beats = 6)
rest(1)
playNote([27, 43, 49, 53], beats = 8)
rest(1)
playNote([20, 43, 48, 51], beats = 6)
rest(1)
playNote([25, 44, 49, 53], beats = 4)
rest(1)
playNote([25, 44, 48, 53], beats = 1)
rest(1)
playNote([24, 44, 48, 51], beats = 0.5)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
