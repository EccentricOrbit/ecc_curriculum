---
layout: layouts/activity.njk
tags: beatmakers
category: Lesson Plan
title: Variables, Lists, & Chords
description: Today we’ll learn about variables in Python to help make our code more readable and reusable. We’ll also learn how to use lists to play common chords in music.
level: Beginner
time: 50 minutes
license: by-nc-sa
splash: /images/splash/meer-bass-splash.png
video: https://drive.google.com/file/d/19eKW276TlQcaitZWOwYGTsuPkG10tZV5/view
slides: https://docs.google.com/presentation/d/1U1L9Eg9rGV3lvLYPcZoFbospAkggN_htF0ex_075E6s/edit#slide=id.g13e681789de_2_0
project: https://tunepad.com/project/43861
audio: https://api.tunepad.com/api/projects/43861/audio/
---
### Learning Objectives
* Learn about variables in programming
* Learn about lists in programming
* Learn about common chord progressions in music
* Practice playing chords in TunePad


# Topic 1: Variables in Python
In programming, a **variable** is a name that stands for numbers, text, or other information.
Variables are helpful for making your code easier to understand and modify.
You can use any name you want for a variable as long as it follows the rules.  

## Variable names:
* Can include letters, numbers, and the underscore (_) character.
* Cannot include spaces, tabs, quotes, or other characters.
* Cannot start with a number.
*Cannot be a Python keyword (like def, for, in, while, if)

## Here are some example valid and invalid variable names
| VALID ✅ | INVALID ❌ |       |
| -------- | ---------- | ---- |
| `hat`    | `hi hat`   | (no spaces allowed) |
| `kick`   | `1tom`     | (can’t start with a number) |
| `high_hat` | `while`  | (can’t be a keyword) |
| `_chord` | `@tom`     | (no special characters like @) |
| `my_long_variable` | `C#` | (can’t use a hashtag) |
| `tom1`  | `tom-1` | (no dashes allowed) |
| `CMajor` | `C:major` | (no colon characters allowed) |


## Variables for Drums
This example uses variables for drum names.
We assign a value to a variable using the equal sign (=)
The variable name comes first, then the equal sign, and then the value.
```python
kick = 1
hat = 4
snare = 2
clap = 10

playNote([kick, hat], beats = 0.5)
playNote(hat, beats = 0.5)
playNote([kick, hat, snare, clap], beats = 0.5)
playNote(hat, beats = 0.5)
```

<img src="/images/list-icon.png" alt="List Icon" style="float: right" width="170">

# Topic 2: Lists in Python
In programming, a list is an ordered collection of things
* A list can be as long or short as you want
* A list can be empty (zero items)
* A list holds things in fixed order
* A list can hold numbers, letters, words, or even other lists
* A list can hold variables too
* Here are a few examples of lists in Python
```python
notes = [ 24, 28, 31 ]
colors = [ "blue", "yellow", "red", "green" ]
emptyList = [ ]
```

## Lists in TunePad
In TunePad you can use a list to play more than one drum sound at the same time.
```python
kick = 1
hat = 4
snare = 2

# play a kick, hat, and snare drum at the same time
playNote([kick, hat, snare])
```

You can use a list to play a chord, which means more than one musical note at a time.
```python
# play a C Major chord
playNote([60, 64, 67])
```

# Activity: Bad Bunny Beat
In this activity, you'll practice using lists and variables to make a Bad Bunny-style beat.
<a href="/tutorials/bad-bunny" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/bad-bunny-splash.png" style="margin: 0.5rem 0" alt="Bad Bunny" width="400">Open Bad Bunny Activity</a>


# Activity: Build your own chord progressions
In music a chord is more than one note played at the same time. 
There are many, many chords to choose from, but here are seven easy chords to get you started.
<a href="/learn/seven-chords" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/chords-splash.jpg" style="margin: 0.5rem 0" alt="Bad Bunny" width="400">Open Seven Chords Activity</a>

# Same four chords!

<iframe width="560" height="315" src="https://www.youtube.com/embed/HTYrkOZ5nCs?si=5MSobitSM28Zxe4n" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>