---
layout: layouts/activity.njk
tags: puzzles
category: Puzzler
title: Suspenseful Mystery Melody
description: See if you can fix all of the syntax errors to reveal the mystery melody!
level: Intermediate
time: 15 minutes
license: by-nc-sa
splash: /images/splash/halloween-splash.jpg
project: https://tunepad.com/project/6241
---
# Try It
See if you can fix all of the **syntax errors** to reveal the mystery melody. 


# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error. That means Python can't understand what you typed.
These error messages can be confusing, but they also give you hints about how to fix mistakes. 
A syntax error usually has a line number showing where the problem is.

# How do I fix syntax errors?
Here's a quick example of a common syntax error in a TunePad project.  

<tunepad-project name="Suspenseful Mystery Melody" tempo="137" time="5/4" key="B minor">
<tunepad-cell-list>
<tunepad-cell patch="grand-piano" name="Harmony" uuid="cell2" timeline="hidden" theme="light" class="tutorial" autocompile="false" show-instrument="false">
/rest(5)
/for i range(0, 2):
/    playNote(30, beats = 5)
/    playNote([30, 33], beats = 5)
/    playNote([28, 34], beats = 10)
</tunepad-cell>

* To fix this error, pay attention to the line number provided in the error message. 
* Remember that Python wants you to type everything **exactly** the same way.  
* In this example, we're missing the **`in`** keyword in our for-loop on line 2.

<img src="/images/Figure2.12.png" width="470px" alt="Python for loop syntax diagram">

# Ready?
Ready to take a *stab* at fixing this scary code?

<tunepad-cell patch="grand-piano" name="Melody" uuid="cell1" timeline="hidden" theme="light" class="tutorial" autocompile="true" show-instrument="false">
/C6 = 84
/
/# repeated pattern played from a base note: b
/def pattern(b):
/    notes = [ b, b-7, b-7, b, b-7, b-7, b, b-7, b+1, b-7 ]
/    for note in notes:
/        v = 120
/        if note < b: v = 70   # play some of the notes softer
/        playNote(note, beats = 0.5, velocity = v)
/
/for i range(3):
/    pattern(C6 + 1)
/    
/for i in rage(2):
/    pattern(C6)
/    
/for i in (2):
/    pattern(C6 + 1)
/
/for i in range(2)
/    pattern(C6)
</tunepad-cell>

</tunepad-cell-list>
</tunepad-project>
