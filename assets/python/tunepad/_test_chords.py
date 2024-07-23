#from boilerplate import *
#from ./chords import *
import unittest
import logging

'''

This is meant to be run when there have been changes to 
the tunepad.chords code.

It will NOT guarantee that functions return the correct
answer, but rather that the correct exceptions are 
being triggered when appropriate, otherwise the 
function runs to completion

Four changes have to be made when this file is run. 
They are included as comments prefaced with "TESTING:"
in the chords.py file.

'''

class TestChords(unittest.TestCase):
    def test_playChord(self):
        changeKey("C")
        # check if return value is None (meaning that no exceptions have triggered)
        self.assertEqual(playChord("I"), None)
        self.assertEqual(playChord("I", beats=1, velocity=100, sustain=1), None)
        self.assertEqual(playChord("I", beats=1.0, velocity=1, sustain=1.0), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="block"), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="arpeggio"), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="arpeggio_up"), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="arpeggio_down"), None)
        self.assertEqual(playChord("I", beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="rolled"), None)
        self.assertEqual(playChord([1,2], beats=0.0, velocity=0, sustain=0.0, inversion=0, octave=0, playType="block"), None)

        # check to see that specific exceptions have been triggered
        with self.assertRaises(TypeError):
            playChord("I", beats="")

        with self.assertRaises(ValueError):
            playChord("I", beats=-1)

        with self.assertRaises(TypeError):
            playChord("I", velocity=1.0)

        with self.assertRaises(ValueError):
            playChord("I", velocity=128)

        with self.assertRaises(ValueError):
            playChord("I", velocity=-1)

        with self.assertRaises(TypeError):
            playChord("I", sustain=[128])

        with self.assertRaises(ValueError):
            playChord("I", sustain=-1)

        with self.assertRaises(ValueError):
            playChord([1, [2]])

        with self.assertRaises(ValueError):
            playChord("I", playType="err")

        with self.assertRaises(ValueError):
            playChord("I", inversion=3)

        with self.assertRaises(TypeError):
            buildChord("I", octave="3", inversion=2)

        with self.assertRaises(ValueError):
            buildChord("Flerr+4", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("/", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("/V", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("VV/V", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("/VV", 3, inversion=2)

        


    def test_buildChord(self):
        major =  [48, 52, 55]
        major7 = [48, 52, 55, 59]
        minor =  [48, 51, 55]
        minor7 = [48, 51, 55, 58]

        changeKey("C")
        self.assertEqual(buildChord("I", 3), major)
        self.assertEqual(buildChord("I7", 3), major7)
        self.assertEqual(buildChord("V7/IV", 3), [48, 52, 55, 58])

        self.assertEqual(buildChord("It6", 3), [56, 60, 66])
        self.assertEqual(buildChord("It+6", 3), [56, 60, 66])
        self.assertEqual(buildChord("Ger6", 3), [56, 60, 62, 66])

        self.assertEqual(buildChord("Fr6", 3), [56, 60, 63, 66])
        self.assertEqual(buildChord("N6", 3), [53, 56, 63])

        changeKey("C#")
        self.assertEqual(buildChord("I", 3), [(x+1) for x in major])
        self.assertEqual(buildChord("I7", 3), [(x+1) for x in major7])
        self.assertEqual(buildChord("V7/IV", 3), [(x+1) for x in [48, 52, 55, 58]])

        changeKey("D")
        self.assertEqual(buildChord("I", 3), [(x+2) for x in major])
        self.assertEqual(buildChord("I7", 3), [(x+2) for x in major7])
        self.assertEqual(buildChord("V7/IV", 3), [(x+2) for x in [48, 52, 55, 58]])

        changeKey("Cm")
        self.assertEqual(buildChord("i", 3), minor)
        self.assertEqual(buildChord("isus2", 3), [48, 50, 55])
        self.assertEqual(buildChord("isus4", 3), [48, 53, 55])
        self.assertEqual(buildChord("isus7", 3), [48, 53, 55, 58])
        self.assertEqual(buildChord("i7", 3), minor7)
        self.assertEqual(buildChord("vii0", 3), [59, 62, 65])
        self.assertEqual(buildChord("VII", 3), [58, 62, 65])
        self.assertEqual(buildChord("v", 3), [55, 58, 62])
        self.assertEqual(buildChord("V", 3), [55, 59, 62])

        changeKey("C#m")
        self.assertEqual(buildChord("i", 3), [(x+1) for x in minor])
        self.assertEqual(buildChord("i7", 3), [(x+1) for x in minor7])
        self.assertEqual(buildChord("V7/iv", 3), [(x+1) for x in [48, 52, 55, 58]])
        

        with self.assertRaises(ValueError):
            buildChord("Ger6", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("Ger6", 3, inversion=2, line=2)

        with self.assertRaises(ValueError):
            buildChord("ii/iii", 3, inversion=2)

        with self.assertRaises(ValueError):
            buildChord("Ger6", "3", inversion=2)



    def test_buildScale(self):
        major = [48, 50, 52, 53, 55, 57, 59, 60]
        dorian = [48, 50, 51, 53, 55, 57, 58, 60]
        phrygian = [48, 49, 51, 53, 55, 56, 58, 60]
        lydian = [48, 50, 52, 54, 55, 57, 59, 60]
        mixolydian = [48, 50, 52, 53, 55, 57, 58, 60]
        minor = [48, 50, 51, 53, 55, 56, 58, 60]
        locrian = [48, 49, 51, 53, 54, 56, 58, 60]
        h_minor = [48, 50, 51, 53, 55, 56, 59, 60]
        diminished = [48, 50, 51, 53, 54, 56, 57, 59, 60]

        self.assertEqual(buildScale("C", 3, "major"), major)
        self.assertEqual(buildScale("C", 3, "major", "descending"), major[::-1])
        self.assertEqual(buildScale("C#", 3, "major"), [(e+1) for e in major])
        self.assertEqual(buildScale("C#", 2, "major"), [(e+1-12) for e in major])
        self.assertEqual(buildScale("D", 3, "major"), [(e+2) for e in major])
        self.assertEqual(buildScale("d", 3, "major"), [(e+2) for e in major])
        self.assertEqual(buildScale("D", 3, "ionian"), [(e+2) for e in major])
        self.assertEqual(buildScale("D", 3, "major"), [(e+2) for e in major])

        self.assertEqual(buildScale("C", 3, "dorian"), dorian)
        self.assertEqual(buildScale("C", 3, "dorian", "descending"), dorian[::-1])
        self.assertEqual(buildScale("C#", 3, "Dorian"), [(e+1) for e in dorian])
        self.assertEqual(buildScale("C#", 2, "DORIAN"), [(e+1-12) for e in dorian])
        self.assertEqual(buildScale("d", 2, "DORIAN"), [(e+2-12) for e in dorian])

        self.assertEqual(buildScale("C", 3, "phrygian"), phrygian)
        self.assertEqual(buildScale("C#", 3, "phrygian"), [(e+1) for e in phrygian])
        self.assertEqual(buildScale("C#", 2, "phrygian"), [(e+1-12) for e in phrygian])
        self.assertEqual(buildScale("d", 2, "phrygian"), [(e+2-12) for e in phrygian])

        self.assertEqual(buildScale("C", 3, "lydian"), lydian)
        self.assertEqual(buildScale("C#", 3, "lydian"), [(e+1) for e in lydian])
        self.assertEqual(buildScale("C#", 2, "lydian"), [(e+1-12) for e in lydian])
        self.assertEqual(buildScale("d", 2, "lydian"), [(e+2-12) for e in lydian])

        self.assertEqual(buildScale("C", 3, "mixolydian"), mixolydian)
        self.assertEqual(buildScale("C#", 3, "mixolydian"), [(e+1) for e in mixolydian])
        self.assertEqual(buildScale("C#", 2, "mixolydian"), [(e+1-12) for e in mixolydian])
        self.assertEqual(buildScale("d", 2, "mixolydian"), [(e+2-12) for e in mixolydian])

        self.assertEqual(buildScale("C", 3, "minor"), minor)
        self.assertEqual(buildScale("C#", 3, "minor"), [(e+1) for e in minor])
        self.assertEqual(buildScale("C#", 2, "minor"), [(e+1-12) for e in minor])
        self.assertEqual(buildScale("d", 2, "minor"), [(e+2-12) for e in minor])

        self.assertEqual(buildScale("C", 3, "locrian"), locrian)
        self.assertEqual(buildScale("C#", 3, "locrian"), [(e+1) for e in locrian])
        self.assertEqual(buildScale("C#", 2, "locrian"), [(e+1-12) for e in locrian])
        self.assertEqual(buildScale("d", 2, "locrian"), [(e+2-12) for e in locrian])

        self.assertEqual(buildScale("C", 3, "harmonic minor"), h_minor)
        self.assertEqual(buildScale("C#", 3, "harmonic minor"), [(e+1) for e in h_minor])
        self.assertEqual(buildScale("C#", 2, "harmonic minor"), [(e+1-12) for e in h_minor])
        self.assertEqual(buildScale("d", 2, "harmonic minor"), [(e+2-12) for e in h_minor])

        self.assertEqual(buildScale("C", 3, "whole tone"), list(range(48, 61, 2)))
        self.assertEqual(buildScale("C#", 3, "whole tone"), [(e+1) for e in list(range(48, 61, 2))])
        self.assertEqual(buildScale("C#", 2, "whole tone"), [(e+1-12) for e in list(range(48, 61, 2))])
        self.assertEqual(buildScale("d", 2, "whole tone"), [(e+2-12) for e in list(range(48, 61, 2))])

        self.assertEqual(buildScale("C", 3, "diminished"), diminished)
        self.assertEqual(buildScale("C#", 3, "diminished"), [(e+1) for e in diminished])
        self.assertEqual(buildScale("C#", 2, "diminished"), [(e+1-12) for e in diminished])
        self.assertEqual(buildScale("d", 2, "diminished"), [(e+2-12) for e in diminished])

        self.assertEqual(buildScale("D", 3, "chromatic"), list(range(50, 63)))

        with self.assertRaises(ValueError):
            buildScale("tm", 3, "major")

        with self.assertRaises(TypeError):
            buildScale("C", "e", "major")

        with self.assertRaises(ValueError):
            buildScale("C", 3, "malort")

        with self.assertRaises(ValueError):
            buildScale("C", 3, "major", "AHH!")


    def test_chordInversionUtil(self):
        self.assertEqual(chordInversionUtil([0,1,2], 0), [0,1,2])
        self.assertEqual(chordInversionUtil([0,1,2], 1), [1,2,12])
        self.assertEqual(chordInversionUtil([0,1,2], 2), [2, 12, 13])
        self.assertEqual(chordInversionUtil([0,1,2,3], 3), [3, 12, 13, 14])

        with self.assertRaises(ValueError):
            chordInversionUtil([0,1,2], 3)

        with self.assertRaises(ValueError):
            chordInversionUtil([0,1,2,3], 4)

    def test_isValidKey(self):
        self.assertTrue(isValidKey("C"))
        self.assertTrue(isValidKey("C#"))
        self.assertTrue(isValidKey("Cm"))
        self.assertTrue(isValidKey("C#m"))
        self.assertTrue(isValidKey("CM"))
        self.assertTrue(isValidKey("cm"))
        self.assertTrue(isValidKey("c#m"))
        self.assertTrue(isValidKey("c#"))
        self.assertTrue(isValidKey("f#m"))
        self.assertTrue(isValidKey("F#m"))
        self.assertTrue(isValidKey("Eb"))
        self.assertTrue(isValidKey("EbM"))

        self.assertFalse(isValidKey("Cbm"))
        self.assertFalse(isValidKey("Ebb"))
        self.assertFalse(isValidKey("EbMM"))
        self.assertFalse(isValidKey("Ebmm"))
        self.assertFalse(isValidKey("Wm"))
        self.assertFalse(isValidKey(""))
        self.assertFalse(isValidKey([]))
        self.assertFalse(isValidKey("1"))

    def test_changeKey(self):
        self.assertEqual(changeKey("C"), None)
        self.assertEqual(changeKey("C#"), None)
        self.assertEqual(changeKey("Cm"), None)
        self.assertEqual(changeKey("C#m"), None)
        self.assertEqual(changeKey("CM"), None)
        self.assertEqual(changeKey("cm"), None)
        self.assertEqual(changeKey("c#m"), None)
        self.assertEqual(changeKey("c#"), None)
        self.assertEqual(changeKey("f#m"), None)
        self.assertEqual(changeKey("F#m"), None)
        self.assertEqual(changeKey("Eb"), None)
        self.assertEqual(changeKey("EbM"), None)
        
        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("Cbm"))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("Ebb"))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("EbMM"))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("Ebmm"))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("Wm"))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey(""))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey(" "))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey([]))

        with self.assertRaises(ValueError):
            self.assertFalse(changeKey("1"))


    def test_transpose(self):
        pitches = [30, 35, 44]

        self.assertEqual(transpose(transpose(pitches, "C", "D"), "D", "C"), pitches)
        self.assertEqual(transpose(pitches, "C", "D"), [(x+2) for x in pitches])
        self.assertEqual(transpose(pitches, "C", "Eb"), [(x+3) for x in pitches])
        self.assertEqual(transpose(pitches, "C", "C#"), [(x+1) for x in pitches])
        self.assertEqual(transpose(pitches, "C", "C"), pitches)
        self.assertEqual(transpose(pitches, "c", "cm"), pitches)
        self.assertEqual(transpose(pitches, "cM", "cm"), pitches)
        self.assertEqual(transpose(pitches, "cM", "cm", [3]), pitches)
        self.assertEqual(transpose(pitches, "cM", "cm", [4]), [(x+12) for x in pitches])

        with self.assertRaises(ValueError):
            transpose(pitches, "Z", "cm")

        with self.assertRaises(ValueError):
            transpose(pitches, "cm", "Z")

        with self.assertRaises(TypeError):
            transpose(pitches, "D", "C", "3")
    

if __name__ == '__main__':
    unittest.main()