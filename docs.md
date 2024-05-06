---
layout: layouts/docs.njk
---
<div class="toc">

# Functions

* [tunepad](#tunepad)
  * [playNote](#tunepad.playNote)
  * [playSound](#tunepad.playSound)
  * [rest](#tunepad.rest)
  * [moveTo](#tunepad.moveTo)
  * [rewind](#tunepad.rewind)
  * [fastForward](#tunepad.fastForward)
  * [getPlayhead](#tunepad.getPlayhead)
  * [getBeat](#tunepad.getBeat)
  * [getMeasure](#tunepad.getMeasure)
  * [transpose](#tunepad.transpose)
  * [bend](#tunepad.bend)
  * [pan](#tunepad.pan)
  * [gain](#tunepad.gain)
  * [lowpass](#tunepad.lowpass)
  * [highpass](#tunepad.highpass)
  * [bandpass](#tunepad.bandpass)
  * [notch](#tunepad.notch)
  * [message](#tunepad.message)
  * [test\_result](#tunepad.test_result)
* [tunepad.constants](#tunepad.constants)
* [tunepad.chords](#tunepad.chords)
  * [playChord](#tunepad.chords.playChord)
  * [buildChord](#tunepad.chords.buildChord)
  * [buildScale](#tunepad.chords.buildScale)
  * [transpose](#tunepad.chords.transpose)
  * [changeKey](#tunepad.chords.changeKey)

</div>

<div class="docs">
<a id="tunepad"></a>

# tunepad

The `tunepad` module contains the basic functions for creating music.
The module is automatically imported into every TunePad cell.

<a id="tunepad.playNote"></a>

#### playNote(note, beats=1, velocity=90, sustain=0)

Play a note with a pitch value greater than 0. You can also call `playNote` with a list of
notes that will be played at the same time. The optional parameter `beats` sets how long the
note will last, and the optional `velocity` parameter sets how hard/loud the note sounds.
Velocity can be any number between 0 and 127. The optional `sustain` parameter allows a
note to ring out longer than the value given by the beats parameter. The value of the parameter
is the number of beats the note should sustain in beats.

**Examples**:

```python
playNote(32)
playNote(55, beats = 0.5)
playNote(0, beats = 2, velocity = 80)
playNote(0, beats = 2, velocity = 80, sustain = 2)
playNote([36, 40, 43])
playNote([36, 40, 43], beats = 2)
```
  

**Arguments**:

- `note` _int, float, list_ - the note or notes to play
- `beats` _float, optional_ - how long to play (default value is 1)
- `velocity` _int, float, optional_ - how hard/loud the note sounds
- `sustain` _float, optional_ - how long to sustain the note
  
  

**Notes**:

  You can also use `play_note()` and `play()` instead of `playNote()`.

<a id="tunepad.playSound"></a>

#### playSound(sound, beats=1, pitch=0, velocity=90, sustain=0)

Play a custom sound using its ID number. You can also call `playSound` with a list of
sounds that will be played at the same time. The optional parameter `beats` sets how
long the note will last, and the optional parameter `velocity` sets how hard/loud the
note sounds. Velocity can be any number between 0 and 127. The optional `pitch` parameter
changes the pitch of the sound by the given number of semi-tones. For example, a pitch
value of 3.0 would be the same as the difference from a C to a D♯ on the piano keyboard.
The optional `sustain` parameter allows a note to ring out longer than the value given
by the `beats` parameter. The value of the parameter is the number of beats the note
should sustain in beats.

**Examples**:

```python
playSound(1203)
playSound(1203, beats = 0.5, velocity = 20)
playSound(1203, beats = 0.5, velocity = 20, sustain = 4)
playSound(1203, beats = 2, pitch = 3, velocity = 80)
playSound([1203, 559, 43])
```
  

**Arguments**:

- `sound` _int_ - the sound ID number
- `beats` _float, optional_ - how long to play (default value is 1)
- `pitch` _int, float_ - change the pitch of the sound by the given number of semi-tones
- `velocity` _int, float, optional_ - how hard/loud the note sounds
- `sustain` _float, optional_ - how long to sustain the note

<a id="tunepad.rest"></a>

#### rest(beats=1)

Add a pause between notes. The length of the pause can be set using the optional `beats` parameter.
```python
rest()    # rest for 1 beat
rest(2)
rest(beats = 1.5)
```

<a id="tunepad.moveTo"></a>

#### moveTo(beats)

Moves the *playhead* forward or backward in time to an arbitrary position. 
In TunePad, the playhead marks the current time. For example, after calling 
`playNote(32, beats = 2)`, the playhead will have advanced by 2 beats. The 
`beats` parameter specifies the point that the playhead will be placed. For 
example, a value of 0 would move the playhead to the beginning of a track.
A value of 1 would skip the first beat and place the playhead before the 
start of the second beat.
```python
moveTo(0)
moveTo(4)
moveTo(0.5)
```

<a id="tunepad.rewind"></a>

#### rewind(beats)

Moves the playhead backward in time by an amount relative to its current position. 
This can be a useful way to play multiple notes at the same time. The `beats`
parameter specifies the number of beats to move the playhead. Negative values of 
`beats` move the playhead forward.
```python
rewind(1)
rewind(-2)
rewind(0.5)
```

<a id="tunepad.fastForward"></a>

#### fastForward(beats)

Moves the playhead forward in time by an amount relative to its current position. 
This can be a useful way to play multiple notes at the same time. The `beats` parameter 
specifies the number of beats to move the playhead. Negative values of `beats` move the 
playhead backward.
```python
fastForward(1.5)
fastForward(-2)
```

<a id="tunepad.getPlayhead"></a>

#### getPlayhead()

Returns the current value of the playhead as a float. This value is
zero-indexed, so the first beat will be zero rather than one.
```python
getPlayhead() # returns 0.0
playNote(0, beats = 1)
getPlayhead() # returns 1.0
```

<a id="tunepad.getBeat"></a>

#### getBeat()

Returns a decimal of the value of the current beat of the measure. 
This value is zero-indexed, therefore the first beat will be zero rather than one.
```python
getBeat() # returns 0

playNote(0, beats = 2)
getBeat() # returns 2

playNote(0, beats = 1)
getBeat() # returns 3

playNote(0, beats = 1)
getMeasure() # returns 0
```

<a id="tunepad.getMeasure"></a>

#### getMeasure()

Returns an integer of the value of the current measure. This value is 
zero-indexed, therefore the first measure will be zero rather than one.
```python
getMeasure() # returns 0
playNote(0, beats = 4)
getMeasure() # returns 1
```

<a id="tunepad.transpose"></a>

## transpose

TunePad effect that shifts the pitch of a section of music by a constant amount.
This is equivalent to adding or subtracting a constant number from the note parameter
of playNote. The `steps` parameter represents the change in pitch. One step moves up
one note value. Using a value of 12 for the steps parameter would shift every note up
by an octave.

**Examples**:

```python
# shifts each note up 7 steps
with transpose(7):
    playNote(36)
    playNote(36)
    playNote(39)
    playNote(41)

# shifts each note down 12 steps (an octave)
with transpose(-12):
    playNote(36)
    playNote(36)
    playNote(39)
    playNote(41)
```
  

**Arguments**:

- `steps` _int, float_ - how many steps to transpose a section of music

<a id="tunepad.bend"></a>

## bend

TunePad effect that changes the pitch of a note over time.
The `cents` parameter represents the total change in pitch. One cent
is equal to 1/100 of a semitone (the distance between two adjacent notes).
Using a value of 500 for the cents parameter would bend the note by five
semitones (the same as the distance from a C to an F on the piano keyboard).
The `beats` parameter specifies how long it takes for the note to bend. If
you don't provide the beats parameter, the effect will be constant. An optional
`start` parameter specifies how long to wait (in beats) before starting the
effect. You can also provide a list of values instead of a single number for
the `cents` parameter. These values represent the change in cents over time.
Each number will be evenly distributed over the duration of the effect.

**Examples**:

```python
# apply a constant pitch bend
with bend(cents = 100):
    playNote(36)

# bend a note from 48 to 53 over one beat
with bend(cents = 500, beats = 1):
    playNote(48)

# bouncy spring effect
with bend(cents = [0, 500, -500, 500, -500, 500, 0], beats = 1):
    playNote(42, beats = 2)
```
  

**Arguments**:

- `cents` _int, float, list_ - how much to bend the note (in cents)
- `beats` _float, optional_ - how long it takes to bend the note
- `start` _int, float, optional_ - how long to wait in beats before starting the effect

<a id="tunepad.pan"></a>

## pan

Applies a stereo pan effect, shifting the sound more towards the left or right speaker.
The `value` parameter ranges from -1.0 (full left speaker) to 1.0 (full right speaker).
A value of 0.0 evenly splits the sound. If a single number is provided, the effect will
be constant—there will be no change over time. You can also pass a list of numbers to
create a change over time. Each number will be evenly distributed over the duration of
the effect given by the `beats` parameter. An optional `start` parameter specifies how
long to wait (in beats) before starting the effect.

**Example**:

```python
# slowly pan from the left speaker to the right over three beats
with pan(value = [-1.0, 1.0], beats = 3):
    playNote(35, beats = 3)
```
  

**Arguments**:

- `value` _int, float, list_ - how much to pan the note (-1.0 to 1.0)
- `beats` _float, optional_ - how long it takes to pan the note
- `start` _int, float, optional_ - how long to wait in beats before starting the effect

<a id="tunepad.gain"></a>

## gain

This TunePad effect changes the volume of notes. The `value` parameter represents
the change in volume (for example a value of 0.5 would reduce the volume by 50%).
If a single number is provided, a constant change in volume will be applied—there
will be no change over time. You can also pass a list of numbers to create a change
over time. Each number will be evenly distributed over the duration of the effect
given by the `beats` parameter. An optional `start` parameter specifies how long
to wait (in beats) before starting the effect.

**Examples**:

```python
# cut the volume by half
with gain(0.5):
    playNote(48)

# fade in
with gain(value = [ 0, 1 ], beats = 2):
    playNote(48, beats = 2)

# fade out after one beat
with gain(value = [ 1, 0 ], beats = 2, start = 1)
    playNote(42, beats = 3)
```
  

**Arguments**:

- `value` _int, float, list_ - how much to change the volume (1.0 means no change, 0.0 means silent)
- `beats` _float, optional_ - duration of the effect
- `start` _int, float, optional_ - how long to wait in beats before starting the effect

<a id="tunepad.lowpass"></a>

## lowpass

Applies a lowpass filter effect that reduces the energy of high frequency
sounds while leaving low frequency sounds below a cutoff point unaffected.
The `frequency` parameter specifies the cutoff frequency for the effect
(between 10 Hz and 22 kHz). You can also pass a list of numbers to create a
change over time. Each number will be evenly distributed over the duration of
the effect given by the `beats` parameter. An optional `start` parameter
specifies how long to wait (in beats) before starting the effect.

**Examples**:

```python
# creates a wha-wha effect after one beat by quickly changing
# the frequency cutoff of a lowpass filter between 200 and 800hz
with lowpass(frequency = [200, 800, 200, 800, 200, 800], beats=1):
    playNote(47, beats=3)

# adds a rhythmic pulse to piano notes
for i in range(0, 4):
with lowpass(frequency = [ 50, 800, 50 ], beats = 0.25, start = 1):
    playNote(33, 2)
```
  

**Arguments**:

- `frequency` _int, float, list_ - cutoff frequency (default is 1000)
- `Q` _int, float, list, optional_ - resonance of the filter (default is 2.0)
- `beats` _int, float, optional_ - duration of the effect
- `start` _int, float, optional_ - how long to wait in beats before starting the effect

<a id="tunepad.highpass"></a>

## highpass

The highpass filter reduces the energy of low frequency sounds while allowing frequencies
above the cutoff point to pass through unaltered. The `frequency` parameter specifies the 
cutoff frequency for the effect (between 10 Hz and 22 kHz). You can also pass a list of 
numbers to create a change over time. Each number will be evenly distributed over the 
duration of the effect specified by the `beats` parameter. An optional `start` parameter 
specifies how long to wait (in beats) before starting the effect.

<a id="tunepad.bandpass"></a>

## bandpass

The bandpass filter allows frequencies near the cutoff point to pass through unaltered
while reducing the energy of frequencies above and below. The `frequency` parameter
specifies the cutoff frequency for the effect (between 10 Hz and 22 kHz). You can also
pass a list of numbers to create a change over time. Each number will be evenly
distributed over the duration of the effect specified by the `beats` parameter. An
optional `start` parameter specifies how long to wait (in beats) before starting the effect.

**Example**:

```python
# carving out frequencies for a clap sound in the drums
clap = 10
with bandpass(frequency = [100, 11000], beats=4):
    for i in range(0, 16):
        playNote(clap, beats = 0.25)    
```

<a id="tunepad.notch"></a>

## notch

The notch filter reduces the energy of sounds near the cutoff frequency, 
while allowing higher and lower frequencies to pass through unaltered. 
The frequency parameter specifies the cutoff frequency for the effect 
(between 10 Hz and 22 kHz). You can also pass a list of numbers to create
a change over time. Each number will be evenly distributed over the duration 
of the effect specified by the `beats` parameter. An optional `start` parameter 
specifies how long to wait (in beats) before starting the effect.

<a id="tunepad.message"></a>

#### message(msg)

Display a message to the user (e.g. code hint, linter message, etc.)
```python
message('Try to create 12 notes that increase in volume over time.')
```

<a id="tunepad.test_result"></a>

#### test\_result(msg, passed)

Display outcome of a unit test (PASS/FAIL). The second boolean parameter
indicates pass (True) or fail (False).
```python
# shows a red FAIL message
test_result('Create 12 notes that increase in volume over time.', False)

# shows a green PASS message
test_result('Create 12 notes that get shorter and shorter over time.', True)
```

<a id="tunepad.constants"></a>

# tunepad.constants

The `tunepad.constants` module defines variables for common note names and durations.
Note names are defined with the letter name (A-G) followed by an optional accidental
indicator (either 'b' for flats or 's' for sharps) followed by the octave number (0-9).

**Examples**:

```python
from tunepad.constants import *

print(A3)  # prints 57 (note A)
print(Cs2) # prints 37 (note C-sharp)
print(Bb4) # prints 70 (note B-flat)

playNote(C5)
playNote(D5)
playNote([C5, E5, G5], 4)
```
  
  Note durations are represented by the traditional note type (e.g. quarter or half).
  

**Examples**:

```python
from tunepad.constants import *

print(WHOLE_NOTE)          # prints 4.0
print(QUARTER_NOTE_DOTTED) # prints 1.5
print(TRIPLET_NOTE)        # prints 0.33333

playNote(C5, HALF_NOTE)

for _ in range(6):
    playNote(A4, beats = SEXTUPLET_NOTE)

playSound(123, EIGHTH_NOTE)
```
  
  The full set of values is:
```python
DOUBLE_WHOLE_NOTE = 8.0
WHOLE_NOTE = 4.0

HALF_NOTE_DOTTED = 3.0
HALF_NOTE = 2.0

QUARTER_NOTE_DOTTED = 1.5
QUARTER_NOTE = 1.0

EIGHTH_NOTE_DOTTED = 0.75
EIGHTH_NOTE = 0.5

SIXTEENTH_NOTE = 0.25

THIRTY_SECOND_NOTE = 0.125

TRIPLET_NOTE = 1/3
SEXTUPLET_NOTE = 1/6
```

<a id="tunepad.chords"></a>

# tunepad.chords

The `tunepad.chords` module provides functions and values for playing chords.
For more information on each function and examples, try the 
[playChord](/activities/play-chord) tutorial. To use this module in TunePad
add this line to your cell:
```python
from tunpad.chords import *
```

<a id="tunepad.chords.playChord"></a>

#### playChord(chord, beats=1, velocity=90, sustain=0, playType='block', octave=3, inversion=0)

Play a specified diatonic or chromatic chord for a given key. 
The chord is specified as a Roman Numeral string. The `beats`, `velocity`, and 
`sustain` parameters all work identically to `playNote`. The `octave` parameter
specifies the octave in which the chord is played. This `octave` parameter is an 
integer in the range [-1, 9]. The `inversion` parameter controls the ordering of
the pitches in the chord and has a range of [0, 3]. The `playType` argument
selects from one of five methods of playing our chord:
* The default method is "block" and plays every note at the same time
* The "rolled" method introduces a slight, random offset between each note to mimic how a human might play the notes
* The "arpeggio" plays the chord up then down, each note an equal division of the total beats
* The "arpeggio_up" plays the chord up, each note an equal division of the total beats
* The "arpeggio_down" plays the chord down, each note an equal division of the total beats

<a id="tunepad.chords.buildChord"></a>

#### buildChord(chord, octave=3, inversion=0)

The `buildChord` function returns a list of integers of an inputted diatonic 
or chromatic chord the global key corresponding to the notes of specified by 
a Roman Numeral string and inputted octave. Unlike `playChord`, `buildChord` 
does not play the chord. The `octave` can be specified using an integer value 
in the range [-1, 9]. The `inversion` parameter controls the ordering of the 
pitches and has a range of [0, 3].

<a id="tunepad.chords.buildScale"></a>

#### buildScale(tonic, octave, mode, direction="ascending")

The `buildScale` function returns a list of integers corresponding to the 
notes of an inputted musical scale starting on an inputted note and octave. 
The starting note is specified with the `tonic` parameter. Valid inputs for 
this parameter are the same as the valid keys for `changeKey`. The `octave`
can be specified using an integer value in the range [-1, 9]. The `direction` 
parameter supports "ascending" and "descending" and dictates whether the 
scale is in increasing order of pitch or decreasing order of pitch. 
The `mode` parameter accepts a string equivalent to:
* "Major" or "minor"
* One of the church modes:
```python
"Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"
"Chromatic", "Whole Tone", "Diminished"
```

<a id="tunepad.chords.transpose"></a>

#### transpose(pitchSet, origKey, newKey, octave=3)

The `transpose` function accepts a pitch set in the form of a list of 
integers that is in one key and returns that set shifted to a new key. 
The `origKey` parameter is the original key that the pitch set belongs
to and `newKey` is the key that will be transposed to; both `origKey` 
and `newKey` are specified using the same valid keys for `changeKey` 
function.

<a id="tunepad.chords.changeKey"></a>

#### changeKey(newKey)

In TunePad, we can specify the key of a cell with the `changeKey` function,
which changes the global key of that cell. This function accepts a string 
from the set of possible keys, with the default key being specified by the project.
The major keys that can be chosen are: 
```python
"C", "C#", "Db", "D", "Eb", "E", "F", 
"F#", "Gb", "G", "Ab", "A", "Bb", "B"
```
The minor keys that can be chosen are: 
```python
"Am", "A#m", "Bbm", "Bm", "Cm", "C#m", "Dm", 
"D#m", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m"
```

</div>

