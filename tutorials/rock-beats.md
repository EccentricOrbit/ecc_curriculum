---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: Custom Rock Beat
description: Practice building and customizing a rock beat pattern.
level: Beginner
time: 10 minutes
license: by-nc-sa
splash: /images/splash/drumkit-splash.png
project: https://tunepad.com/project/77995
audio: https://api.tunepad.com/api/projects/77995/audio/
---
# Step 1: Create a new Project
* Go to [tunepad.com](https://tunepad.com) and log in
* Create a new project
* Add a drum cell and set the instrument to **Drums → Rock Drumkit**


<iframe height="325" src="/interactives/composer/?embedded=true&bpm=110&steps=16&voice=2&track2=5555&track4=0101&track5=1050" class="composer-iframe" scrolling="no"></iframe>


# Step 2: Define your variables
Start by adding a new Drum instrument to your project. For a rock beat, our main ingredients will be kick drums, snares, and hi-hats. So, let's define some variables for those sounds.
```python
kick = 0
snare = 2
hat = 4
```

# Step 3: Hat Loop
We start with a hi-hat loop with 8 hats spaced at half-beat intervals
```python
for i in range(8): playNote(hat, beats=0.5)
```

# Step 4: Backbeat
To create the backbeat feel, we put snare drum hits on beats 2 and 4
```python
moveTo(0)
rest(1)
playNote(snare)
rest(1)
playNote(snare)
```

# Step 5: Kick Drums
Finally add in the kick drum layer.
```python
moveTo(0)
playNote(kick)
rest(1)
playNote(kick, beats = 0.5)
playNote(kick, beats = 0.5)
```

# Step 6: Customize
Customize your rock beat by adding kick drums at different locations in the measure. You can also experiment with other sounds such as toms and crash cymbals. When you're ready, share your project!


# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
