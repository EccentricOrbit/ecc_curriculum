---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Sweater Weather Drum Pattern
subtitle: The Neighbourhood
description: Recreate the drum pattern to Sweater Weather
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/sweater-splash.png
project: https://tunepad.com/project/100559
audio: https://api.tunepad.com/api/projects/100559/audio/
disclaimer: This tutorial is based on Sweater Weather by the Neighbourhood (Columbia, 2012). For educational purposes only.
---

Here's a quick tutorial to create the classic rock beat from the 2012 hit, Sweater Weather by the Neighbourhood.

# STEP 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com) and sign in
* Create a new project and call it "Sweater Weather"


# STEP 2: Intro / Verse Pattern
* In your project, click on the **ADD CELL** button then select **Drums**.
* Change the instrument to **Drums → Rock Drumkit**
* For this part, we're going to use TunePad's `moveTo` function to layer three different drum sounds together.
* You can think of `moveTo` as rewinding back to the beginning of the beat.

```python
# hi-hats
for i in range(32):
    playNote(4, beats = 0.5)

# kick drums 
moveTo(0)  # rewind to the beginning
playNote(0)
rest(7)
playNote(0, beats = 1.5)
playNote(0, beats = 1.5)


# snare drums
moveTo(0)  # rewind to the beginning
for i in range(4):
    rest(1)
    playNote(2)
    rest(1)
    playNote(2)

```

# STEP 3: Chorus Pattern
* Click on the **ADD CELL** button then select **Drums**.
* Change the instrument to **Drums → Rock Drumkit**

```python
playNote(0, beats = 0.5)
playNote(0, beats = 0.5)
playNote(2, beats = 0.5)
playNote(0, beats = 0.5)
rest(1)
playNote(2)

rest(1)
playNote(2)
rest(1)
playNote(2)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
