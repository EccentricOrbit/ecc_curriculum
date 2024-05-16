"""
The `tunepad.chords` module provides functions and values for playing chords.
For more information on each function and examples, try the 
[playChord](/activities/play-chord) tutorial. To use this module in TunePad
add this line to your cell:
```python
from tunepad.chords import *
```
"""
#from boilerplate import * # TESTING: only include this line when running tests
from . import * # TESTING: comment out this line when testing
from tunepad import *

key = 'C'

# keys based on accidentals are chosen as they are most commonly
# named on piano (e.g. "Db major" instead of "C# major")
# F# and Gb are both included since they are equally common
majorKeys = ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"]
minorKeys = ["Am", "A#m", "Bbm", "Bm", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m", "Abm"]

numerals_dict = {"i"    : 0,
                 "ii"   : 1,
                 "ii0"  : 1,
                 "iii"  : 2,
                 "iv"   : 3,
                 "v"    : 4,
                 "vi"   : 5,
                 "vii0" : 6,
                 "vii"  : 6}

note_shifts_dict = {'c' : 0,
                    'd' : 2,
                    'e' : 4,
                    'f' : 5,
                    'g' : 7,
                    'a' : 9,
                    'b' : 11}

applied_offset_dict = { "i"    : 0,
                        "I"    : 0,
                        "ii"   : -10,
                        "ii0"  : -10,
                        "iii"  : -8,
                        "III"  : -8,
                        "IV"   : -7,
                        "iv"   : -7,
                        "V"    : -5,
                        "v"    : -5,
                        "VI"   : -4,
                        "vi"   : -3,
                        "VII"  : -2,
                        "vii0" : -1}

alteredChordLookupDict = {"It6" : [56, 60, 66],
                         "Ger6" : [56, 60, 62, 66],
                         "Fr6"  : [56, 60, 63, 66],
                         "N6"   : [53, 56, 63],
                         "II6"  : [53, 56, 63]}

# ---------------------------------------------------------------------
# plays a chord based on a roman numeral
# ---------------------------------------------------------------------
def playChord(chord, beats=1, velocity=90, sustain=0, playType='block', octave=3, inversion=0):
    """
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
    """
    ## check inputs
    if playType not in ['block', 'arpeggio', 'rolled', 'arpeggio_down', 'arpeggio_up']:
        playType = 'block'

    if type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
    if beats < 0: raise ValueError("Invalid value for 'beats'. Beats must be non-negative int or float.")
    if type(inversion) not in [int]: raise TypeError("Invalid type for 'inversion'. Must be an integer value.")

    if type(octave) is not list: octave = [octave]
    if type(octave) is list and not all(isinstance(x, int) for x in octave):
        raise TypeError("Invalid type for 'octave'. Must be int or list of int.")

    pitchSet = buildChord(chord, octave, inversion)

    ## send to playNote based on playType ##
    if playType == "block":
        playNote(pitchSet, beats, velocity, sustain)

    elif playType == "rolled":
        from random import uniform
        offset = 0

        _range = 0.15
        if beats < (_range * len(pitchSet)):
            _range = (float(beats) / len(pitchSet))

        for note in pitchSet[:-1]:
            next_offset = round(uniform(0, _range), 3) # can adjust range to give more or less variation
            playNote(note, next_offset, velocity, (beats - offset))
            offset += next_offset

        playNote(pitchSet[-1], (beats-offset), velocity)

    elif playType == "arpeggio":
        length = (float(beats) / float(len(pitchSet))) / 2

        pitchSet_2 = pitchSet[:]
        try:
            pitchSet_2 = chordInversionUtil(pitchSet_2, inversion+1)
        except:
            pass

        [playNote(note, length, velocity, sustain) for note in pitchSet]
        [playNote(note, length, velocity, sustain) for note in pitchSet_2[::-1]]

    elif playType == "arpeggio_up":
        length = float(beats) / float(len(pitchSet))
        [playNote(note, length, velocity, sustain) for note in pitchSet]

    elif playType == "arpeggio_down":
        length = float(beats) / float(len(pitchSet))
        [playNote(note, length, velocity, sustain) for note in pitchSet[::-1]]


# ---------------------------------------------------------------------
# finds spelling of chord based on a roman numeral
# ---------------------------------------------------------------------
def buildChord(chord, octave=3, inversion=0):
    """
    The `buildChord` function returns a list of integers of an inputted diatonic 
    or chromatic chord the global key corresponding to the notes of specified by 
    a Roman Numeral string and inputted octave. Unlike `playChord`, `buildChord` 
    does not play the chord. The `octave` can be specified using an integer value 
    in the range [-1, 9]. The `inversion` parameter controls the ordering of the 
    pitches and has a range of [0, 3].
    """
    def check_note(n):
        if type(n) in [int, float]: return True
        else: return False

    if type(chord) is list and all(check_note(n) for n in chord):
        return chord

    ## handle augmented chords separately
    elif chord in ["It+6", "Ger+6", "Fr+6", "It6", "Ger6", "Fr6", "N6", "II6"]:
        if "+" in chord: chord = chord.replace("+", "")
        if inversion != 0:
            raise ValueError("Invalid 'inversion'. '{}' chord must be in root inversion".format(chord))

        pitchSet = alteredChordLookupDict[chord]

    ## otherwise assemble chord set of current key, and check that chord is in that set
    elif type(chord) == str:

        if "m" in key:
            correctSet = ["i", "ii0", "III", "iv", "v", "V", "VI", "vii0", "VII"]
            scale = [48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82]
            mode = "minor"
        else:
            correctSet = ["I", "ii", "iii", "IV", "V", "vi", "vii0"]
            scale = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83]
            mode = "major"

        extensions = ["", "7", "9", "11"]
        susSet = ["", "sus", "sus2", "sus4", "sus7", "sus9"]
        appliedSet = ([("/" + x) for x in correctSet[:]]) + [""]

        # tokenize chord into roman numerals and extension using regex
        import re
        regex = re.compile(r'^({})({})({})({})$'.format('|'.join(correctSet), '|'.join(extensions), '|'.join(susSet), '|'.join(appliedSet)))
        tokenized = regex.match(chord, re.MULTILINE) # TESTING: comment out this line when running tests
        #tokenized = regex.match(chord) # TESTING: only include this line when running tests


        if not tokenized:
            raise ValueError("Invalid chord {} for current {} key. Choose from {}".format(chord, mode, str(correctSet)))

        baseChord = tokenized.group(1)
        extension = tokenized.group(2)
        sus = tokenized.group(3)
        applied = tokenized.group(4)


        # lookup index of starting scale degree (zero indexed)
        startingPitch = numerals_dict[baseChord.lower()]

        ## build list of notes to send to playNote ##

        # base chord
        if sus == "":
            pitchSet = [scale[startingPitch], scale[startingPitch + 2], scale[startingPitch + 4]]
        elif sus == "sus2":
            pitchSet = [scale[startingPitch], scale[startingPitch + 1], scale[startingPitch + 4]]
        elif sus == "sus4" or sus == "sus":
            pitchSet = [scale[startingPitch], scale[startingPitch + 3], scale[startingPitch + 4]]
        elif sus == "sus7":
            pitchSet = [scale[startingPitch], scale[startingPitch + 3], scale[startingPitch + 4]]
            extension = "7"
        elif sus == "sus9":
            pitchSet = [scale[startingPitch], scale[startingPitch + 3], scale[startingPitch + 4]]
            extension = "9"

        # extended harmony
        if extension == "7":
            pitchSet.append(scale[startingPitch + 6])
        elif extension == "9":
            pitchSet.extend([scale[startingPitch + 6], scale[startingPitch + 8]])
        elif extension == "11":
            pitchSet.extend([scale[startingPitch + 6], scale[startingPitch + 8], scale[startingPitch + 10]])

        # adjust altered 7th scale degree for relevant minor chords
        if baseChord == "vii0" and mode == "minor":
            pitchSet[0] += 1
        elif baseChord == "V" and mode == "minor":
            pitchSet[1] += 1

        if applied != "":
            if baseChord not in ["V", "vii0"]:
                raise ValueError("Applied chord must be based on 'V' or 'vii0'")

            applied = applied.replace("/", "")

            applied_offset = applied_offset_dict[applied]
            pitchSet = [(x + applied_offset) for x in pitchSet]

        pitchSet = chordInversionUtil(pitchSet, inversion)
    else:
        raise ValueError("Chord not recognized")
    return transpose(pitchSet, "c", key, octave)


# ---------------------------------------------------------------------
# utility for building a major or minor scale
# ---------------------------------------------------------------------
def buildScale(tonic, octave, mode, direction="ascending"):
    """
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
    """
    mode = mode.lower()
    # find scale starting on C3 as base
    if mode == "ionian" or mode == "major":
        #        C   D   E   F   G   A   B   C
        scale = [48, 50, 52, 53, 55, 57, 59, 60]
    elif mode == "dorian":
        scale = [48, 50, 51, 53, 55, 57, 58, 60]
    elif mode == "phrygian":
        scale = [48, 49, 51, 53, 55, 56, 58, 60]
    elif mode == "lydian":
        scale = [48, 50, 52, 54, 55, 57, 59, 60]
    elif mode == "mixolydian":
        scale = [48, 50, 52, 53, 55, 57, 58, 60]
    elif mode == "aeolian" or mode == "natural minor" or mode == "minor":
        scale = [48, 50, 51, 53, 55, 56, 58, 60]
    elif mode == "locrian":
        scale = [48, 49, 51, 53, 54, 56, 58, 60]
    elif mode == "harmonic minor":
        scale = [48, 50, 51, 53, 55, 56, 59, 60]
    elif mode == "whole tone":
        scale = list(range(48, 61, 2))
    elif mode == "chromatic":
        scale = list(range(48, 61, 1))
    elif mode == "diminished" or mode == "octatonic":
        scale = [48, 50, 51, 53, 54, 56, 57, 59, 60]
    else:
        raise ValueError("Invalid entry for 'mode'")

    ## shift it to correct key and octave
    scale = transpose(scale, "C", tonic, octave)
    scale = list(set(scale))

    ## adjust for direction
    if direction == "ascending":
        return scale
    elif direction == "descending":
        return scale[::-1]
    else:
        raise ValueError("Invalid entry for 'direction'")


# ---------------------------------------------------------------------
# utility for transposing a set of pitches between two keys
# ---------------------------------------------------------------------
def transpose(pitchSet, origKey, newKey, octave=3):
    """
    The `transpose` function accepts a pitch set in the form of a list of 
    integers that is in one key and returns that set shifted to a new key. 
    The `origKey` parameter is the original key that the pitch set belongs
    to and `newKey` is the key that will be transposed to; both `origKey` 
    and `newKey` are specified using the same valid keys for `changeKey` 
    function.
    """
    # check inputs
    if type(octave) is not list: octave = [octave]
    if type(octave) is list and not all(isinstance(x, int) for x in octave):
        raise TypeError("Invalid type for 'octave'. Must be int or list of int.")

    if type(pitchSet) is list and not all(isinstance(x, int) for x in pitchSet):
        raise TypeError("Invalid type for 'pitchSet'. Must be list of int.")

    if not isValidKey(origKey):
        try:
            if isValidKey(origKey.capitalize()):
                origKey = origKey.capitalize()
            else:
                raise ValueError("Invalid key {} for 'origKey'.".format(origKey))
        except:
            raise ValueError("Invalid key {} for 'origKey'.".format(origKey))

    if not isValidKey(newKey):
        try:
            if isValidKey(newKey.capitalize()):
                newKey = newKey.capitalize()
            else:
                raise ValueError("Invalid key {} for 'newKey'.".format(newKey))
        except:
            raise ValueError("Invalid key {} for 'newKey'.".format(newKey))

    # lookup shift within octave
    note_shift = note_shifts_dict[newKey[0].lower()] - note_shifts_dict[origKey[0].lower()]

    # account for sharps+flats
    try:
        if newKey[1] == '#':
            note_shift += 1
        elif newKey[1] == 'b':
            note_shift -= 1
    except:
        pass

    # adjust for octave (add or subtract 12 depending on octave)

    newSet = []

    # rewrite using list comprehension or map?
    for o in octave:
        octave_shift = ((o - 3) * 12) + note_shift

        # perform shift on each element of array to get correct scale
        newSet += ([(x + octave_shift) for x in pitchSet])

    return newSet

# ---------------------------------------------------------------------
# utility for finding inversions of chords
# ---------------------------------------------------------------------
def chordInversionUtil(chord, inversion):
    if inversion == 0:
        return chord
    elif inversion == 1 and len(chord) >= 3:
        newChord = chord[1:]
        newChord.append(chord[0]+12)
        return newChord
    elif inversion == 2 and len(chord) >= 3:
        newChord = chord[2:]
        newChord.extend([i+12 for i in chord[0:2]])
        return newChord
    elif inversion == 3 and len(chord) >= 4:
        newChord = chord[3:]
        newChord.extend([i+12 for i in chord[0:3]])
        return newChord
    elif len(chord) <= 3:
        raise ValueError("Inversion must be integer between 0 and 2.")
    else:
        raise ValueError("Inversion must be integer between 0 and 3.")


# ---------------------------------------------------------------------
# helper function that checks that the key is a valid key
# ---------------------------------------------------------------------
def isValidKey(k):
    global majorKeys, minorKeys
    try:
        if "M" in k: k = k.replace("M", "", 1)
        if len(k) > 1: k ="{}{}".format(k[0].capitalize(), k[1:])
        else: k = k.capitalize()

        return k in majorKeys or k in minorKeys
    except:
        return False


# ---------------------------------------------------------------------
# changes global key, given a string; default is CMaj
# ---------------------------------------------------------------------
def changeKey(newKey):
    """
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
    """
    global key, majorKeys, minorKeys

    if isValidKey(newKey):
        key = newKey
    else:
        raise ValueError("Invalid key name {}.".format(newKey))

changeKey(home_key)
