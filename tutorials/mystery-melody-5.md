---
layout: layouts/activity.njk
tags: puzzles
category: Puzzler
title: Taylor Swift Mystery Melody
description: See if you can fix all of the syntax errors to reveal the mystery melody!
level: Beginner
time: 15 minutes
license: by-nc-sa
splash: /images/splash/ts.jpg
project: https://tunepad.com/project/76993
---
# Try It
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody.  

<a href="{{ project }}" target="_blank" style="margin: 2rem; font-size: 120%">{{ project }}</a>

Make sure to hit the **REMIX** button so that your changes are saved.

# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error. That means Python can't understand what you typed.
These error messages can be confusing, but they also give you hints about how to fix mistakes. 
A syntax error usually has a line number showing where the problem is.


# How do I fix syntax errors?
Here's a quick example where Python is confused because we wrote `playnote` (with a lowercase “n”) instead of `playNote` (with an uppercase “N”) 
on line number 3.

```python
playNote(4, beats = 1)
playNote(4, beats = 0.5)
playnote(4, beats = 1)
```
And, here's what the resulting error message looks like.
<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>NameError
    </div>
    <div class="error-description">the name 'playnote' is not defined on line 3.</div>
</div>

To fix this error, pay attention to the line number provided in the error message. 
Remember that Python wants you to type everything **exactly** the same way. 
Even though people understand that `playnote` is supposed to be `playNote`, Python gets 
confused.
