---
layout: layouts/playground.njk
title: TunePad Playground
description: Test site
---
# Play the Boom Whackers!

You can write Python code to play these notes:
* `C = 48`
* `E = 52`
* `F = 53`
* `G = 55`
* `A = 57`

<tunepad-code patch="/sounds/voices/grand-piano/" tempo="60" id="midi-output" midi-out="true" midi-voice="11">
notes = [ 48, 52, 53, 55, 57, 55, 53, 52, 48 ]
/
for note in notes:
    playNote(note, beats = 0.5)
    playNote(note, beats = 0.25)
/   
</tunepad-code>
