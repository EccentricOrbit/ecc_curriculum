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
# Seven Easy Chords
A **chord** is more than one note played together at the same time. 
In programming we can play chords using lists of numbers.
```python
playNote([ 48, 52, 55 ])
```
There are many chords to choose from, but here are seven great chords to get you started!

<style>
    big {
        font-size: 300%;
        line-height: 100%;
    }
    article table { 
        margin: 3rem;
        border-collapse: collapse;
        background-color: transparent;
    }
    article table td { 
        font-size: 14px; 
        padding-bottom: 0;
        vertical-align: middle;
    }
    article table tr td:last-child {
        text-align: center;
    }
</style>

<table>
<tr>
    <td><big>➊</big></td>
    <td>C&nbsp;Major (C, E, G)</td>
    <td><code>[ 48, 52, 55 ]</code></td>
    <td><img src="/images/chords/Cmaj.png" alt="C Major piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➋</big></td>
    <td>D&nbsp;minor (D, F, A)</td>
    <td><code>[ 50, 53, 57 ]</code></td>
    <td><img src="/images/chords/Dmin.png" alt="D minor piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➌</big></td>
    <td>E&nbsp;minor (E, G, B)</td>
    <td><code>[ 52, 55, 59 ]</code></td>
    <td><img src="/images/chords/Emin.png" alt="E minor piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➍</big></td>
    <td>F&nbsp;Major (F, A, C)</td>
    <td><code>[ 53, 57, 60 ]</code></td>
    <td><img src="/images/chords/Fmaj.png" alt="F Major piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➎</big></td>
    <td>G&nbsp;Major (G, B, D)</td>
    <td><code>[ 55, 59, 62 ]</code></td>
    <td><img src="/images/chords/Gmaj.png" alt="G Major piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➏</big></td>
    <td>A&nbsp;minor (A, C, E)</td>
    <td><code>[ 57, 60, 64 ]</code></td>
    <td><img src="/images/chords/Amin.png" alt="A minor piano keys" width="180"></td>
</tr>
<tr>
    <td><big>➐</big></td>
    <td>B&nbsp;diminished (B, D, F)</td>
    <td><code>[ 59, 62, 65 ]</code></td>
    <td><img src="/images/chords/Bdim.png" alt="B diminished piano keys" width="180"></td>
</tr>
</table>


# Build Harmony!
* Go to [tunepad.com](https://tunepad.com) and create a new project called **Chords**
* Add a **Keys** cell to your project
* Pick four of the chords from the previous page that you think sound good together. 
* For example, here’s three different ways to plays the chords: <br><big>➊ ➎ ➏ ➍</big>

### Slow and Steady
```python
playNote([ 48, 52, 55 ], beats = 4)
playNote([ 55, 59, 62 ], beats = 4)
playNote([ 57, 60, 64 ], beats = 4)
playNote([ 53, 57, 60 ], beats = 4)
```
### Rhythmic
```python
for i in range(4):
    playNote([ 48, 52, 55 ], beats = 0.5)

for i in range(4):
    playNote([ 55, 59, 62 ], beats = 0.5)

for i in range(4):
    playNote([ 57, 60, 64 ], beats = 0.5)

for i in range(4):
    playNote([ 53, 57, 60 ], beats = 4)
```

### Arpeggiated
```python
for note in [ 48, 52, 55, 52 ]:
    playNote(note, beats = 0.5)

for note in [ 55, 59, 62, 59 ]:
    playNote(note, beats = 0.5)

for note in [ 57, 60, 64, 60 ]:
    playNote(note, beats = 0.5)

for note in [ 53, 57, 60, 57 ]:
    playNote(note, beats = 0.5)
```

Try playing it with different instruments and tempos to get a sound that you like.
When you play chords in a fixed order it’s called a **chord progression**.


<iframe width="560" height="315" src="https://www.youtube.com/embed/HTYrkOZ5nCs?si=5MSobitSM28Zxe4n" title="YouTube video player" class="noprint" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>