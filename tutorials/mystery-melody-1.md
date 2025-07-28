---
layout: layouts/activity.njk
tags: [ 'puzzles', 'learn' ]
category: Puzzler
title: Underwater Mystery Melody
description: See if you can fix all of the syntax errors to reveal the mystery melody!
level: Beginner
time: 15 minutes
license: by-nc-sa
splash: /images/splash/mm1-splash.png
project: https://tunepad.com/project/29138
---
# Mystery Melody 
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody.  

# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error.
That means Python can't understand what you typed.


<tunepad-project name="Mystery Melody 1" tempo="120" voices="/sounds/voices2">
<tunepad-cell-list>

# How do I fix syntax errors?
Here's a quick example where Python is confused because we wrote `playnote` (with a lowercase “n”) instead of `playNote` (with an uppercase “N”). Try changing the code on line 5 and then pressing the PLAY button to hear how it sounds. 

<tunepad-cell patch="808-drums" name="Bass Drums" uuid="bass-drums" timeline="hidden" theme="light" class="tutorial" show-instrument="false">
/# play four kick drum sounds
/playNote(1)
/playNote(1)
/playNote([1, 5])
/playnote(1)
/
/
</tunepad-cell>

This code has a syntax error on line 4 where there's a missing comma between the number 4 and the word `beats`. 
Try adding a comma and playing this cell with the first one.

<tunepad-cell patch="808-drums" name="Offbeat Hats" uuid="hats" timeline="hidden" theme="light" class="tutorial" show-instrument="false">
/# play four hi-hat sounds using a loop
/for i in range(4):
/    rest(0.5)
/    playNote(4 beats = 0.5)
/
/
</tunepad-cell>

This code has **lots** of problems! Use the red error marker to find and fix all of the syntax errors to reveal the hidden mystery melody.
Press PLAY when you're done.

<tunepad-cell patch="marimba" name='Melody' uuid='melody' instrument="piano" timeline="hidden" theme="light" class="tutorial" autocompile="true" show-instrument="false">
/# there's something wrong with my code :( :(
/playNote(50)
/playNote(52)
/for i in range(3):
/    playNote(55, beats = 0.25)
/    rest(0.25)
/
/for i in range(2):
/    playNote(55, beats = 0.25)
/
/rest(0.25)
/
/
/for i in range(2):
/    playnote(55, beats = 0.25)
/rest(0.25)
/    
/playNote(50, beats = 0.5)
/playNote(52 beats = 0.5)
/for i in range(3):
/    playNote(55, bats = 0.25)
/    rest(0.25)
/
/for i in range(2):
/    playNote(55 beats = 0.25)
/
/rest(0.25
/
/for i in range(2):
/    playNote(55, beats = 0.25)
/rest(0.25)
/
/
/playVote(50, beats = 0.5)
/playnote(52, beats = 0.5)
/
/for i in range(3):
/    playTheGOAT!!(55, beats = 0.25)
/    rest(0.25)
/
/for i in range(2):
/    playNote(55, beats = 0.25)
/    
/rest(0.25)
/
/for i in range(2):
/    playNote(55, beats = 0.25)
/    
/rest(0.25)
/playNote(55, beats = 0.5)
/playNote(55, beats = 0.5)
/play_note(54)
/
</tunepad-cell>
</tunepad-cell-list>

</tunepad-project>


