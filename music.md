---
layout: layouts/base.njk
title: Learn Music
subtitle: Introduction to music creation using Python code
splash: /images/music-splash.jpg
showtoc: true
---
# What is TunePad?

TunePad is a free, online platform for creating music using Python code. TunePad was developed at Northwestern University with funding from the National Science Foundation. TunePad is free for everyone to use.

# What is Python?

Python is a general purpose programming language first released in the 1990s that is now one of the most widely-used languages in the world. Python is designed to be easy to read and write, which makes it a popular choice for beginners. It’s also fully featured and powerful, making it a good choice for professionals working in fields as diverse as data science, machine learning, web development, the arts, and video game development. Because Python has been around for decades, it runs on every major computer operating system. TunePad uses a version of Python that runs directly inside of your web browser without the need for any special software installation.

Unlike many other common beginner programming languages, Python is “text-based”, which means that you type code into an editor instead of dragging code blocks on the computer screen. This makes Python a little harder to learn than other beginner languages, but it also greatly expands what you can do.

# A Quick Example
Here’s a quick example of what coding music in Python looks like. This program runs in TunePad to create a simple beat pattern, variants of which have been used in thousands of songs.

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

When we show Python code in this tutorial it will ofen appear with line numbers on the left side for easy reference. 
Python generally runs code from top to bottom. 
There are special notes after the hashtag symbol (#) on some lines. 
Those notes are called comments, and they’re sort of like sticky notes that programmers use to leave notes for themselves.
These 8 lines of Python code tell TunePad to play a pattern of kick drums, snare drums, and high-hats. 

Most of the lines are `playNote` instructions, and, as you might have guessed, those instructions tell TunePad to play musical sounds indicated by the numbers inside of the parentheses. This example also includes something called a loop on line 6. Don’t worry too much about the details yet, but the loop is an easy way to repeat a set of actions over and over again. In this case, the loop tells Python to repeat lines 7 and 8 four times in a row. You can try out the example for yourself with this link: [https://tunepad.com/examples/roses](https://tunepad.com/examples/roses)

# Learn Music
{% for item in collections.music %}
* [{{ item.data.title}}]({{item.url}})
{%- endfor -%}

<br>
# TTODO
* Learning note names
* Note timing
* Playing chords
* Major and minor chords
* 7 easy chords
* Three ways to play chords
* Chord progressions
* Hi-hat patterns and for-loops
* Stranger Things and Arpeggios
