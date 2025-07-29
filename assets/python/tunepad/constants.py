"""
The `tunepad.constants` module defines variables for common note names and durations.
Note names are defined with the letter name (A-G) followed by an optional accidental
indicator (either 'b' for flats or 's' for sharps) followed by the octave number (0-9).

Examples:
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

Examples:
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
"""

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

TRIPLET_NOTE = 1./3.
SEXTUPLET_NOTE = 1./6.


C0 = 12
Cs0 = 13
Db0 = 13
D0 = 14
Ds0 = 15
Eb0 = 15
E0 = 16
F0 = 17
Fs0 = 18
Gb0 = 18
G0 = 19
Gs0 = 20
Ab0 = 20
A0 = 21
As0 = 22
Bb0 = 22
B0 = 23
C1 = 24
Cs1 = 25
Db1 = 25
D1 = 26
Ds1 = 27
Eb1 = 27
E1 = 28
F1 = 29
Fs1 = 30
Gb1 = 30
G1 = 31
Gs1 = 32
Ab1 = 32
A1 = 33
As1 = 34
Bb1 = 34
B1 = 35
C2 = 36
Cs2 = 37
Db2 = 37
D2 = 38
Ds2 = 39
Eb2 = 39
E2 = 40
F2 = 41
Fs2 = 42
Gb2 = 42
G2 = 43
Gs2 = 44
Ab2 = 44
A2 = 45
As2 = 46
Bb2 = 46
B2 = 47
C3 = 48
Cs3 = 49
Db3 = 49
D3 = 50
Ds3 = 51
Eb3 = 51
E3 = 52
F3 = 53
Fs3 = 54
Gb3 = 54
G3 = 55
Gs3 = 56
Ab3 = 56
A3 = 57
As3 = 58
Bb3 = 58
B3 = 59
C4 = 60
Cs4 = 61
Db4 = 61
D4 = 62
Ds4 = 63
Eb4 = 63
E4 = 64
F4 = 65
Fs4 = 66
Gb4 = 66
G4 = 67
Gs4 = 68
Ab4 = 68
A4 = 69
As4 = 70
Bb4 = 70
B4 = 71
C5 = 72
Cs5 = 73
Db5 = 73
D5 = 74
Ds5 = 75
Eb5 = 75
E5 = 76
F5 = 77
Fs5 = 78
Gb5 = 78
G5 = 79
Gs5 = 80
Ab5 = 80
A5 = 81
As5 = 82
Bb5 = 82
B5 = 83
C6 = 84
Cs6 = 85
Db6 = 85
D6 = 86
Ds6 = 87
Eb6 = 87
E6 = 88
F6 = 89
Fs6 = 90
Gb6 = 90
G6 = 91
Gs6 = 92
Ab6 = 92
A6 = 93
As6 = 94
Bb6 = 94
B6 = 95
C7 = 96
Cs7 = 97
Db7 = 97
D7 = 98
Ds7 = 99
Eb7 = 99
E7 = 100
F7 = 101
Fs7 = 102
Gb7 = 102
G7 = 103
Gs7 = 104
Ab7 = 104
A7 = 105
As7 = 106
Bb7 = 106
B7 = 107
C8 = 108
Cs8 = 109
Db8 = 109
D8 = 110
Ds8 = 111
Eb8 = 111
E8 = 112
F8 = 113
Fs8 = 114
Gb8 = 114
G8 = 115
Gs8 = 116
Ab8 = 116
A8 = 117
As8 = 118
Bb8 = 118
B8 = 119
C9 = 120
Cs9 = 121
Db9 = 121
D9 = 122
Ds9 = 123
Eb9 = 123
E9 = 124
F9 = 125
Fs9 = 126
Gb9 = 126
G9 = 127
Gs9 = 128
Ab9 = 128