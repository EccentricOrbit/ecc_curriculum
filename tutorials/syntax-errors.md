---
layout: layouts/activity.njk
tags: activity
category: Activity
title: Syntax Errors
description: Practice finding and fixing syntax errors in Python code
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/syntax-errors.png
project: https://tunepad.com/project/29138
slides: https://docs.google.com/document/d/1ZzVfIcuPuu6saR2OuqqjYoUDIINumzLxvzfu2Anf13M/edit?usp=sharing
video: https://drive.google.com/file/d/1QivXTgeTXtIaugVL37UnJ5T3w8kG69kH/view
---
In this tutorial, you'll learn about *syntax errors* in code and how to fix them.
You'll also get to practice fixing syntax errors in a TunePad project to reveal a mystery melody.

### Objectives
* See examples syntax errors in Python
* Practice fixing errors

### Materials
* Chromebook, iPad, laptop, or desktop computer
* Headphones (recommended)
* Printout (optional)

# Syntax Errors
* When you make a mistake writing code, you might get a syntax error. 
* A syntax error means that Python can't understand what you typed.
* Error messages can be confusing, but they give you hints about how to fix mistakes. 
* A syntax error usually includes a line number showing where the problem is. 

# Example 1
In this example, Python is confused because we wrote `playnote` (with a lowercase “n”) instead of `playNote` (with an uppercase “N”) on line number 3.

```python
playNote(4, beats = 1)
playNote(4, beats = 0.5)
playnote(4, beats = 1)
```
<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>NameError
    </div>
    <div class="error-description">the name 'playnote' is not defined on line 3.</div>
</div>

# Example 2
Here’s another syntax error example. This one’s tricky because the problem is actually on line 1 even though the syntax error says line 2. The actual problem is a missing right parenthesis on line 1.

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

# Example 3
This example highlights the importance of paying attention to small details when writing code.

```python
playNote(60 beats = 1)
```

<div class="error-message">
    <div class="error-name">
        <i class="fas fa-exclamation-circle"></i>SyntaxError
    </div>
    <div class="error-description">bad input on line 1, column 12.</div>
</div>

In this example we forgot to include a comma between 60 and `beats = 1`.

# Practice with a Mystery Melody
Time to practice fixing syntax errors.
See if you can fix all of the syntax errors in this project to reveal the mystery melody.
[{{ project }}]({{project}})

<a href="{{ project }}" target="_blank">
<img src="/images/mystery-melody-1.png" alt="Image of a cartoon shark" width="300px"></a>


