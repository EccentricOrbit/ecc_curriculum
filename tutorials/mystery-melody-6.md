---
layout: layouts/activity.njk
tags: puzzles
category: Puzzler
title: Another Mystery Melody
description: Use your understanding of variables, lists, functions, and for-loops to fix all of the syntax errors and reveal the mystery melody!
author: Elizabeth Co, tombraider6456 (https://musescore.com/user/1596896)
level: Expert
time: 30 minutes
license: by-nc-sa
splash: /images/splash/piano-kbd-splash.jpg
project: https://tunepad.com/project/74732
#disclaimer: For educational purposes only. Based on work by Michael Giacchino(2009).
---
# Try It
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody. Make sure to hit the **REMIX** button so that your changes are saved.

<a href="{{ project }}" target="_blank" style="margin: 2rem; font-size: 120%">{{ project }}</a>



# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error. That means Python can't understand what you typed.
These error messages can be confusing, but they also give you hints about how to fix mistakes. 
A syntax error usually has a line number showing where the problem is.

# How do I fix syntax errors?
Here's a quick example of a common syntax error in a TunePad project. This one’s tricky because the problem is actually on line 1 even though the syntax error says line 2. The problem is a missing right parenthesis on line 1.

```python
playNote(60
rest(1)
```

<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>SyntaxError
    </div>
    <div class="error-description">bad input on line 2.<br>rest(1)</div>
</div>
