---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Not Like Us Drum Pattern
subtitle: Kendrick Lamar
description: Recreate the drum pattern from Not Like Us
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/notlikeus.png
project: https://tunepad.com/project/100546
audio: https://api.tunepad.com/api/projects/100546/audio/
disclaimer: This tutorial is based on Not Like Us by Kendrick Lamar (Interscope, 2024). For educational purposes only.
---

Here's a quick tutorial to create the drum pattern to Not Like Us.

# STEP 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com) and sign in
* Create a new project and call it "Not Like Us"


# STEP 2: Claps
* In your project, click on the **ADD CELL** button then select **Drums**.
* Change the instrument to **Drums → 909 Drumkit**

```python
rest(1)
playNote(10)
rest(1)
playNote(10)
```

# STEP 3: Kicks
* Click on the **ADD CELL** button then select **Drums**.
* Change the instrument to **Drums → Headlines Drums**

```python
kick = [ 0, 9 ]

playNote(kick, beats = 0.75)
playNote(kick, beats = 0.25)
playNote(kick, beats = 0.5)
playNote(kick, beats = 0.5)
playNote(kick, beats = 2)


playNote(kick, beats = 0.75)
playNote(kick, beats = 0.25)
playNote(kick, beats = 0.5)
playNote(kick, beats = 0.5)
playNote(kick)
playNote(kick)
```


# STEP 3: Hats
* Click on the **ADD CELL** button then select **Drums**.
* Change the instrument to **Drums → 808 Drumkit**

```python
playNote([4, 5], beats = 1.5)
playNote(4)

for i in range(6): 
    playNote(4, beats = 0.25)

playNote(4, beats = 1.5)
playNote(4, beats = 0.75)

for i in range(3): 
    playNote(4, beats = 0.25)
rest(0.25)

playNote(4, beats = 0.25)
rest(0.25)
playNote(4, beats = 0.25)
```
# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
