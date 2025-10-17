---
layout: layouts/activity.njk
tags: [ 'tutorials', 'learn' ]
category: Tutorial
title: Deep House
description: Create a simple Deep House track
level: Beginner
time: 30-40 minutes
license: by-nc-sa
splash: /images/splash/cta-splash.png
date: 2025-10-16
---
Deep house originated in the 1980s as a fusion of Chicago house with elements of jazz, funk, and soul.
In this tutorial we'll experiment with layers of chords, four-on-the-floor drums, and rhythmic arpeggios.

<tunepad-project name="Deep House Tutorial" uuid="deephouse" tempo="120">
<tunepad-cell-list>


# Start with lush chords

Let's start our track with four beautiful chords played on a Rhodes piano in a slow, steady pattern.


<tunepad-cell name="chords" uuid="chords" timeline="score" theme="light" class="tutorial music" patch="rhodes" autocompile="true">
/# define four deep house chords
chord1 = [ 48, 55, 57, 60 ]
chord2 = [ 48, 52, 55, 60 ]
chord3 = [ 48, 53, 57, 60 ]
chord4 = [ 48, 50, 57, 60 ]
/
playNote(chord1, beats = 4, velocity=70)
playNote(chord2, beats = 4, velocity=70)
playNote(chord3, beats = 4, velocity=70)
playNote(chord4, beats = 4, velocity=70)
/
/
/
</tunepad-cell>

# Kick Drums

Next layer in the classic house kick drums.

<tunepad-cell name="kicks" uuid="kicks" timeline="score" theme="light" class="tutorial music" patch="rock-drums" autocompile="true">
/for i in range(4):
/    playNote(0, beats = 0.5)
/    playNote(0, beats = 0.5, velocity = 30)
/
/
</tunepad-cell>

# Snare Drums

Snares play on beats 2 and 4, but feel free to mix it up.

<tunepad-cell name="snare" uuid="snare" timeline="score" theme="light" class="tutorial music" patch="linndrum" autocompile="true">
rest(1)
playNote(2)
rest(1)
playNote(2)
/
/
/
</tunepad-cell>


# Rhythmic chords

Echo the kick drums with rhythmic chords played on a percussive synth
    
<tunepad-cell name="keys" uuid="keys" theme="light" class="tutorial music" patch="party" timeline="midi" autocompile="true">
chord1 = [ 48, 55, 57, 60 ]
chord2 = [ 48, 52, 55, 60 ]
chord3 = [ 48, 53, 57, 60 ]
chord4 = [ 48, 50, 57, 60 ]
/
/for i in range(8):
/    playNote(chord1, beats = 0.5, velocity = 30)
/
/for i in range(8):
/    playNote(chord2, beats = 0.5, velocity = 30)
/
/for i in range(8):
/    playNote(chord3, beats = 0.5, velocity = 30)
/    
/for i in range(8):
/    playNote(chord4, beats = 0.5, velocity = 30)
/
/
</tunepad-cell>

# Arpeggios!

Climbing arpeggios start to bring this track to life!

<tunepad-cell name="arps" uuid="arps" timeline="score" theme="light" class="tutorial music" patch="soft-synth" autocompile="true">
chord1 = [ 48, 55, 57, 60 ]
chord2 = [ 48, 52, 55, 60 ]
chord3 = [ 48, 53, 57, 60 ]
chord4 = [ 48, 50, 57, 60 ]
/
/
/for note in chord1 * 4:
/    playNote(note, beats = 0.25, velocity = 60)
/
/for note in chord2 * 4:
/    playNote(note, beats = 0.25, velocity = 60)
/
/for note in chord3 * 4:
/    playNote(note, beats = 0.25, velocity = 60)
/
/for note in chord4 * 4:
/    playNote(note, beats = 0.25, velocity = 60)
/
/
/
/
</tunepad-cell>


# Bass

Add some depth with a simple bass line that plays the second note of each chord

<tunepad-cell name="bass" uuid="bass" timeline="waveform" theme="light" class="tutorial music" patch="electric-bass" autocompile="true">
playNote(43, beats = 3)
playNote(43, beats = 1)
/
playNote(40, beats = 3)
playNote(40, beats = 1)
/
playNote(41, beats = 3)
playNote(41, beats = 1)
/
playNote(38, beats = 3)
playNote(38, beats = 1)
/
</tunepad-cell>


# Hi-Hats

Add some texture with hi-hats

<tunepad-cell name="hats" uuid="hats" timeline="midi" theme="light" class="tutorial music" patch="808-drums" autocompile="true">
/for i in range(8):
/    playNote(4, beats = 0.25)
/
/rest(1)
/
/for i in range(4):
/    playNote(4, beats = 0.25)
/
/
/
</tunepad-cell>

# Snare Riser

Ready to build energy?? Try adding a snare drum riser!

<tunepad-cell name="riser" uuid="riser" timeline="midi" theme="light" class="tutorial music" patch="808-drums" autocompile="true">
/for i in range(8):
/    playNote(2)
/
/for i in range(8):
/    playNote(2, beats = 0.5)
/
/for i in range(16):
/    playNote(2, beats = 0.25, pitch = i / 4)
/
/
</tunepad-cell>

</tunepad-cell-list>

</tunepad-project>
