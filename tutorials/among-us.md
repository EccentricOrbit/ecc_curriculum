---
layout: layouts/activity.njk
tags: tutorials
category: Tutorial
title: "Among Us Theme"
description: Recreate the Among Us Theme Song! Learn how to use loops and conditionals in Python.
authors: by Rina
level: Beginner
time: 15-20 minutes
license: by-nc-sa
splash: /images/splash/among-us-splash.png
project: https://tunepad.com/project/76410
audio: https://api.tunepad.com/api/projects/76410/audio/
disclaimer: For educational purposes only. Based on the "Among Us Drip Theme Song" by Leonz (2020).
---

# Step 1: Create a new Project
* Log in and create a new TunePad project at [tunepad.com](https://tunepad.com). 
* Name your project “Among Us”. 
* Change the tempo to 200bpm. (This can be found at the top right of your window.)

# Step 2: Main Melody
To start this off, you are going add a cell, and press "Keys" (the icon that looks like a piano).

The main melody is a fairly long block of code. (36 lines!) To make this a little easier to think through, we will break it up into parts.

Before we get into the complicated stuff, we will start off with a single note and a "rest", which will just wait that amount of beats before playing the next part.
```python
playNote(48) 
rest(1)
```

Now that we got that out of the way, we will now code the main part of our song.
The theme song has two parts to it. They are both pretty similar:

Part 1:
```python
playNote(60)
playNote(63)
playNote(65)
playNote(66)
playNote(65)
playNote(63)

playNote(60, beats=1.5)
rest(1.5)
playNote(58, beats=0.5)
playNote(63, beats=0.6)
playNote(60, beats=0.7)
rest(2.2)
playNote(48) 
playNote(48) 
rest(1)
```

Part 2:
```python
playNote(60)
playNote(63)
playNote(65)
playNote(66)
playNote(65)
playNote(63)
```
Do you notice something between the two parts? (It has to do with the first 6 lines!)

They're exactly the same!

Instead of writing these lines twice, we can do something called a for loop. This will allow us to replay the same thing again without having to rewrite it!

```python
for i in range(2):
    playNote(60)
    playNote(63)
    playNote(65)
    playNote(66)
    playNote(65)
    playNote(63)
```
Whatever you put in that parenthesis after range is how many times the code will repeat. "i" can be replaced with whatever you want, but what "i" is doing is counting how many times you've repeated the code. 
<i>(Something a little weird about for loops is that the "i" will start counting at zero, not one! In this case, "i" would count to 0, 1, before ending the code.)</i>

With this loop we have the same code part repeating, but we can't forget about the extra code that was different in Part 1! We run into a problem now:

How are we going to have the code know when to play the rest of part one and not repeat that code?

The problem to this is called a conditional! We will use something called an "if statement". This will allow us to run a part of our code only <i>if</i> something is true.

So, if "i" is our counter, we will have an "if statement" checking if we are playing the first part. Then, we will play the extra code for that part. 
<i>(Remember that "i" starts at zero, so for the first part, we will check if "i" is equal to zero!)</i>

After putting all of this together, we get this! (Including the first two lines):

```python
playNote(48) 
rest(1)

for i in range(2):
    playNote(60)
    playNote(63)
    playNote(65)
    playNote(66)
    playNote(65)
    playNote(63)
    if i == 0:
        playNote(60, beats=1.5)
        rest(1.5)
        playNote(58, beats=0.5)
        playNote(63, beats=0.6)
        playNote(60, beats=0.7)
        rest(2.2)
        playNote(48) 
        playNote(48) 
        rest(1)
```

Whew, that was a lot of coding! You can take a quick breather and listen to what you have so far by pressing the "play" button (it looks like a triangle) at the top left of your cell!

We did a lot of heavy lifting so far! We only have 7 more lines of code left!

First, we will add these two lines to our code.
<i> (Make sure that you have now unindented your code and are fully outside of your for loop.) </i>

```python
playNote(66)
rest(3)
```

We're in the home stretch! (Phew!)

We want to play these three notes twice. How can we do that? (Hint: It's something we learned in this assignment!) 
```python
playNote(66,beats=0.8)
playNote(65,beats=0.6)
playNote(63,beats=0.8)
```

If you said "for loops", you're right! Once we place this code into a for loop, it should look like this:

```python
for i in range(2):
    playNote(66,beats=0.8)
    playNote(65,beats=0.6)
    playNote(63,beats=0.8)
```

Nice work! To wrap off our main melody, we are just going to add one last note to this cell!

```python
playNote(48)
```

After we finally combine everything together, this is what your code should look like!
```python
playNote(48) 
rest(1)

for i in range(2):
    playNote(60)
    playNote(63)
    playNote(65)
    playNote(66)
    playNote(65)
    playNote(63)
    if i == 0:
        playNote(60, beats=1.5)
        rest(1.5)
        playNote(58, beats=0.5)
        playNote(63, beats=0.6)
        playNote(60, beats=0.7)
        rest(2.2)
        playNote(48) 
        playNote(48) 
        rest(1)

playNote(66)
rest(3)

for i in range(2):
    playNote(66,beats=0.8)
    playNote(65,beats=0.6)
    playNote(63,beats=0.8)

playNote(48)
```

Does this sound familiar?

# Step 3: Bass Line (Optional)
Great work so far! This part is optional, but it should just give your song a little more depth when you listen to it.

You are going to add a new cell and click the "bass" option. We will then add this code below. 

```python
playNote(24, beats=10.5)

rest(5.5)

playNote(24, beats=10.5)

rest(1.5)

playNote(27,beats=2.2)
playNote(30, beats=2.2)
playNote(24, beats=3.2)
```
The numbers inside the rest and beat parameters are super important, because that timing is what makes sure that it lines up with your main melody.

After we finish this, we should be done with your Among Us Theme song! Give yourself a pat on the back for all of your hard work!

# Try It
Open this project in TunePad <a href="{{project}}" target="_blank">{{ project }}</a>
