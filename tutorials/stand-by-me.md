---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: Stand By Me
description: Use lists of lists, nested loops, and conditional logic to recreate this timeless classic.
authors: by Poom Sombotboon
level: Advanced
time: 1 hour
license: by-nc-sa
splash: /images/splash/stand-by-me-splash.jpg
project: https://tunepad.com/project/24708
audio: https://api.tunepad.com/api/projects/76038/audio/
video: https://www.youtube.com/embed/XcPUELWscVk?si=Ll-3nKM1lIVlOQqe
disclaimer: This tutorial is based on Stand by Me by Ben E. King (1961). For educational purposes only.
---

# Intro
"Stand by Me" was written and originally performed in 1961 by soul and R&B singer Ben E. King. The song is globally known for its message and captivating sounds. Tim Jonze from the Guardian (2015) once wrote "[f]ifty-five years after it was written, the original version still wields the kind of emotional heft that can reduce people to tears.”  

The song has a clear chord progressions and rhythmic structure that makes it perfect to recreate in TunePad. Here's what the original song sounds like:

<iframe width="560" height="315" src="https://www.youtube.com/embed/hwZNL7QVJjE?si=-PvWw_UfzfjrlnQW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# STEP 1: Melody
To make the process of recreating music easier, we'll use sheet music as a guide. First, if we take a look at the first bass clef, we notice that the chords and rhythmic structure in the first six measures repeat throughout the music.

<img src="/images/sbm-sheet-music.png" alt="Stand by Me sheet music" width="100%" style="max-width: 600px;">

We can take advantage of this repetition by using a Python for-loop to keep our code short and simple.

To make lists of notes and beats, we can use a **two-dimensional** list (list of lists) as our data structure. For a list of notes, the outer dimension represents six different measures and the list of notes live inside these measures. On the other hand, there are only two types of beats that we see one that ends with two eighth notes and the other that ends with a quarter note. Similar to the list of notes, we can store these beats inside a two-dimensional array. Here's what the Python code looks like:

```python
note_list = [[45, 45, 40, 44],     # measure 1  
             [45, 45, 45, 44],     # measure 2
             [42, 42, 40],         # measure 3     
             [42, 42, 42, 40],     # measure 4 
             [38, 38, 38, 42],     # measure 5
             [40, 40, 40, 44]]     # measure 6

beats_list = [[1, 1.5, 0.5, 0.5],  # type 1 
               [1, 1.5, 1]]        # type 2
```

Now you might have wondered how would we loop through these two different objects at the same time? Python has a very nice built-in function called `zip` which allows us to loop through two or more lists at the same time.

Since we the objects that we want to loop through are two-dimensional list, we'll need to use a nested loop to loop through each dimension of the object. Here is a snippet of the whole code which includes some of the conditions that we would need to switch between different types of beats as we loop through the notes and beats list object.
```python
for measure, notes in enumerate(note_list):
    # if we are at the third measure, we play another 
    # beats
    type_beat = beats_list[0] if measure != 2 else beats_list[1]
    # loop through both notes and beats
    for index, (note, beat) in enumerate(zip(notes, type_beat)):
        # if we are at the second note
        # we need a little pause 
        if index == 1:
            rest(0.5)
            playNote(note, beats = beat)
        else:
            playNote(note, beats = beat)
```
If you look at the code above, you might notice that there is something new as well – `enumerate`. Enumerate is another Python build-in function that returns both the index of the iterable object, which in this case is a list and a value of each element itself.

Now that you have all the tools needed for recreating a background tune of the song, let's code!

# STEP 2: Chords
To add more dynamic to our tunes, we can play the first three beats of each measure with the chords listed in the music sheet. Since we'll use the same beats for each measure, we can create a function that takes in a chord. 
```python
def play_chord(chord):
    playNote(chord, beats = 1)
    rest(0.5)
    playNote(chord, beats = 0.5)
    playNote(chord, beats = 0.5)
    rest(1.5)
```
Similar to what we did before, we can also define a list of chords that we would like to pass into our function by using a two-dimensional array. Each element in the chords list represents a chord and the elements inside these chords are the notes that are used to construct the chord. To apply the function we created earlier (play_chord) to each chord in the list, we can implement Python's build-in function map to our list of chords.
```python
# Define a list of chords
chord_list = [[45, 40, 37],  # A
              [45, 40, 37],  # A
              [42, 33, 37],  # F#m
              [42, 33, 37],  # F#m
              [38, 30, 33],  # D
              [40, 32, 35]]  # E

# Map the function play_chord to each chord in the list
map(play_chord, chord_list)
```

# STEP 3: Drums
To even make our tunes spicier, we use a sequencer to add many awesome beats to our tunes as the beat snippet shown below.

We could also go in-depth and try to understand how the behind-the-scene of the sequencer! The function `sequence` takes in two parameters:

* **sound:** type of instrument that we would like to play
* **pattern:** a string, which we could think of it as a list of characters

Inside the function we will use a for-loop to iterate over each character in the string. Inside, the loop we can put the if-else statement to specify what we want to do with each character in the pattern. For example, if the character is a `'!'`, play a sound really loud (`velocity = 100`), but if the character is a `'*'`, play a sound normally (`velocity = 50`). Otherwise, rest. After finish looping through each character in the pattern, we can use moveTo to move back to the beginning of the measure. This will help us calls to different instruments/machines at the same time.

```python
def sequence(sound, pattern):
    for c in pattern:
        if c == '*': playNote(sound, beats = 0.25, velocity = 50)
        elif c == '!': playNote(sound, beats = 0.25, velocity = 100)
        else: rest(0.25)
    moveTo(0)

sequence(0, '!-------------!-')
sequence(11, '----!-!-----!---')
sequence(4, '*-***-*-*-*-*-*-')
sequence(56, '------------*---')
```

# Try It
That's it! We have recreated part of this famous song. Take a look at the working project in TunePad:
<a href="{{project}}" target="_blank">{{ project }}</a>
