---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: Three Basic Beats
description: Practice using the playNote and rest functions to make three basic beat patterns.
level: Beginner
time: 30 minutes
license: by-nc-sa
splash: /images/splash/three-beats-splash.png
project: https://tunepad.com/project/77343
video-old: https://drive.google.com/file/d/1cmayy1vuAZXzXfaS05d0CG5IJTssXB9K/view
audio: https://api.tunepad.com/api/projects/77343/audio/
---
# BEAT 1: Basic Rock
<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=2&track2=4444&track4=0101&track5=1050" class="composer-iframe" scrolling="no"></iframe>

Try using this Python code to add this beat to your project.
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
<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=3&track4=8484&track5=1111" class="composer-iframe" scrolling="no"></iframe>

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

# BEAT 3: Four-on-the-Floor (House)
<iframe src="/interactives/composer/?embedded=true&bpm=120&steps=16&voice=0&track2=4444&track4=0101&track5=1111" class="composer-iframe" scrolling="no"></iframe>

```python
# Kick
playNote(0)
playNote(0)
playNote(0)
playNote(0)

# Snare
moveTo(0)
rest(1)
playNote(2)
rest(1)
playNote(2)

# Closed Hats
moveTo(0)
rest(0.5)
playNote(4, beats = 0.5)
rest(0.5)
playNote(4, beats = 0.5)
rest(0.5)
playNote(4, beats = 0.5)
rest(0.5)
playNote(4, beats = 0.5)
```
