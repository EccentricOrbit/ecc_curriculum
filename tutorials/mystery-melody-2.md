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
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody. Make sure to hit the **REMIX** button so that your changes are saved.

<a href="{{ project }}" target="_blank" style="margin: 2rem; font-size: 120%">{{ project }}</a>



# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error. That means Python can't understand what you typed.
These error messages can be confusing, but they also give you hints about how to fix mistakes. 
A syntax error usually has a line number showing where the problem is.

# How do I fix syntax errors?
Here's a quick example of a common syntax error in a TunePad project.  

```python
for i range(3):
    playNote(60)
```
And, here's what the resulting error message looks like.
<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>SyntaxError
    </div>
    <div class="error-description">bad input on line 1, column 6.</div>
</div>

* To fix this error, pay attention to the line number provided in the error message. 
* And, remember that Python wants you to type everything **exactly** the same way.  
* Here it's important to pay attention to the exact way to code a loop in Python.

<img src="/images/Figure2.12.png" width="470px" alt="Python for loop syntax diagram">

In this example, we're missing the **`in`** keyword in our for-loop.