---
date: 2024-01-04
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: Syntax Errors and Mystery Melody
description: See if you can fix all of the syntax errors to reveal the mystery melody!
level: Beginner
time: 20 minutes
license: by-nc-sa
splash: /images/splash/mm1-splash.png
project: https://tunepad.com/project/29138
prevURL: /curriculum/activities/livecode-house
prevTitle: Chicago House Beat
nextURL: /curriculum/activities/livecode-hiphop
nextTitle: Loopy Hip-Hop Beat
---
# What is a syntax error and how do I fix it?
When you make a mistake writing code, you might get a syntax error. That means that Python can't understand what you typed.
These error messages can be confusing, but they also give you hints about how to fix mistakes. Here's a quick example where Python is confused because we wrote `playnote` (with a lowercase “n”) instead of `playNote` (with an uppercase “N”) 
on line number 3.

<tunepad-code id="example">
playNote(4, beats = 1)
playNote(4, beats = 0.5)
playnote(4, beats = 1)
</tunepad-code>

And, here's what the resulting error message looks like.
<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>NameError
    </div>
    <div class="error-description">the name 'playnote' is not defined on line 3.</div>
</div>

To fix this error, pay attention to the line number provided in the error message. 
Remember that Python wants you to type everything **exactly** the same way. Python gets 
confused even by small mistakes.

# Try It
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody.  

<a href="{{ project }}" target="_blank" style="margin: 2rem; font-size: 120%">{{ project }}</a>

Make sure to hit the **REMIX** button so that your changes are saved.

