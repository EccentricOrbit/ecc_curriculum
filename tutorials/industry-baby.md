---
layout: layouts/cover.njk
tags: covers
category: Cover
title: Industry Baby
description: Lil Nas X (ft Jack Harlow) 2021, Columbia Records.
authors: Remix by Lev Rosenberg
level: Advanced
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/industry-baby-splash.jpg
screenshot: /images/screenshots/industry-baby.png
project: https://tunepad.com/project/41332#tracks
audio: https://api.tunepad.com/api/projects/41332/audio/
disclaimer: Based on work by Lil Nas X (ft Jack Harlow) 2021. For educational purposes only.
---
This advanced project makes use of loops, lists, and production effects. This is best to play from the TRACKS tab.
The introductory fanfare uses an especially cool nested **for loop**.
```python
rhythm = [0.75,"r",0.33,0.33,0.33,0.75,"r",0.75,"r"]
chords = [22, [22, 29], [22, 34]]
for chord in chords:
    for beat in rhythm:
        if beat == "r":
            rest(0.25)
        else:
            playNote(chord, beats = beat)
            if chord == [22,29]:
                rewind(beat)
                playNote(25, beats = beat, velocity = 50)
            if chord == [22, 34]:
                rewind(beat)
                playNote([25, 29], beats = beat, velocity = 50)
with gain([1.5, 0.5, 1.5, 5], beats = 4):
    playNote([22, 27, 29, 34], beats = 4)
    rewind(4)
    playNote([25, 29], beats = 4, velocity = 50)
```
Check out the full project here:
<a href="{{ project }}" target="_blank">
{{ project }}<br><img src="{{ screenshot }}" width="100%"></a>

