---
layout: layouts/activity.njk
tags: learn
category: Activity
title: "Voice Leading Tutorial"
subtitle: Create a simple chord progression with Python
description: This activity teaches the fundamentals of voice leading to create chord progressions in TunePad
authors: by Frank Wang
level: Intermediate
time: 30-45 minutes
license: by-nc-sa
splash: /images/splash/music-splash.jpg
project1: https://tunepad.com/project/76036
project2: https://tunepad.com/project/76037
disclaimer: This tutorial is based on Someone Like You by Adele (2011), Columbia. For educational purposes only.
---

# Objectives
* Learn about voice leading, voices, and common tones
* Create foundational chords that can be heard in many pop songs
* Practice coding in Python

# Introduction
In this tutorial, we're going to explore the essential concept of voice leading, a key element in music composition. Using the pop song *Someone Like You* by Adele, we will understand how voice leading can transform a simple chord progression into a compelling musical experience, as well as teach basic voice leading rules in TunePad. Voice leading is crucial for composing any type of music.

If you're not familiar with *Someone Like You* by Adele, you can watch the music video here.

<br>
<iframe width="560" height="315" src="https://www.youtube.com/embed/hLQl3WQQoQ0?si=b4HCCSVvrazshkXx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<br><br>

Please note that this is an intermediate tutorial and assumes knowledge of TunePad's playNote function, chords, lists, variables, and sheet music reading. Feel free to check out Diatonic Chords and Chord Progressions and TunePad's Learn Tutorials for these topics: <a href="/learn/">Tutorials</a>


# What are the Roman Numerals?
First, let's listen to "Someone Like You" by Adele, focusing on its chord progression in the main theme. You will see that this song uses a classic I-V-vi-IV chord progression, a staple in many pop songs. In TunePad, we'll recreate this progression without any voice leading first.

This song is in the key of A major, so the chords are:

I: A major (notes 57, 61, 64)

V: E major (notes 64, 68, 71)

vi: F minor (notes 66, 69, 73)

IV: D major (notes 62, 66, 69)

<iframe src="{{ project1 }}?embedded=true" class="tunepad-iframe" scrolling="no" style="height: 900px; width: 350px"></iframe>

<a href="{{project1}}" target="_blank">Open this project in TunePad</a>



# Initial Playback
After playing the progression in TunePad, you'll notice something doesn't sound quite right. The chords sound disjointed and spread out. This is because there is no voice leading yet, causing a lack of cohesion in our progression.

# What is Voice Leading?
To fix this issue and make it sound better, we will use a concept called **voice leading**. Voice leading is the technique of moving from one chord to the next in the smoothest way possible, by changing each note by the smallest possible amount. It’s like creating a smooth path from one chord to another, which makes the music sound more connected and harmonious.

The primary goal is minimal movement of each note or **voice**. The first thing we should check for is **common tones**. When two chords share a common note, that note should be sustained in the same voice in the following chord. For example, the E5 in the I and V chords is a common tone. If there are no more common tones, each voice should move to the nearest available note in the next chord.

# Applying Voice Leading In TunePad
Let’s apply voice leading to our chord progression between the I and V chords. We are unable to change the bass note, as that is given by the Roman numeral. Looking at the other voices, we can see that E5 is a common tone- let's keep that constant for the V chord (luckily, it already stays in place). With no common tones left, let's adjust our other voices. Starting with B4, we can see that it is pretty high up and not close to the other voices; let's move it down to B3. Similarly, let's move Gs4 down to Gs3. We have finished voice leading the V chord!

<img src="/images/voice-leading.png">

Here is the complete voice leading:

<iframe src="{{ project2 }}?embedded=true" class="tunepad-iframe" scrolling="no" style="height: 900px; width: 350px"></iframe>


<a href="{{project2}}" target="_blank">Open this project in TunePad</a>

# Conclusion
Listen to the progression now. Notice how the chords flow smoothly into one another, and actually sound like Adele? This is the power of voice leading. It's a simple yet effective way to enhance any chord progression, and crucial for composing good music.