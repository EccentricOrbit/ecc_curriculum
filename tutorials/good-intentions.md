---
layout: layouts/activity.njk
tags: ["tutorials", "livecoders"]
category: Tutorial
title: "Good Intentions"
subtitle: Noah & Now United
description: Learn about in music and loops in Python by recreating the Good Intentions in TunePad
level: Beginner
time: 15 minutes
license: by-nc-sa
splash: /images/splash/stranger-things-splash.jpg
video: https://drive.google.com/file/d/1Er4rBmwG3Jj7FyCdDEIc8GfMkdx-Nuav/view?usp=sharing
slides: https://docs.google.com/document/d/1GJFpag52fC_8d6yRB6AliR6dF6JXxbo4yqCQENfbcxI/edit?usp=sharing
project: https://tunepad.com/project/27933
audio: https://api.tunepad.com/api/projects/27933/audio/
disclaimer: For educational purposes only. Based on Stranger Things Volume 1 by Kyle Dixon and Michael Stein (2016), Lakeshore and Invada Records.
---

# Step 1: Create a new Project

Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project "Good Intentions".

# Step 2: Heartbeat

We’ll start with the heartbeat drums that give the theme its sense of excitement, unease, and anxiety.
It’s the quickened pulse of a human heartbeat. Create a new Drum cell in TunePad, and use this code:

```python
playNote(1, beats = 0.5)
playNote(1, beats = 0.5, velocity = 50)
rest(1)

playNote(1, beats = 0.5)
playNote(1, beats = 0.5, velocity = 50)
rest(1)
```

The heartbeat sounds like a LUB-dub, LUB-dub. Notice that we use the `velocity` parameter to make the first LUB kicks louder than the second dub kicks.

# Step 3: Ominous Drone

We’re going to add a low, ominous drone that slowly fades in and out of the mix.  
Add a new Keys cell to your project and switch the voice to **Synth → Leads → Searing Lead**.

<a href="/images/stranger-things-fig1.png" target="_blank">
<img src="/images/stranger-things-fig1.png" alt="Screenshot of a TunePad keyboard instrument" width="450px" style="margin: 1rem;"></a>

Use this code for your drone sound:

```python
with lowpass(frequency = [0, 1100, 0], beats = 40):
    playNote(16, beats = 40)
```

This uses an audio production tool called a **lowpass filter** that slowly opens and closes over 40 beats.
