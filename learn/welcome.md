---
layout: layouts/activity.njk
tags: learn
category: Lesson
title: "Welcome to TunePad"
description: What is TunePad? What is Python? And why would I want to make music with code?
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/welcome-splash.png
date: 2024-01-01
---
# What is TunePad?

TunePad is a free, online platform for creating music using Python code. TunePad was developed at Northwestern University with funding from the National Science Foundation. TunePad is free for everyone to use.

# What is Python?

* Python is one of the most widely-used languages in the world.
* Python is designed to be easy to read and write, which makes it a popular choice for beginners. 
* It’s also fully featured and powerful, making it a good choice for professionals.
* Python is used for data science, machine learning, web development, the arts, and video game development. 
* Python is a “text-based” language, which means that you type code into an editor instead of dragging code blocks on the computer screen.

# A Quick Example
Here’s a quick example of what coding music in Python looks like. This program runs in TunePad to create a simple beat pattern used in thousands of songs.

```python
kick = 1      # define variable for kick drum sounds
snare = 2     # define variable for snare drum sounds
hat = 4       # define variable for hi-hat sounds

playNote(kick)   # play a kick drum sound
playNote(snare)  # play a snare drum sound
playNote(kick)
playNote(snare)
rewind(4)        # rewind 4 beats
for i in range(4):
    rest(0.5)
    playNote(hat, beats = 0.5)   # play a hi-hat for half a beat
```

* All the Python code on this site will have line numbers on the left side for easy reference. 
* Python generally runs code from top to bottom. 
* There are special notes called comments that come after a hashtag symbol (#) on some lines. 
* Comments are like sticky notes that programmers use to help people understand their code.

# Why Music and Coding?

More and more code will be used to produce music, to compose music, and even to [perform music for live audiences](https://www.nytimes.com/2019/10/04/style/live-code-music.html). Digital production tools such as Logic, Reason, Pro Tools, FL Studio, and Ableton Live are complex software applications created with millions of lines of code written by huge teams of software engineers. With all of these tools you can write code to create custom plugins and effects. Beyond production tools, live coding is an emerging form of musical performance art in which Information Age DJs write computer code to generate music in real time for live audiences.

<iframe width="560" height="315" src="https://www.youtube.com/embed/JiQHclg_648?si=hpSDBN5DYNjxyFDw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
