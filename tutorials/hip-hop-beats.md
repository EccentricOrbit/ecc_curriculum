---
layout: layouts/activity.njk
tags: [ 'learn', 'livecoders' ]
category: Tutorial
title: Three Hip-Hop Beats
description: Practice using the playNote and rest functions to make three common hip-hop beat patterns.
level: Beginner
time: 25 minutes
license: by-nc-sa
splash: /images/splash/still-dre-splash.jpg
project: https://tunepad.com/project/75601
video-old: https://drive.google.com/file/d/1cmayy1vuAZXzXfaS05d0CG5IJTssXB9K/view
audio: https://api.tunepad.com/api/projects/75601/audio/
---



# BEAT 1: Still D.R.E.
This example comes from Still D.R.E. by Dr. Dre ft. Snoop Dogg (1999), Aftermath, Interscope. This beat is sparse, but it leaves space for a bass line and pulsing piano chords that layer together to create the complex rhythmic structure of the original track.

For this example we're going to start with a drum pattern showing when different sounds are played in the beat. This pattern is divided into 16 steps covering a total of four beats (four steps in each beat). Try pressing the ▶ button to hear how it sounds.

<iframe src="/interactives/composer/?bpm=90&steps=16&voice=2&track3=4040&track4=0101&track5=1210&embedded=true" scrolling="no" class="composer-iframe"></iframe>

This pattern has kick drums on beats 1 and 3 with an extra kick right after beat 2. Kick drums give us a deep, pounding sound. There are also snare drums on beats 2 and 4, and a couple of open high-hat sounds.

If you take away the extra kick drum and hi-hats, this is a simple "boom bap" pattern. There are low kicks on beats 1 and 3 (downbeats) and hard snares on beats 2 and 4 (upbeats). Here's the code for the basic pattern that you can try in your TunePad project.
```python
kick = 0            # define a variable for the kick sound
snare = 2           # define a variable for the snare sound
hat = 5             # define a variable for the hi-hat
playNote(kick)
playNote(snare)
playNote(kick)
playNote(snare)
```
A few things to notice about this code:
* It uses **variables** to store the kick and snare sounds that we want to use. This makes it easy to swap out sounds later on, and it makes our code more readable.
* The `playNote` command tells TunePad to play a sound. If you don't tell it anything else, the sound will last for one beat. 
* Any text that comes after the hashtag (#) symbol is called a comment. Comments for humans only. Python will ignore any comments in your code.

Now let's add the extra kick sound and our two high-hats. Here's the complete code:
```python
kick = 0            # define a variable for the kick sound
snare = 2           # define a variable for the snare sound
hat = 5             # define a variable for the hi-hat
playNote(kick)
playNote(snare)
playNote(kick)
playNote(snare)

moveTo(0)                # move to the beginning of the measure
rest(1.25)               # rest for 1.25 beats
playNote(kick)           # play a kick for half a beat

moveTo(0)
rest(0.5)
playNote(hat)
rest(1)
playNote(hat)
```
This code uses two other TunePad functions:
* `moveTo(0)` rewinds back to the beginning of the measure 
* `rest(1.25)` skips 1.25 beats before we add the extra kick


# BEAT 2: 90s Hip-Hop
Here's another classic pattern.

<iframe src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=0&track2=5555&track4=0101&track5=1814" class="composer-iframe" scrolling="no"></iframe>

This pattern is very similar to the first. There are snare drums on the upbeats (beats 2 and 4) and kick drums on the downbeats (beats 1 and 3). The main difference is the extra kick drums and the hi-hat pattern. This beat includes 8 hi-hats spaced at half-beat intervals. Because we have to play 8 notes in a row, this is the perfect opportunity to use a **loop** in Python. A loop is a way of repeating a set of actions multiple times. Here's the simplest way to repeat the hat sound 8 times (on line 5 and 6).
```python
kick = 0            # define a variable for the kick sound
snare = 2           # define a variable for the snare sound
hat = 5             # define a variable for the hi-hat

for i in range(8):    # repeat 8 times
    playNote(hat, beats = 0.5)

# layer in the kicks and snares
moveTo(0)
playNote(kick)
playNote(snare)
playNote(kick)
playNote(snare)

# add the extra kicks
moveTo(0)
rest(1.75)
playNote(kick, beats = 0.25)
rest(1.5)
playNote(kick, beats = 0.5)
```

## A note about indentation in Python
We use indentation to tell Python what parts of our code belong inside the for loop and what parts belong outside. The convention in Python is to add four spaces before each line of code inside the for loop. Python is picky about indentation and gets confused if you don't use the exactly the same indentation for each line in the loop.


# BEAT 3
The next beat is a slightly more contemporary pattern that starts to deviate from the boom bap foundation. The snare drums still play on the upbeats, but the kick drums have shifted. The hi-hat pattern is also starting to get faster.

<iframe height="390" src="/interactives/composer/?embedded=true&bpm=90&steps=16&voice=0&track2=ffff&track4=0101&track5=9440" class="composer-iframe" scrolling="no"></iframe>

Here's the complete code:
```python
hat = 4
for i in range(15):
    playNote(hat, beats = 0.25)

playNote(hat, beats = 0.125)
playNote(hat, beats = 0.125)


snare = 2
moveTo(0)    # rewind to the beginning of the measure
rest(1)
playNote(snare)
rest(1)
playNote(snare)


kick = 1
moveTo(0)    # rewind to the beginning of the measure
playNote(kick, beats = 0.75)
playNote(kick, beats = 0.75)
playNote(kick)
playNote(kick)
```


# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
