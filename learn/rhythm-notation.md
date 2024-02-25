---
layout: layouts/activity.njk
title: "Rhythm Notation"
subtitle:  A review of Western rhythm notation
description: A review of Western rhythm notation and how it relates to Python code
level: Beginner
time: 20 minutes
license: by-nc-sa
splash: /images/rhythm-tempo-splash.jpg
showtoc: true
tags: music
date: 2024-01-04
---
This section will review a standard musical notation system that has roots in European musical traditions. 
This system is versatile and has been refined and adapted over a long period of time across many countries 
and continents to work with an increasingly diverse range of instruments and musical genres. 
We’re starting with percussive rhythmic note values, and we’ll move on to working with pitched instruments in 
the next section.

<a href="/images/Figure2.5.png">
<img src="/images/Figure2.5.png" alt="Common note symbols" style="min-width: 100%; margin: 2em auto"></a>

# Note Notation
This figure shows the most common symbols used in rhythmic music notation. 
Notes are represented with oval-shaped dots that are either open or closed. 
All notes, except for the whole note (top), have tails attached to them that can point either up or down. 
It doesn’t matter which direction (up or down) the tail points. 
Notes that are faster than a quarter note also have horizontal flags or beams connected to the tails. 
Each additional flag or beam indicates that the note is twice as fast. 

| Symbol | Name | Beats | TunePad Code |
| ------ | ---- | :---: | ------------ |
| ![Whole](/images/music/whole.svg) | Whole Note | 4 | `playNote(1, beats = 4)` |
| ![Half](/images/music/half.svg)| Half Note | 2 | `playNote(1, beats = 2)` |
| ![Quarter](/images/music/quarter.svg) | Quarter Note | 1 | `playNote(1, beats = 1)` |
| ![Eighth](/images/music/eighth.svg) | Eighth Note | 0.5 | `playNote(1, beats = 0.5)` |
| ![Sixteenth](/images/music/sixteenth.svg) | Sixteenth Note | 0.25 | `playNote(1, beats = 0.25)` |
| ![Dotted Half](/images/music/dotted-half.svg) | Dotted Half Note | 3 | `playNote(1, beats = 3)` |
| ![Dotted Quarter](/images/music/dotted-quarter.svg) | Dotted Quarter Note | 1.5 | `playNote(1, beats = 1.5)` |
| ![Dotted Eighth](/images/music/dotted-eighth.svg) | Dotted Eighth Note | 0.75 | `playNote(1, beats = 0.75)` |

Standard notation also includes dotted notes, where a small dot follows the note symbol. With a dotted note, you take the original note's duration and add half of its value to it. So, a dotted quarter note is 1.5 beats long, a dotted half note is 3 beats long, and so on.

# Rest Notation
There are also symbols representing different durations of silence or “rests”.

| Symbol | Name | Beats | TunePad Code |
| ------ | ---- | :---: | ------------ |
| ![Whole Rest](/images/music/whole-rest.svg) | Whole Rest | 4 | `rest(beats = 4)` |
| ![Half Rest](/images/music/half-rest.svg) | Half Rest | 2 | `rest(beats = 2)` |
| ![Quarter Rest](/images/music/quarter-rest.svg) | Quarter Rest | 1 | `rest(beats = 1)` |
| ![Eighth Rest](/images/music/eighth-rest.svg) | Eighth Rest | 0.5 | `rest(beats = 0.5)` |
| ![Sixteenth Rest](/images/music/sixteenth-rest.svg) | Sixteenth Rest | 0.25 | `rest(beats = 0.25)` |


# Time Signatures 
In standard notation, notes are grouped into segments called measures (or bars). 
Each measure contains a fixed number of beats, and the duration of all the notes 
in a measure should add up to that amount. The relationship between measures and 
beats is represented by a fraction called a **time signature**. The top number tells you
the number of beats in the measure, and the bottom number tells you the beat duration. 

| Symbol | Name |  Alternative |
| ------ | ---- | --- |
| ![Four-Four Time](/images/music/four-four.svg) | **Four-Four Time or “Common Time”** <br> There are 4 beats in each measure, and each beat is a quarter note. <br> This time signature is sometimes indicated using a special C symbol | ![Common Time](/images/music/common-time.svg) |
| ![Two-Two Time](/images/music/two-two.svg) | **Two-Two Time or "Cut Time”** <br> There are 2 beats in each measure, and the beat value is a half note. <br> Cut time is sometimes indicated with a ‘C’ with a line through it. | ![Cut Time](/images/music/cut-time.svg) |
| ![Two-Four Time](/images/music/two-four.svg) | **Two-Four Time** <br> There are 2 beats in each measure, and the quarter note gets the beat. | |
| ![Three-Four Time](/images/music/three-four.svg) | **Three-Four Time** <br> There are 3 beats in each measure, and the quarter note gets the beat. | |
| ![Three-Eight Time](/images/music/three-eight.svg) | **Three-Eight Time** <br> There are 3 beats in each measure, and the eighth note gets the beat. | |

The most "common" time signature is 4/4. It’s often denoted by a C symbol shown in the table above to stand for Common time.  In common time, there are four beats to each measure, and the quarter note “gets the beat” meaning that 1 beat is the same as 1 quarter note.

Vertical lines separate the measures in standard notation. In the example below, there are two measures in 4/4 time (four beats in each measure, and each beat is a quarter note). 

![Four-four time example](/images/music/Music2.1.png)

If you have a time signature of 3/4, then there are three beats per measure, and each beat's duration is a quarter note. Some examples of songs in 3/4 time are "My Favorite Things" from The Sound of Music, "My 1st Song" by Jay  Z, "Manic Depression" by Jimi Hendrix, and "Kiss From a Rose" by Seal.

![Three-four time example](/images/music/Music2.2.png)
 
If those notes were eighth notes, it would look  like this:

![Three-four time example with eighth notes](/images/music/Music2.3.png)

Other common time signatures include 2/4 time (with two quarter note beats per measure) and 2/2 time (with two half note beats in each measure). With 2/2 there are actually four quarter notes in each measure because one half note has the same duration as two quarter notes. For this reason, 2/2 time is performed similarly to common time, but is generally faster. It is referred to as cut time and is denoted by a C symbol with a line through it (see table above). 
