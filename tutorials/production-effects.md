---
layout: layouts/activity.njk
tags: learn
category: Tutorial
title: Advanced Production Effects
description: Try some of these production effects to take your music to the next level
level: Advanced
time: 45 minutes
license: by-nc-sa
splash: /images/splash/production-effects-splash.jpg
---
# Introduction
This tutorial covers a variety of production effects that can add sophistication and depth to your sound. All of the effects are variations on the same theme — instead of playing one note, we’ll play a series of notes, each offset slightly in time or pitch. To create these effects, we’ll define some of our own functions that make use of TunePad’s `rewind` and `fastForward` features. This will also give us a good chance to review loops, variables, and parameters.

# Out-of-Tune Piano Effect
In this example we create an out of tune piano effect. The effect is achieved by playing several notes at the same time, each randomly detuned from the central note. The space between separate notes on a 12-tone chromatic scale can be subdivided into even units called cents — just imagine 100 individual smaller notes between each adjacent key on the piano keyboard. On an instrument like a violin or trombone, you can play notes that are slightly out of tune or that glide between one note and another. We can do something similar in TunePad by using decimal numbers instead of integer values when we call the playNote function:
```python
playNote(36.5)   # plays an out-of-tune C
```
For this line of code, a value of 36.5 sits exactly halfway between a C (MIDI value 36) and a C# (MIDI value 37). In other words, it’s a pure C detuned by 50 cents.
<img src="/images/Figure8.1.png" width="80%" style="margin: 2rem;" alt="Space between a C and C# note">

There are plenty of artistic reasons to create sounds that are out of tune—like if we wanted to create an eerie melody for a horror movie. To get this kind of effect, we could just randomly detune some of the notes in our melody by small amounts, and we’d get something that sounded off key. But a more interesting approach that gives us additional texture (and eerie dissonant overtones) would be to play several notes at the same time, each slightly detuned from one another. This actually approximates what a real out of tune piano sounds like. Notes on a piano are produced when a hammer mechanism inside the instrument hits multiple individual strings at the same time (3 strings for most notes). When those individual strings are off from one another, you hear an entirely different sound than you would get from just one string being out of tune. Honky tonk pianos are intentionally tuned so that the three strings for each note are detuned slightly from one another to get warped harmonics. Here’s a simple Python function that approximates that dissonant sound in TunePad.
```python
song = [
    (48, 1, "Ring"), (48, 0.5, "a-"), (45, 1, "round"), (50, 0.5, "the"),
    (48, 1.5, "ro-"), (45, 1, "sie,"), (47, 0.5, "a"), (48, 1, "pock-"),
    (48, 0.5, "et"), (45, 1, "full"), (50, 0.5, "of"), (48, 1.5, "po-"),
    (45, 1.5, "sies!"), (48, 1.5, "Ash-"), (45, 1.5, "es!"), (48, 1.5, "Ash-"),
    (45, 1, "es!"), (45, 0.5, "We"), (48, 1.5, "all"), (48, 1.5, "fall"),
    (41, 2.5, "down.")
]

def eerieNote(note, beats=1, velocity=100):
    volume = velocity / 3.0
    for i in range(3):
        offset = (random() - 0.5)   # random detune amount
        playNote(note + offset, beats, velocity=volume)
        rewind(beats)
    fastForward(beats)


for note in song:
    eerieNote(note[0] - 12, beats=note[1])
```
Let’s walk through this function one line at a time. On line 1, we use the `def` keyword to define our own Python function. 
We’re also defining three parameters for this function called `note`, `beats`, and `velocity`, each of which is listed inside the parentheses. 
We use `note` for the pitch value we want to play; `beats` for the duration of the note; and `velocity` to approximate the overall volume of the sound. 
You might notice that these parameters are exactly the same as the `playNote` function. That’s intentional because it will make it easy to swap out the `playNote` function for our new `eerieNot`e function in other parts of our project. 
One other thing to notice here is that `beats` and `velocit`y are examples of what’s called an optional parameter. 
That means we’ve defined a default value that Python will use if we don’t otherwise specify something.
The default value for `beats` is 1, and the default value for `velocity` is 100. 
 
On line 2 we define a variable called `volume` that will help us adjust the loudness of our individual notes. 

We’re doing this because playing all the notes at full volume would end up being much louder than the sound of a single note. We set its value to the `velocity` parameter divided by 3.0 because we’re going to end up playing three notes instead of one, so we want each individual note to make up about a third of the overall volume.

On line 3, we set up our for-loop to play three notes. You can also experiment with loops that repeat different numbers of times. Remember that `range` is just a Python function that generates a sequence of numbers [ 0, 1, 2 ] that the variable `i` will walk through, one number at a time.

On line 4, we use Python’s `random` function to generate a random decimal number somewhere between zero and one. Subtracting 0.5 will then give us a number in the range of negative 0.5 to positive 0.5. We’ll save the result in a variable called offset that we’ll use on the next line of the code to shift our note’s pitch. 

Line 5 then plays the note with our random pitch offset added in (between -0.5 and 0.5) to make it sound out of tune. Notice that we use our beats and volume variables to control the duration and volume of the note that gets played, just as we might if we were calling `playNote`.

The last two lines of the function make it so that all of the notes get played at the same time. On line 6, we’re going to use a TunePad command called `rewind` to move the playhead back to where we were before we played the note. Remember that `playNote` automatically advances the playhead forward by the given number of beats, so we need to rewind to get us back where we started. The effect of calling `rewind` is instantaneous; all it does is reposition the playhead.

Calling rewind is important because we want all three notes to play at exactly the same time to give us the right effect. We finish the function outside of the loop with line 7 that calls another TunePad command called `fastForward`.

As you might guess, this does the opposite of rewind—instead of moving the playhead backwards it moves it forward. We call this last `fastForward` to make `eerieNote` behave exactly as if we had played a single note using our standard `playNote` function. The playhead will get left exactly at the end of one note. This combination of using `rewind` inside of a loop with a `fastForward` at the end of the loop will be the standard template for all of the remaining effects.

You can try this example online by going to [https://tunepad.com/examples/out-of-tune](https://tunepad.com/examples/out-of-tune).

# Phaser Effect
If you play the song in the previous example, you might hear some interesting and unexpected effects, especially on the lower notes that come about from playing several notes together with very similar pitches. It turns out that this approximates a common musical effect called a phaser or phase shifters. Real phaser effects are produced by playing multiple versions of the same sound together at the same time, but changing the frequency profile of each individual sound to get gaps or dips in the spectrum.

A very simple variation of the `eerieNote` function replaces the use of the `random` function and instead just increments the pitch offset variable by a fixed amount. This change gives us a cool approximation of a phaser effect that’s easy to manipulate by changing the number of simultaneous notes that get played or by changing the pitch offset. Try this effect with some of the built-in TunePad instruments.
```python
 def phaserNote(note, beats = 1, velocity = 100):
    note_count = 5
    volume = velocity / note_count
    offset = 0.0
    for i in range(0, note_count):
        playNote(note + offset, beats = beats, velocity = volume)
        offset += 0.15
        rewind(beats)
    fastForward(beats)
```

You can try this example online by going to [https://tunepad.com/examples/phaser](https://tunepad.com/examples/phaser).

# Echo Effect
For the next set of examples, we’re going to move from pitch-based effects to time-based effects where we spread multiple notes out over time. The simplest version of this is an echo effect that plays an initial sound at full volume followed by a rapid succession of softer notes that fall off into silence. This is an extremely common technique used in a wide variety of digitally produced music. We can also throw in pitch manipulations and reverb effects to add another layer of complexity, but let’s start with the foundational repeated sound. As before, we’re going to define our own function that looks similar to the basic `playNote` function. You can follow along in TunePad by visiting [https://tunepad.com/examples/echo](https://tunepad.com/examples/echo)
```python
def echoNote(note, beats = 1, delay = 0.125):
    volume = 100         # start at full volume
    offset = 0           # keep track of the delays
    while volume > 1:    # loop until silence
        playNote(note, beats = beats, velocity = volume)
        rewind(beats - delay)
        volume *= 0.5    # reduce volume by 50%
        offset += delay  # keep track of the delays
    rewind(offset)       # rewind by the accumulated delay amount
    fastForward(beats)   # move the playhead to the end of the note
```
Line 1 looks similar to the previous two examples except that we’ve added another optional parameter called `delay` that specifies how spread out each echoed note is in time. By default we’ve set this to 0.125 beats, but by making this an optional parameter, we’ve given the composer the ability to change this delay time on the fly if they want to.

Line 2 should also look familiar except this time we’re going to start with the first note at full volume and then rapidly decay the volume for each successive note. Then on line 3, we define a variable called `offset` that keeps track of the total amount of delay accumulated so far. This is a book-keeping variable that’s important for us to leave the playhead in the correct location after our function completes. We’ll use this on line 9.

On line 4, we set up a new kind of Python loop called a `while` loop. Until now, we’ve always used for loops to iterate through a list or repeat something for a fixed number of times. With a `while` loop on the other hand, you’ll repeat something over and over again until a certain condition is met—in this case the loop will repeat until the volume is less than or equal to 1.

The basic idea is to repeat the sound until it’s too quiet to hear. The trick to making this work is to decrease the value of volume inside the while loop. Otherwise the loop would keep repeating over and over again forever (an infinite loop). We do this on line 7 where we multiply volume by 0.5 (50% of its previous value). We could try other values here or even make this a parameter of the function instead of a hard-coded value. If you want something to echo out longer, you could set this up to 0.6 or even 0.7. Again, be careful here because if this value is 1.0 or higher the note will echo forever and TunePad will complain that you’ve created an infinite loop! Higher values can also cause the note to echo out too long and run into other notes, creating unwanted interference.

Line 6 is a little tricky. Instead of rewinding all the way back to the beginning of the note as we did in the previous example, we’re going to rewind by a smaller amount so that successive notes are spread out in time.

This amount is equal to the `delay` parameter that gets passed into the function. The diagram below shows what this looks like over 4 iterations of the while loop. You can also see the value of the volume as it decreases on each successive pass.

<img src="/images/echo-effect.png" width="80%" style="margin: 2rem;" alt="Movement of the playhead for the echo effect">

The last two lines of the function are responsible for fixing up the playhead position so that it’s exactly at the end of the first note we played, which is why we kept track of the number of the total accumulated delay. 

# Chorus Effect
A closely related effect to echo is to randomly scatter notes around a central point in time. Our strategy for this effect should look familiar by now. The only tricky part is that we have to generate a random time offset plus or minus a 32nd note that we use to fast forward. Because this number can be positive, negative, or zero, the playhead will move forward, backward, or stay in place when we call `fastForward`. Another way to think of it is that `fastForward` with a negative number is the same thing as calling `rewind` with a positive number. This function takes an optional parameter called count that says how many scattered notes we should play.
```python
def chorusNote(note, beats = 1, count = 4):
    volume = 40
    spread = 0.125
    for i in range(0, count):
        offset = (random() - 0.5) * spread
        fastForward(offset)
        playNote(note, beats - offset, volume)
        rewind(beats)
    fastForward(beats)
```
Then, when we rewind on line 8, we’re going to back up to where we started. Together this has the effect of scattering several notes randomly around the time the note was to be played. You can also try making the spread an additional optional parameter that you pass into the function. Here’s a simple stomp / clap pattern that uses `chorusNote`:
```python
stomp = [ 0, 1 ]
clap = 22
chorusNote(stomp)
chorusNote(stomp)
chorusNote(clap)
rest(1)
```
This is a great effect to combine with a reverb effect to make it sound like you have a crowd in a large room. Another common technique is to detune the pitch of each note slightly from one another, which was a common technique for chorus effects applied to electric guitars in the 1980s. You can try this function by going to [https://tunepad.com/examples/chorus](https://tunepad.com/examples/chorus)

# ARP Effect
Another extremely common effect called **arpeggiation** is used to transform single sustained notes into rhythmic patterns that rapidly climb up and down a chord structure. Arpeggios are commonly used across a wide variety of musical genres from classical to hip hop to dance music, and most digital audio workstations provide built-in arpeggiators with a variety of options to change the speed, direction, and note pattern. Following the pattern we saw with previous functions, we can build an arpeggiator with TunePad by creating an `ARPNote` function with parameters for the note pattern and speed. This effect combines both pitch-based and timing-based variations of notes.
```python
def ARPNote(note, beats = 1, pattern = [0,4,7], speed = 0.125):
    offset = 0
    while offset < beats:
        for step in pattern:
            playNote(note + step, speed)
            offset += speed
    rewind(offset)
    fastForward(beats)
```
Before we put this together in a complete example, let’s look at the pattern parameter. This parameter is a list that describes a pitch offset from the first note (given by the note parameter). The function will step through this list, and each element will be added to note to calculate which note to play. The pattern parameter can be as simple or complex as you want, but here are some common arpeggiation patterns:
* **Major Triad**			[ 0, 4, 7 ]
* **Minor Triad**			[ 0, 3, 7 ]
* **Major Triad Up/Down**	[ 0, 4, 7, 12, 7, 4 ]
* **Minor Triad Up/Down**	[ 0, 3, 7, 12, 7, 3 ]

This function is a great example of using nested loops in Python, which just means that one loop is embedded inside of another. The outside loop gets set up on line 3 and repeats until the variable offset is greater than the duration of the note. The inner loop is set up on line 4 and steps through each value in the pattern parameter. What all this means is that the inner for-loop will get run at least once and possibly many times—as long as it takes to completely fill the duration of the note provided by the `beats` parameter.  Line 5 plays the notes in the arpeggio by adding step to the base note such that it moves up or down the pattern, and we set the duration of the note to speed. Then on line 6, we increment the offset bookkeeping variable by the duration of an arpeggiation step. The last two lines of the function clean up the timing to make sure the playhead advances by the correct amount. 
The `speed` parameter is a matter of taste and musical convention, but it’s common to use 16th notes (0.25 beats) or 32nd notes (0.125 beats) for this value. One thing you might notice is that this function will repeat the arpeggiation chord pattern for as long as it takes to fill out the entire note duration, but it might also play out beyond the end of the note. This extra holdover could be undesirable depending on the music we’re trying to make. To fix this, we can insert one additional line right after line 6 inside the for-loop. 

This would have the effect of exiting out of the loop as soon as we hit the desired length, possibly short circuiting the ARP pattern. Before we look at an example of the `ARPNote` function in action, let’s add one more feature. It sounds a little heavy to have every note of the arpeggio hit with the same velocity. To add a more interesting rhythm and texture, we could instead emphasize the first note of the arpeggio and then drop the volume down for the remaining notes. Here’s a variation of the `ARPNote` function that creates this effect with something like the technique we used in the `echoNote` example.
```python
def ARPNote(note, beats = 1, velocity = 100, pattern = [0,4,7], speed = 0.125):
    offset = 0
    while offset < beats:
        volume = velocity               # reset volume every iteration 
        for step in pattern:
            playNote(note + step, speed, volume)
            volume = velocity * 0.25   # reduce volume after first note
            offset += speed
            if offset >= beats: break
    rewind(offset)
    fastForward(beats)
```
What’s happening is that we create a `volume` variable that gets reset every iteration of the while loop to the full value of the `velocity` parameter. Then, after we play the first note of the arpeggio inside the for loop, we reduce the `volume` to a quarter of the velocity for the remaining notes in the arpeggio. When the arpeggio is finished, `volume` will be restored to its original value for the next arpeggio.

This project puts everything together with an example from The Police. Try this code at code at [https://tunepad.com/examples/arp](https://tunepad.com/examples/arp).

# Envelope and Multi-Effect Demo
Here's a [project](https://tunepad.com/project/15572) that combines multiple effects including echo, pan, gain, and filter effects.
```python
## Lets you control the decay of the kick drum with the length parameter.
def customkick(amplitude,length):
    with gain(value = [amplitude,0], beats = length):
        playNote(0, beats = length)

## Lets you play a note that delays out with an upward filter sweep
## and a stereo bounce.
##
## note - what note to play.
## offset - where to play the first hit
## feedback - number of echos
## delay - time between echos
## maxlength - length of your song/pattern for delay wrapping.
​
def echofilterpan(note, offset, feedback, delay, maxlength, velocity = 126):
    moveTo(offset % maxlength)
    playNote(note, beats = 0.25, velocity = int(velocity))

    for i in range(1, 2 * (feedback + 1)):
        moveTo((offset + i * delay) % maxlength)
        if i % 2 == 0:
            panv = 0.5
        else:
            panv = -0.5
        with pan(value = panv):
            with highpass(frequency = 800 + i * 2400 / (2 * (feedback + 1)), Q = 25):
                v1 = ceil(velocity / (pow(2,i))) 
                playNote(note, beats = 0.25, velocity = int(v1))

def kicks(o):
    moveTo(o)    
    customkick(1, 0.75)
    customkick(0.5, 0.25)
    moveTo(o + 1.75)
    customkick(0.5, 0.25)
    moveTo(o + 2.5)
    customkick(1, 0.5)
    moveTo(o + 3.25)
    customkick(0.5, 0.25)

def hats(o):
    moveTo(o)
    for i in range (0,8):
        playNote(4, beats = 0.25, velocity = 64)
        playNote(4, beats = 0.25, velocity = 8)

def snares(o):
    moveTo(o + 1)
    playNote(2)
    moveTo(o + 3)
    playNote(2)
    moveTo(o + 5)
    playNote(2)
    moveTo(o + 7)
    echofilterpan(2, 7, 8, 0.25, 8)    

kicks(0)
hats(0)
snares(0)
kicks(4)
hats(4)
```
