---
layout: layouts/activity.njk
tags: [ 'tutorials', 'livecoders' ]
category: Tutorial
title: "Walking on a Dream"
subtitle: Empire of the Sun
description: Learn about chords in music and loops in Python by recreating Walking on a Dream in TunePad
authors: by Clarissa Shieh
level: Intermediate
time: 30 minutes
license: by-nc-sa
splash: /images/splash/walking-on-a-dream-splash.png
video: 
slides: 
project: https://tunepad.com/project/80792
audio: https://api.tunepad.com/api/projects/80792/audio/
disclaimer: For educational purposes only. Based on Walking on a Dream by Empire of the Sun (2008), Capitol.
---

# Step 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Walking on a Dream”. Set the BPM to 127 and key to A♭ Major.

# Step 2: Introduction
Let's start with the synth introduction of the song.

Create a **Keys** cell in your project and switch the voice to **Synth → Leads → Searing Lead**.

We want to first create variables for each of the chords (Db Major, Ab Major, Eb Major) that make up the song:
```python
DbMaj = [56, 61, 65, 68]
AbMaj = [56, 60, 63, 68]
EbMaj = [55, 58, 63, 67]
```

Next, you can copy the code below for the tune of the introduction:
```python
for i in range(2):
    playNote(DbMaj, 1.5)
    playNote(AbMaj, 2.5)

    playNote(AbMaj, 1.5)
    playNote(EbMaj, 2.5)

    playNote(DbMaj, 1.5)
    playNote(AbMaj, 2.5)

    playNote(AbMaj, 1.5)
    playNote(EbMaj, 1.5)

    playNote([60, 63], 0.5)
    playNote([56, 60], 0.5)
    
rest(90)
```
You'll see that we use a Python for-loop because the introduction is made up of this tune played twice.

You may have noticed that there's also a simple hi-hit beat, so add a new **Drums** cell and select the **Headlines Drums**.

You can copy the code below:
```python
for i in range(64):
    playNote(4, 0.5)

rest(90)
```

# Step 3: Guitar
We’re going to add the guitar line that plays throughout the song, after the intro.
Add a new Guitar cell to your project and select **Acoustic Guitar**.

Again, we're going to create the same chords (but this time guitar chords).
Use this code below:
```python
DbMaj = [49, 56, 61, 65, 68]
AbMaj = [44, 51, 56, 60, 63, 68]
EbMaj = [51, 58, 63, 67, 70]

rest(32) # intro beats
    
# section 1:
for i in range(3):
    for j in range(11):
        playNote(DbMaj, 0.5)
    if i == 2:
        playNote(AbMaj, 0.5)
        rest(2)
    else:
        for j in range(5):
            playNote(AbMaj, 0.5)

# section 2:
for i in range(8):
    for j in range(2):
        playNote(DbMaj, 0.5)
    rest(0.5)
    for j in range(2):
        for k in range(3):
            playNote(AbMaj, 0.5)
        rest(0.5)
    for j in range(5):
        playNote(EbMaj, 0.5)
rest(4)         
```
Again, using for-loops is a key part of this song. This time, we're using nested for-loops. Each of the chords are played repeatedly and the sequence of chords that make up the phrase are also played multiple times. 

You might also notice there's an if-else statement inside the first for-loop. In the song, there's a shift from the repeated strumming of the same chords (section 1) to an alternating pattern (section 2). 

# STEP 4: Snare, Mid-Tom, Hi-Hat
After the introduction, along with the guitar line, is the drum beat. The beat remains the same throughout, but in section 1, we use a mid-tom, while in section 2, we use a hi-hat.

Add a **Drums** cell to your project and change the voice to **Rock Drumkit**.

You can use the code below for the drum beat:
```python
rest(32) # intro beats

# section 1:
for i in range(11):
    for j in range(2):
        playNote(7, 0.5)
    playNote([2, 7], 0.5)
    playNote(7, 0.5)
    
for i in range(2):
    playNote(7, 0.3, 127)
    playNote(2, 0.3, 127)
    rest(0.4)

# section 2:
for i in range(31):
    for j in range(2):
        playNote(4, 0.5)
    playNote([2, 4], 0.5)
    playNote(4, 0.5)
    
rest(4)
```

# STEP 5: Kickdrum
We also need to add in a kickdrum beat that comes in with the other drums.

Add a **Drums** cell to your project and change the voice to **Rock Drumkit**.

Copy and paste the code below:
```python
rest(32) # intro beats
for i in range(11):
    for j in range(3):
        playNote(0)
        rest(1)
    for j in range(2):
        playNote(0, 0.5)
    rest(1)

rest(4)
```

# STEP 6: Cymbals
One final part of the percussion line: cymbals.

Create a new **Drums** cell and change the voice to ***808 Drumkit***.

Add in the following code:
```python
rest(56)
for i in range(60):
    playNote(9, 0.5)
    rest(0.5)
    
rest(8)
```

# STEP 7: Melody
Finally, let's add in the melody!

Create a new **Keys** cell and change the voice to ***Piano***.

In the code below, you'll notice that we have if and elif statements within the for-loop, similar to in Step 3. The beginning of these phrases is the same, but each differs slightly in the notes that are played after, whether it's how many times they're played or how many beats they're held for.

Copy and paste in the code below:
```python
rest(32) # intro beats

for i in range(3):
    for j in range(4):
        playNote(72, 0.5)
    playNote(72)
    rest(5)

for i in range(4):
    for j in range(5):
        playNote(63, 0.5)
    if i == 0:
        for j in range(3):
            playNote(60, 0.5)
        for j in range(2):
            playNote(58, 0.5)
            playNote(60, 0.5)
            playNote(60)
    elif i == 1:
        playNote(60, 0.5)
        playNote(60)
        for j in range(2):
            playNote(58, 0.5)
            playNote(60, 0.5)
            playNote(60)
    elif i == 2:
        for j in range(2):
            playNote(60, 0.5)
            playNote(60)
            playNote(58, 0.5)
        playNote(60, 0.5)
        playNote(60)
    elif i == 3:
        for j in range(3):
            playNote(60, 0.5)
        playNote(58, 0.5)
        for j in range(2):
            playNote(60, 0.5)
        for j in range(2):
            playNote(58, 0.5)
        for j in range(2):
            playNote(60, 0.5)

for i in range(2):   
    for j in range(2):
        playNote(63, 0.5)
    playNote(58, 0.5)
    playNote(72, 2.5)
    playNote(58, 0.5)
    playNote(58)
    rest(1.5)
    playNote(63, 0.5)
    playNote(68, 0.5)
    rest(0.5)
    playNote(72)
    playNote(70)
    playNote(68, 0.5)
    playNote(67, 0.5)
    rest(0.5)
    playNote(67, 0.5)
    playNote(65)
    rest(2.5)
rest(2.5)

```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
