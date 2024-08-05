---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Hedwig's Theme from Harry Potter
subtitle: by John Williams
description: Recreate the iconic melody from Harry Potter.
level: Beginner
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/hedwig-splash.png
project: https://tunepad.com/project/83275
audio: https://api.tunepad.com/api/projects/83275/audio/
disclaimer: This tutorial is based on Hedwig's Theme by John Williams (2001). For educational purposes only.
---
Are you ready for some magic? Hedwig's Theme from the Harry Potter soundtrack by John Williams is one of the most recognizable 
melodies ever written for cinema. In this short tutorial, we'll recreate the opening phrase of the theme and 
learn how to play notes of different lengths.

<img src="/images/hedwig-sheet-music.png" style="width: 50%;" alt="">

# STEP 1: Sign In to TunePad
* Go to [tunepad.com](https://tunepad.com) and sign in
* Create a new project and call it "Hedwig's Theme"
* Change the tempo to **90 bpm**

# STEP 2: Playing Notes in TunePad
* TunePad uses numbers instead of names to play different notes
* For example, to play a middle C note on the piano kyeboard, you would use the `playNote` function with the number 60.

<img src="/images/Figure2.10.png" style="width: 40%;" alt="The TunePad playNote functions">

<div class="noprint">
Try playing the piano keyboard to see different note numbers.

<note-explorer patch="/sounds/voices/grand-piano/patch.json"></note-explorer>
</div>

# STEP 3: Note Timing
* You can change the length of a note using the **beats** parameter.
* Here are some common note lengths

<a href="/images/Figure2.5.png">
<img src="/images/Figure2.5.png" alt="Common note symbols" style="min-width: 100%; margin: 2em auto"></a>

# STEP 4: Opening Phrase
Let's put this all together to play the opening phrase from Hedwig's Theme.
```python
rest(1)
playNote(71, beats = 0.5)
playNote(76, beats = 0.75)
playNote(79, beats = 0.25)
playNote(78, beats = 0.5)
playNote(76, beats = 1)
playNote(83, beats = 0.5)
playNote(81, beats = 1.5)
playNote(78, beats = 1.5)
playNote(76, beats = 0.75)
playNote(79, beats = 0.25)
playNote(78, beats = 0.5)
playNote(75, beats = 1)
playNote(77, beats = 0.5)
playNote(71, beats = 2.5)
```

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
