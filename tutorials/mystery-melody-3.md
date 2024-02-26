---
layout: layouts/activity.njk
tags: puzzles
category: Puzzler
title: Dark Side Mystery Melody
description: See if you can fix all of the syntax errors to reveal the mystery melody!
level: Intermediate
time: 15 minutes
license: by-nc-sa
splash: /images/splash/mm3-splash.png
project: https://tunepad.com/project/29253
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
<img src="/images/splash/mm3-splash.png" alt="" width="300px" style="margin: 2rem 1rem"></a>

# Help! How do I fix syntax errors?
Here's a quick example of a common syntax error in a TunePad project.  
This one’s tricky because the problem is actually on line 1 even though the syntax error says line 2.  
The actual problem is a missing right parenthesis on line 1.

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
