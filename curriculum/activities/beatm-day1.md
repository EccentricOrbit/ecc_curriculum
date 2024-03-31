---
layout: layouts/activity.njk
tags: beatmakers
category: Lesson Plan
title: Welcome to TunePad
description: Today you’ll get a first look at Python, a text-based programming language used by professional programmers all over the world. In this unit, you’ll use Python to make music with a website called TunePad.
level: Beginner
time: 45 minutes
license: by-nc-sa
splash: /images/splash/house-splash.png
video: https://drive.google.com/file/d/1J1GXx7AJWE2T-rw1pQvlbn4CFEBZPbYd/view?usp=sharing
audio: https://api.tunepad.com/api/projects/67934/audio/
---
### Learning Objectives
* Learn about the Python programming and its many uses
* Get started with TunePad to make music with Python code


# Welcome!
Welcome to the unit on Python and TunePad. 
We’re going to explore the Python programming language and see how we can use code to make music.


<img src="/images/python-logo.svg" alt="Python logo" style="width: 130px; float: right; position: relative; top: -2rem;">

# What is Python?
* Python is a text-based programming language. 
* Instead of dragging blocks on the screen, we type lines of code for the computer to run.
* With Python we have to write code following exact rules.
* Python is one of the world’s most popular programming languages.
* Professional programmers use Python to make websites, apps, games, and more. 
* Scientists use Python to help make sense of vast amounts of information.
* In this unit, we’re going to use Python to make music!

<img src="/images/logo-black.svg" alt="TunePad logo" style="width: 130px; float: right; position: relative; top: -2rem;">

# What is TunePad?
* TunePad is a website where you make music with Python.
* TunePad was created at Northwestern University.
* TunePad is free for everyone to use.
* TunePad does not make money from advertising.
* TunePad never shares your personal information or email with anyone.

# Warmup Activity
This [warmup activity](/tutorials/chicago-house/) walks through logging into TunePad and creating your first project. 
You'll practice using TunePad's `playNote` and `rest` functions to create a Chicago House Beat.

<a href="/interactives/composer" style="margin: 2rem; display: block;" target="_blank">
<img src="/images/splash/house-splash.png" style="margin: 0.5rem 0" alt="Teenager listening to music with headphones" width="400">Open Chicago House Beat Activity</a>


# TunePad Function Review
You can play a note or drum sound in TunePad with the `playNote` function. 

<img src="/images/play-note.png" alt="playNote function parts" style="width: 75%; margin: 2rem auto;">

The `rest` function is a way of adding a pause to music. 

<img src="/images/rest.png" alt="rest function" style="width: 50%; margin: 2rem auto;">


# Comments
* Comments are notes that programmers add to make their code more readable. 
* You can add comments to Python code using the hashtag symbol (#).
* Everything that comes after a hashtag on a line is a comment. 
* That means it will be ignored by Python and is only for humans.
* You can also use comments to temporarily disable lines of code.

```python
# this line is a comment

playNote(60)   # plays a middle C for 1 beat

# you can disable a line of code with a comment
# playNote(60 + 12)
```