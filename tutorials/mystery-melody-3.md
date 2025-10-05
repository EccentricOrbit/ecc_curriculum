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
# Try It
See if you can fix all of the **syntax errors** in this project to reveal the mystery melody. 


# What is a Syntax Error?
When you make a mistake writing code, you might get a syntax error. That means Python can't understand what you typed.
A syntax error usually has a line number showing where the problem is.

<tunepad-project name="Dark Side Mystery Melody" tempo="100" time="4/4" key="C major">
<tunepad-cell-list>
<tunepad-cell patch="brass" name="Melody" uuid="cell0" timeline="hidden" theme="light" class="tutorial" autocompile="true" show-instrument="false">
/# fix all the errors to reveal the mystery melody
/C = 24
/D = C + 2
/Eb = D + 1
/E = D + 2
/Gb = D + 4
/G = D + 5
/A = D + 7
/Bb = D + 8
/B = D + 9
/C2 = C + 12
/D2 = D + 12
/Eb2 = D2 + 1
/E2 = D2 + 2
/F2 = E2 + 1
/G2 = G + 12
/A2 = D2 + 7
/
/for i in range(3): 
/    playNote(G)
/    
/playNote(Eb, beats=0.75)
/playNote(Bb beats=0.25)
/
/playnote(G)
/playVote(Eb, beats=0.75)
/playNot(Bb, beats=0.25)
/playNote(G, beats = 2)
/
/for i in range(3)
/    playNote(D2)
/
/playNote(Eb2, beats=0.75)
/playNote(Bb, beats=0.25)
/
/playNote(Gb)
/playNote(Eb, beats=0.75)
/playNote(Bb, beats=0.25)
/playNote(G, beats=2)
/
/playNote(G2
/playNote(G)
/playNote(G2)
/playNote(G2 - 1, beats=0.75)
/playNote(F2, beats=0.25)
/
/playNote(E2, beats=0.25)
/playNote(E2 - 1, bats=0.25)
/playNote(Eb2)
/
/playNote(G+1, beats=0.5)
/playNote(C2+1)
/playGaot(B+1, beats=0.75)
/playNote(B, beats=0.25)
/
/playNote(B-1, beats=0.25)
/playNote(A, beats=0.25)
/ployNote(B-1)
/playNote(E-1, beats=0.5)
/playNote(G-1)
/playNote(E-1, beats=0.75)
/playNote(G, beats=0.25)
/
/playNote(Bb)
/playNote(G, beats=0.75)
/playNote(Bb, beats=0.25)
/play note(D2, beats=2)
/
/playNote(G2)
/playNote(G, beats=0.75)
/playNote(Bb, beats=0.25)
/playNote(G2)
/playNote(G2-1, beats=0.75)
/playNote(F2, beats=0.25)
/
/playNote(E2, beats=0.25)
/playNote(D2 + 1, beats=0.25)
/playNote(E2 - 1)
/
/playNote(G + 1, beats=0.5)
/playNote(C2 + 1)
/playNote(B+1, beats=0.75)
/playNote(B, beats=0.25)
/
/playNote(Bb, beats=0.25)
/playNote(A, beats=0.25)
/playNote(Bb)
/
/playNote(Eb, beats=0.5)
/playNote(G-1)
/playNote(Eb, beats=0.75)
/playNote(Bb, beats=0.25)
/
/playNote(G)
/playNote(Eb, beats=0.75)
/playNote(Bb, beats=0.25)
/playNote(G, beats=2)
/
</tunepad-cell>
</tunepad-cell-list>
</tunepad-project>

