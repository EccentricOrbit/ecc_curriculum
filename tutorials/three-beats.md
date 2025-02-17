---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: Three Basic Beats
description: Practice using the playNote and rest functions to make three basic beat patterns.
level: Beginner
time: 25 minutes
license: by-nc-sa
splash: /images/splash/three-beats-splash.png
project: https://tunepad.com/project/77343
video-old: https://drive.google.com/file/d/1cmayy1vuAZXzXfaS05d0CG5IJTssXB9K/view
audio: https://api.tunepad.com/api/projects/77343/audio/
---
# Create a Shared Project
* Go to [tunepad.com](https://tunepad.com) and Sign In
* Create a new project called Basic Beats
* Try making each of the following beats

# BEAT 1: Basic Rock
<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=2&track2=4444&track4=0101&track5=1050" class="composer-iframe" scrolling="no"></iframe>

* Click on the **Add Cell** button
* Select Drums
* Change the instrument to **Drums → Rock Drumkit**
* Add this code to your cell and press Play to hear how it sounds.
```python
playNote(0, beats = 0.5)
playNote(4, beats = 0.5)
playNote(2, beats = 0.5)
playNote(4, beats = 0.5)
playNote(0, beats = 0.5)
playNote([0, 4], beats = 0.5)   # play kick and hat together
playNote(2, beats = 0.5)
playNote(4, beats = 0.5)
```


# BEAT 2: Trapetón (Latin Trap / Bad Bunny Beat)
<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=1&track4=8484&track5=1111" class="composer-iframe" scrolling="no"></iframe>

* Click on the **Add Cell** button and select Drums
* Change the instrument to **Drums → Headline Drums** and add this code.
* Press Play to hear how it sounds.

```python
playNote(0, 0.75)
playNote(2, beats = 0.25)
playNote(0, beats = 0.5)
playNote(2, beats = 0.5)
playNote(0, beats = 0.75)
playNote(2, beats = 0.25)
playNote(0, beats = 0.5)
playNote(2, beats = 0.5)
```


# BEAT 3: Vintage Hip-Hop
<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=0&track1=0020&track4=0101&track5=9440" class="composer-iframe" scrolling="no"></iframe>

* Click on the **Add Cell** button and select Drums.
* Change the instrument to **Drums → 808 Drums**, and add this code

```python
playNote(1, beats = 0.75)
playNote(1, beats = 0.75)
playNote(1)
playNote(1)

moveTo(0)    # rewind to the beginning of the measure
rest(1)
playNote(2)
rest(0.25)
playNote(10, beats = 0.75)
playNote(2)
```

# Try Making Your Own
Try experimenting with your favorite beat! Change the timing or drum sounds.
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
