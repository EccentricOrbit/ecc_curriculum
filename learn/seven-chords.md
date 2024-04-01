---
layout: layouts/activity.njk
category: Lesson
tags: learn
title: "Seven Easy Chords"
description: A chord is more than one note played at the same time. There are many, many chords to choose from, but here are seven easy chords to get you started.
level: Beginner
time: 30 minutes
license: by-nc-sa
splash: /images/splash/chords-splash.jpg
date: 2024-01-04
---
# Chords and Lists
A chord is more than one note played together at the same time. 
In programming we can play chords using lists of numbers.
```python
playNote([ 48, 52, 55 ])
```

# Seven Easy Chords
There are many chords to choose from, but here are seven great chords to get you started!

<style>
    big {
        font-size: 300%;
        position: relative;
        top: -1rem;
    }
</style>

| Chord | Name and Notes | Python List |
| -- | ---------------- | ---------------- |
| <big>➊</big> | C&nbsp;Major<br>C, E, G | `[ 48, 52, 55 ]` |
| <big>➋</big> | D&nbsp;minor<br>D, F, A | `[ 50, 53, 57 ]` |
| <big>➌</big> | E&nbsp;minor<br>E, G, B | `[ 52, 55, 59 ]` |
| <big>➍</big> | F&nbsp;Major<br>F, A, C | `[ 53, 57, 60 ]` |
| <big>➎</big> | G&nbsp;Major<br>G, B, D | `[ 55, 59, 62 ]` |
| <big>➏</big> | A&nbsp;minor<br>A, C, E | `[ 57, 60, 64 ]` |
| <big>➐</big> | B&nbsp;diminished<br>B, D, F | `[ 59, 62, 65 ]` |

# Build Harmony!
* Go to [tunepad.com](https://tunepad.com) and Sign In with Google
* Create a new project called Chords
* Add a **Keys** cell to your project
* Pick four of the chords from the previous page that you think sound good together. 
* Then use TunePad to play the chords for 4 beats each.

Here’s an example with chords:  

<big>➊ ➎ ➏ ➍</big>

```python
playNote([ 48, 52, 55 ], beats = 4)
playNote([ 55, 59, 62 ], beats = 4)
playNote([ 57, 60, 64 ], beats = 4)
playNote([ 53, 57, 60 ], beats = 4)
```

Try playing it with different instruments and tempos to get a sound that you like.
When you play chords in a fixed order it’s called a **chord progression**.