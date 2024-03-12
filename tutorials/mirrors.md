---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: "Mirrors"
description: Learn about loops in Python and TunePad's rewind/gain functions through recreating Mirrors by Justin Timberlake!
level: Intermediate
time: 20-30 minutes
license: by-nc-sa
splash: /images/splash/mirrors-splash.png  
video: 
slides: 
project: https://tunepad.com/project/76857
audio: https://api.tunepad.com/api/projects/76857/audio/
disclaimer: For educational purposes only. Based on "Justin Timberlake Reveals ‘Mirrors’ Is About Jessica Biel" by Andrew Gruttadaro (2013), RCA.
---

# Step 1: Create a new Project
Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). Name your project “Mirrors”.

# Step 2: Melody
We’ll start with the main melody. This is usually the catchiest part of a song! 
First you should create a new Bass cell in TunePad, select `Electric Bass`, and use this code:
```python
for i in range(4):  
    playNote(51,1.5);
    playNote(58,1.5);
    playNote(51,0.5);
    playNote(50,0.5);
    playNote(46,1.5);
    playNote(58,1.5);
    playNote(50,0.5);
    playNote(46,0.5);
    playNote(44,1.5); 
    if i == 3:
        with gain([1,0],6): 
            playNote(56,1.5);
            playNote(55,5);
    else:
        playNote(56,1.5);
        playNote(55,5);
        
with gain(0.0):
    playNote(1,64); 
```
Sounds cool right? Notice that we have few unique concepts: 2 tools for coding and 1 tool for music. First, We know that songs often repeat their melodies, so creating a `for-loop` is a great idea for us to save time and space in our code. Notice the syntax "for i in range(4)". This tells us that every time that the loop repeats, it will add 1 to i up until (not including!) 4 starting from 0.

A song with the same melody isn't as exciting to listen to, is it? This is why we use `if-else statements` to create conditions that usually run new parts of code depending on if our condition is either true or false. Remember how for-loops count? This is important to understand how we access our if condition above. Counting up from 0, on the _3rd_ loop, is when i is equal to 3 and we finally enter our new case! 
 

# Step 3: Supporting Chord
Though the melody sounds nice alone, we can create a fuller sound by giving the melody some support. Create a Piano cell, and try out this code:
```python
for i in range(2):
    playNote(51,3);
    playNote(50,0.5);
    playNote(48,0.5);
    playNote(46,3);
    playNote(46,0.5);
    playNote(48,0.5);
    playNote(44,8);
    rewind(2);
    
    playNote(44,0.5);
    playNote(46,0.5);
    playNote(48,0.5);
    playNote(50,0.5);
    
playNote(51,3);
playNote(50,0.5);
playNote(48,0.5);
with gain([1,1.25],7.5): 
    playNote(46,3);
    playNote(46,0.5);
    playNote(48,0.5);
    playNote(53,3);
    playNote(51,0.5);
with gain([1.5,1.25],21):
    playNote(50,0.5);
    playNote(48,3);


    playNote(46,0.5);
    playNote(48,0.5);
    playNote(50,0.5);
    playNote(51,3);
    playNote(50,0.5);
    playNote(48,0.5);
    playNote(46,3);
    playNote(46,0.5);
    playNote(48,0.5);
    playNote(44,7);

with gain(0.0):
    playNote(1,65);
```

Good job! Let's add the finishing touch of the piece, which is the bass line. The supporting bass line is very important in music. The lower sounds help the song feel like it's flowing, and gives the melody a more complete sound. Create a new Bass cell, select `Synth Pop Bass`, and try:

```python
for i in range(3):
    playNote(55,4);
    playNote(53,4);
    if i == 2:
        with gain([0.7,0.5],8):
            playNote(56,8);
    else:
        playNote(56,8);

playNote(55,4);
playNote(53,2.5);
playNote(51,0.5);
playNote(50,0.5);
playNote(48,8);

with gain(0.0):
    playNote(1,64.5);

```
This leads us to run a new function called `gain`. You can think of gain as a volume button. Most of the time, different instruments need to play at different volumes for sounds to blend well. Though the melody is usually the loudest, this sometimes changes, and we can do this with our new function. The gain function can take 2 to 3 inputs with the parameters: 'value' that controls how much you want the volume to change (ex. 1.5 makes the volme 50% louder, and 0.5 makes the sound 50% quieter), 'beats' which tells us how many beats our gain effect should last for, and third is 'start' that tells us in how many beats do we want to start the effect (this is optional, the gain will start immediately without it). There is also a cool feature with  gain's 'value' parameter where instead of putting a single number to change sound immedately, you can create a range for the volume to gradually shift to over time!

# Bonus: Cool Trick!
Fantastic job! A fun fact about gain is that you can use the 'value' parameter mentioned above to create cool fade-ins and fade-outs in your music pieces! This helps to bring out some parts more than others. Try to revisit the code above and see if you can hear the changes in volume, and also try to follow the cells and see if you can predict which lines will play based on our for-loops and if-else statements!

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
