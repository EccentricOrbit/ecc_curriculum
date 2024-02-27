---
layout: layouts/activity.njk
tags: learn
category: Lesson
title: "Why Music and Code?"
description: Why would I want to make music with Python code? Why should I learn how to code?
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/welcome-splash.png
date: 2024-01-01
---

This guide is designed to help people learn about music and coding as mutually reinforcing skills. 

*By why would you want to make music with code in the first place?*

Here are four quick reasons:

## Reason 1: Code is a powerful language for thinking about music

One answer is that code gives us an elegant **language** to think about musical ideas. Music is algorithmic in nature—it’s full of mathematical relationships, logical structure, and recursive patterns. Unfortunately, most music notation can't capturing this nuance.

Code, on the other hand, is a language specifically designed to capture mathematical relationships, logical structure, and recursive patterns. For example, think about the stuttered hi-hat patterns are a common feature of popular music. These patterns are tedious to write with sheet music, but can be captured in a much more elegant way with a few lines of Python code.
```python
for _ in range(16):
    if randint(6) > 1:          # roll the die for a random number
        playNote(4, beats=0.5)  # play an eighth note
    else:
        playNote(4, beats=0.25) # or play 2 sixteenth notes
        playNote(4, beats=0.25)
```
What’s interesting about this example is that it's parameterized. Because the code describes the algorithms to generate music, and not the music itself, it means we can create infinite variation by adjusting the numbers involved. We can play around with how frequently stuttered hats are inserted into the pattern by increasing or decreasing one number. You can think of code as something like a power drill; you can swap out different bits to make holes of different sizes. The drill bits are like parameters that change what the tool does in each specific instance. In the same way, algorithms are vastly more general-purpose tools that can accomplish myriad tasks by changing the input parameters.

## Reason 2: Like it or note, music is already defined by code
Looking across the modern musical landscape, it’s clear that music is already defined by code. Almost all modern music is created with the help of sophisticated computer software. It’s hard to overstate how much software has shaped the sound of music in the 21st century. Computers have gotten to a point where they are cheap enough, fast enough, and capacious enough to do real-time audio editing. We can convert sound waves into digital information and hear the effects of our changes in real time. These tools didn’t just appear out of nowhere. They were constructed by huge teams of software engineers writing code—millions of lines of it. As an example, TunePad was created with over 1.5 million lines of code written in over a dozen computer languages such as Python, HTML, JavaScript, CSS, and Dart. Regardless of how you feel about the digital nature of modern music, it’s not going away. Learning to code will help you understand a little more about how all of this works under the hood. More to the point, it’s increasingly common for producers to write their own code to manipulate sound. Learning to code can give you more control and help expand your creative potential.

## Reason 3: Code gives us new creative possibilities with music
Along with any new language comes new creative possibilities. For example, live coding is an emerging form of musical performance art in which performers write computer code to generate music in real time for [live audiences](https://www.nytimes.com/2019/10/04/style/live-code-music.html). Check out this performance from the artist DJ_Dave:

<iframe width="560" height="315" src="https://www.youtube.com/embed/JiQHclg_648?si=hpSDBN5DYNjxyFDw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The history of innovation in music has always been entwined with innovation in technology. Whether we’re talking about Franz Liszt in the 19th century, who pioneered the persona of the modern music virtuoso based on technological breakthroughs of the piano, or DJ Kool Herc in the 20th century, who pioneered hip-hop with two turntables and a crate full of funk records in the Bronx, technologies have created new opportunities for musical expression that have challenged the status quo and given birth to new genres.

## Reason 4: Learning to code is useful for many other things
As we mentioned earlier in this chapter, Python is one of the most powerful, multi-purpose languages in the world. It’s used to create web servers and social media platforms as much as video games, animation, and music. It’s used for research and data science, politics and journalism. Knowing a little Python gives you access to powerful machine learning and artificial intelligence (AI / ML) techniques that are poised to transform most aspects of human work, including in creative domains such as music. Learning a little Python won’t make you a software engineer, just like learning a few guitar chords won’t make you a performance musician. But it’s a start down a path. An open door that was previously closed, and a new way of using your mind and a new way of thinking about music. 

