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
## Objectives
* See example syntax errors in Python
* Practice fixing errors

## Materials
* Chromebook, iPad, laptop, or desktop computer
* Headphones (recommended)
* Printout (optional)

# Syntax Errors
* When you make a mistake writing code, you might get a syntax error. 
* A syntax error means that Python can't understand what you typed.
* Error messages can be confusing, but they give you hints about how to fix mistakes. 
* A syntax error usually includes a line number showing where the problem is.

# Mystery Melody!
Ready to practice fixing syntax errors?  
See if you can fix all of the syntax errors in this project to reveal the mystery melody.  
[{{ project }}]({{project}})

<a href="{{ project }}" target="_blank">
<img src="/images/mystery-melody-1.png" alt="Image of a cartoon shark" width="300px" style="margin: 0"></a>

# Help! How do I fix syntax errors?
Here's a quick example of a common syntax error in a TunePad project.  
In this example, Python is confused because we wrote `playnote` (with a lowercase “n”) instead of `playNote` (with an uppercase “N”) 
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
