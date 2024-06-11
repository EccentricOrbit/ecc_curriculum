---
date: 2024-01-06
layout: layouts/activity.njk
tags: livecoders
category: Lesson Plan
title: "Functional Reggaetón Beat"
description: Learn to code a basic Reggaetón beat using your own Python functions.
level: Intermediate
time: 45 minutes
license: by-nc-sa
splash: /images/splash/reggaeton-splash.png
project: https://tunepad.com/project/80571
audio: https://api.tunepad.com/api/projects/80571/audio/
prevURL: /curriculum/activities/livecode-hiphop
prevTitle: Loopy Hip-Hop Beat
nextURL: /curriculum/activities/livecode-variables
nextTitle: Variables and Lists
---
Reggaetón originated in Puerto Rico during the late 1990s and today is regarded as one of the most popular styles of music worldwide. Reggaetón consists of an easy-to-code pattern of kick and snare drums. We'll start by coding the basic pattern, and then we'll learn how to use our own functions to make the pattern more interesting. 

<div class="noprint">
Here's what the basic pattern looks like:

<iframe height="325" src="http://localhost:8080/interactives/composer/?embedded=true&bpm=100&steps=16&voice=3&track4=8484&track5=1111" style="width: 95%; min-width: 500px; overflow: hidden; border: none;" scrolling="no"></iframe>
</div>

# Step 1: Create a new project
* Log into [TunePad](https://tunepad.com/project/) and create a new project.
* Name your project **Reggaetón Beat**

# Step 2: Code the Basic Pattern
* Add a new **Drum** cell to your project
* Set the instrument to **Drums → Headlines Drums** 
* Add this code for the kicks and snares.

<tunepad-code patch="/sounds/voices/headlines-drums/" id="step1" tempo="100" time="4/4">
/# Kick drums
for i in range(4): playNote(0)
/
/# Snare drums
rewind(4)
for i in range(2):
    rest(0.75)
    playNote(2, beats = 0.75)
    playNote(2, beats = 0.5)
</tunepad-code>

# Can we make it more interesting?

This is a great beat pattern, but it also gets repetative (just like our other beats).
Music producers and drummers will add variety to a beat by switching up the pattern, adding different instruments,
adding effects, and adding drum fills or breaks. We can do all of these same things with computer code!

# User-Defined Functions
In this activity, we'll explore one powerful technique called **user-defined functions**. 
Essentially, a function lets us take a bunch of code and give it a nickname. 
Then we can use that code over and over again by **calling** the nickname as a shortcut. 
This helps keep code neat and easy to understand.
It also helps with live coding because you can define a bunch of helper functions ahead of time that you call during the performance.

Here's what a function looks like:

```python
def basic_beat():
    for i in range(4): playNote(0)
    rewind(4)
    for i in range(2):
        rest(0.75)
        playNote(2, beats = 0.75)
        playNote(2, beats = 0.5)
```


All we've done here is take the code from STEP 2 above and copy it inside a **function definition**.
* The `def` keyword on line 1 says we're **def**ining a function
* The name of the function can be anything you want as long as it's a valid Python identifier (more on that later).
* We've called this function `basic_beat`.
* The parentheses after the function name are for the function's **parameters**. This function doesn't have any parameters, so it's just empty.
* The colon character at the end of line 1 says that the next lines will be the function's **body**.
* Finally, everything that we want to include in the function (lines 2-8) is indented by four spaces

# Defining Some Functions
Now let's define several functions to create a more interesting beat pattern.
In the code below, we've created three functions called `variation1`, `variation2`, and `variation3`.
But just defining the functions doesn't do anything yet. To actually play the music we need to **call** the functions,
which we do starting on line 20.

<tunepad-code id="functions-3" patch="/sounds/voices/headlines-drums/" tempo="100" time="4/4">
/# The first variation just has kick drums
def variation1():
    for i in range(4): playNote(0)
/        
/# The second variation plays kick drums and adds snares
def variation2():
    variation1() 
    rewind(4)
    for i in range(2):
        rest(0.75)
        playNote(2, beats = 0.75)
        playNote(2, beats = 0.5)
/
/# The third variation adds hi-hats
def variation3():
    variation2()
    rewind(4)
    for i in range(8): playNote(5, beats = 0.5)
/
variation1()    # call the functions to play the music
variation2()
variation3()
variation3()
</tunepad-code>
