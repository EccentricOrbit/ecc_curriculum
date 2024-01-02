---
layout: layouts/base.njk
title: "Rhythm and Tempo"
subtitle:  Beat, tempo and the foundations of rhythm
description: Learn about beat, tempo and the foundations of rhythm
level: Beginner
time: 20 minutes
license: by-nc-sa
splash: /images/rhythm-tempo-splash.jpg
showtoc: true
---
# Beat and Tempo
The **beat** is the foundation of rhythm in music. In TunePad, the beat is the unit of time that determines how long individual notes are played.

**Tempo** refers to the speed at which the rhythm moves in a piece of music. 
The standard way to measure tempo is in **beats per minute** (BPM or bpm), meaning the total number of beats 
played in one minute’s time.
So, at a tempo of 60 bpm, your foot taps 60 times each minute (or one beat per second). 
At 120 bpm, you get two beats every second, and, at 90 bpm, you get 1.5 beats every second.

Different genres of music have their own typical tempo ranges (although every song and every artist is different). 
For example, hip-hop usually falls in the 60 - 110 bpm range, while rock is faster in the 100-140 bpm range. 
House/techno/trance is faster still, with tempos between 120-140 bpm.

| Genre    | Tempo Range (BPM) |
| -------- | :---------------: |
| Rock     | 100 - 140 bpm     |
| Pop      | 100 - 132 bpm     |
| Reggae   | 60 - 92 bpm       |
| Hip-hop  | 60 - 110 bpm      |
| Dubstep  | 130 - 144 bpm     |
| Techno   | 120 - 140 bpm     |
| Salsa	   | 140 - 250 bpm     |
| Bachata  | 120 - 140 bpm     |
| Footwork | 150 - 165 bpm     |

Computers excel at keeping a perfectly steady tempo. This is great if you want precision, but there’s also a risk that the resulting music will sound too rigid and machine-like. When real people play music they often speed up or slow down, either for dramatic effect or just as a result of being a human. Depending on the genre, performers might add slight variations in rhythm called swing or shuffle, that’s a kind of back and forth rocking of the beat that you can feel almost more than you can hear.

# Rhythmic Notations
Over the centuries, musicians and composers have developed many different written systems to record and share music. And, with the invention of digital production software, a number of other interactive representations for mixing and editing have become common as well. To continue our exploration of rhythm, in music, here are four different visual representations of the same rhythmic pattern. The pattern has a total duration of four beats and can be counted as “1 and 2, 3 and four”. The first two notes are ½ beats long followed by a note that is 1 beat long. Then the pattern repeats.

## Representation 1: Standard Western music notation
The first representation (below) shows standard music notation (or Western notation), a system of recording notes that has been developed over many hundreds of years. The two thick vertical lines on the left side of the illustration indicate that this is rhythmic notation, meaning that there is no information about musical pitch, only rhythmic timing. The dots on the long horizontal lines are notes whose shapes indicate the duration of each sound to be played. Sometimes different percussion instruments will have their notes drawn on different lines. 

<img src="/images/Figure2.2.png" alt="Standard Western music notation" width="400" style="margin-bottom: 2em">

Standard rhythm notation has been refined over centuries and is accessible to an enormous, worldwide community of musicians. On the other hand, it can be confusing for people who haven’t yet learned how to read sheet music. The timing of individual notes is communicated using tails and flags attached to the notes, but there’s no consistent mapping between horizontal space and timing.

## Representation 2: Audio Waveforms
The second representation shows a visualization of the actual audio waveform that gets sent to the speakers when you play music. The waveform shows the amplitude (or volume) of the audio signal over time. You can think of it as a graph that shows the literal intensity of the vibration of your speakers over time. 

<img src="/images/Figure2.3.png" alt="Audio waveform notation" style="margin-bottom: 2em">

The audio waveform is good at showing what the sound actually looks like—how long each note rings out (“release”) and how sharp its onset is (“attack”). It’s helpful for music production, mixing, and mastering. On the other hand, waveforms don’t really tell you much about the pitch of a note or its intended timing as recorded by the composer.

## Representation 3: Piano (MIDI) Roll
The third representation shows a piano roll (or MIDI roll). This uses solid lines to show individual notes. The length of the lines represents the length of individual notes, and the vertical position of the lines represents the percussion sound being played (kick drums and snare drums in this case).

<img src="/images/Figure2.4.png" alt="Piano (MIDI) notation" style="margin-bottom: 2em">

This representation is an increasingly common notation system used in music production software. Many tools even allow for drag and drop interaction with the individual notes to compose and edit music. 

## Representation 4: Python Code
A final representation for now shows Python code in TunePad. In this representation, the duration of each note is set using the beats parameter of the playNote function calls.

```python
playNote(2, beats = 0.5)
playNote(2, beats = 0.5)
playNote(6, beats = 1)

playNote(2, beats = 0.5)
playNote(2, beats = 0.5)
playNote(6, beats = 1)
```
The Python code is easier for computers to read than humans—it’s definitely not something you would hand to a musician to sight read. On the other hand, it has the advantage that it can be incorporated into computer algorithms and manipulated and transformed in endless ways.

There are many, many other notation systems designed to transcribe a musical performance—what we hear at a live performance—onto a sheet of paper or a computer screen. Each of these representations was invented for a specific purpose and/or genre of music. You might pick a representation based on the context and whether you’re in the role of a musician (and what kind of instrument you play), a singer, a composer, a sound engineer, or a producer. Music notation systems are as rich and varied as the cultures and musical traditions that invented them. One nice thing about working with software is that it’s easy to switch between multiple representations of music depending on the task we’re trying to accomplish.
