---
date: 2024-01-07
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: Variables and Lists
description: Variables in Python can help make our code more readable and reusable, and lists give us a way to play more than one note at the same time.
level: Beginner
time: 20 minutes
license: by-nc-sa
splash: /images/splash/meer-bass-splash.png
prevURL: /curriculum/activities/livecode-reggaeton
prevTitle: Functional Reggaetón Beat
nextURL: /curriculum/activities/livecode-notes
nextTitle: Notes and Melody
---

# Topic 1: Variables in Python
* In programming, a **variable** is a name that stands for numbers, text, or other information.
* Variables are helpful for making your code easier to understand and modify.
* You can use any name you want for a variable as long as it follows the rules.  

## Variable names:
* Can include letters, numbers, and the underscore (_) character.
* Cannot include spaces, tabs, quotes, or other characters.
* Cannot start with a number.
* Cannot be a Python keyword (like `def`, `for`, `in`, `while`, `if`)

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
