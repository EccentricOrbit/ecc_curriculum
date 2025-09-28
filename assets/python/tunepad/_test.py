from . import *
import unittest
import logging

'''

This is meant to be run when there have been changes to 
the boilerplate code.

It will NOT guarantee that functions return the correct
answer, but rather that the correct exceptions are 
being triggered when appropriate, otherwise the 
function runs to completion

'''

class TestBoilerplate(unittest.TestCase):
    def test_playNote(self):
        # check if return value is None (meaning that no exceptions have triggered)
        self.assertEqual(playNote(1), None)
        self.assertEqual(playNote(1, beats=1, velocity=100, sustain=1), None)
        self.assertEqual(playNote(1.0, beats=1.0, velocity=1, sustain=1.0), None)
        self.assertEqual(playNote(0.0, beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playNote([1, 2], beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playNote(None, beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playNote([1, 2, None], beats=0.0, velocity=0, sustain=0.0), None)

        # check to see that specific exceptions have been triggered
        with self.assertRaises(TypeError):
            playNote(1, beats="")

        with self.assertRaises(ValueError):
            playNote(1, beats=-1)

        with self.assertRaises(TypeError):
            playNote(1, velocity=1.0)

        with self.assertRaises(ValueError):
            playNote(1, velocity=128)

        with self.assertRaises(ValueError):
            playNote(1, velocity=-1)

        with self.assertRaises(TypeError):
            playNote(1, sustain=[128])

        with self.assertRaises(ValueError):
            playNote(1, sustain=-1)

        with self.assertRaises(TypeError):
            playNote([1, [2]])
    
    def test_playSound(self):
        self.assertEqual(playSound(1), None)
        self.assertEqual(playSound(1, beats=1, velocity=100, sustain=1, pitch=1), None)
        self.assertEqual(playSound(1, beats=1.0, velocity=1, sustain=1.0), None)
        self.assertEqual(playSound(1, beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playSound([1, 2], beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playSound(None, beats=0.0, velocity=0, sustain=0.0), None)
        self.assertEqual(playSound([1, 2, None], beats=0.0, velocity=0, sustain=0.0), None)

        with self.assertRaises(TypeError):
            playSound(1, beats="")

        with self.assertRaises(ValueError):
            playSound(1, beats=-1)

        with self.assertRaises(TypeError):
            playSound(1, pitch="err")

        with self.assertRaises(TypeError):
            playSound(1, velocity=1.0)

        with self.assertRaises(ValueError):
            playSound(1, velocity=128)

        with self.assertRaises(ValueError):
            playSound(1, velocity=-1)

        with self.assertRaises(TypeError):
            playSound(1, sustain=[128])

        with self.assertRaises(ValueError):
            playSound(1, sustain=-1)

        with self.assertRaises(TypeError):
            playSound([1, [2]])
    
    def test_rest(self):
        self.assertEqual(rest(1), None)
        self.assertEqual(rest(1.0), None)
        self.assertEqual(rest(0.0), None)
        self.assertEqual(rest(0), None)

        with self.assertRaises(TypeError):
            rest("")
        
        with self.assertRaises(TypeError):
            rest([1])

        with self.assertRaises(ValueError):
            rest(-1)

        with self.assertRaises(ValueError):
            rest(-1.0)



    def test_moveTo(self):
        self.assertEqual(moveTo(1), None)
        self.assertEqual(moveTo(1.0), None)
        self.assertEqual(moveTo(0.0), None)
        self.assertEqual(moveTo(0), None)

        with self.assertRaises(TypeError):
            moveTo("")
        
        with self.assertRaises(TypeError):
            moveTo([1])

        with self.assertRaises(ValueError):
            moveTo(-1)

        with self.assertRaises(ValueError):
            moveTo(-1.0)


    def test_fastForward(self):
        self.assertEqual(fastForward(1), None)
        self.assertEqual(fastForward(1.0), None)
        self.assertEqual(fastForward(-1.0), None)
        self.assertEqual(fastForward(0.0), None)
        self.assertEqual(fastForward(0), None)

        with self.assertRaises(TypeError):
            fastForward("")
        
        with self.assertRaises(TypeError):
            fastForward([1])

        with self.assertRaises(ValueError):
            fastForward(-100)


    def test_rewind(self):
        self.assertEqual(rewind(-10), None)
        self.assertEqual(rewind(1.0), None)
        self.assertEqual(rewind(-1.0), None)
        self.assertEqual(rewind(0.0), None)
        self.assertEqual(rewind(0), None)

        with self.assertRaises(TypeError):
            rewind("")
        
        with self.assertRaises(TypeError):
            rewind([1])

        with self.assertRaises(ValueError):
            rewind(100)

    def test_bend(self):
        # check that returns True (meaing an object has been returned)
        self.assertTrue(bend(0))
        self.assertTrue(bend(12))
        self.assertTrue(bend(-12))
        self.assertTrue(bend(2.0))
        self.assertTrue(bend(0, 0, 0))
        self.assertTrue(bend(0, 0.0))
        self.assertTrue(bend(0, 1.0))
        self.assertTrue(bend(0, 1.0, 1.0))
        self.assertTrue(bend(0, 0))
        self.assertTrue(bend([1,2], 0))

        with self.assertRaises(TypeError):
            bend(0, "beats")

        with self.assertRaises(ValueError):
            bend(0, -1)

        with self.assertRaises(ValueError):
            bend(0, -1.0)

        with self.assertRaises(TypeError):
            bend(0, None, "start")

        with self.assertRaises(ValueError):
            bend(0, 1.0, -1)

        with self.assertRaises(TypeError):
            bend(0, None, [1])

        with self.assertRaises(TypeError):
            bend([""], None, 0)

        with self.assertRaises(TypeError):
            bend("", None, 0)
        


        return

    def test_pan(self):
        self.assertTrue(pan(0))
        self.assertTrue(pan(1))
        self.assertTrue(pan(-1))
        self.assertTrue(pan(1.0))
        self.assertTrue(pan(-1.0))
        self.assertTrue(pan(0, 0, 0))
        self.assertTrue(pan(0, 0.0))
        self.assertTrue(pan(0, 1.0))
        self.assertTrue(pan(0, 1.0, 1.0))
        self.assertTrue(pan(0, None, 0))
        self.assertTrue(pan([1,-1], None, 0))

        with self.assertRaises(TypeError):
            pan(0, "beats")

        with self.assertRaises(ValueError):
            pan(0, -1)

        with self.assertRaises(ValueError):
            pan(0, -1.0)

        with self.assertRaises(ValueError):
            pan(0, 1.0, -1)

        with self.assertRaises(TypeError):
            pan(0, None, "start")

        with self.assertRaises(TypeError):
            pan(0, None, [1])

        with self.assertRaises(TypeError):
            pan([""], None, 0)

        with self.assertRaises(TypeError):
            pan("", None, 0)


    def test_gain(self):
        self.assertTrue(gain(0))
        self.assertTrue(gain(1))
        self.assertTrue(gain(1.0))
        self.assertTrue(gain(0, 0, 0))
        self.assertTrue(gain(0, 0.0))
        self.assertTrue(gain(0, 1.0))
        self.assertTrue(gain(0, 1.0, 1.0))
        self.assertTrue(gain(0, None, 0))
        self.assertTrue(gain([0.5, 2], None, 0))

        with self.assertRaises(TypeError):
            gain(0, "beats")

        with self.assertRaises(ValueError):
            gain(0, -1)

        with self.assertRaises(ValueError):
            gain(0, -1.0)

        with self.assertRaises(TypeError):
            gain(0, None, "start")

        with self.assertRaises(ValueError):
            gain(0, 1.0, -1)

        with self.assertRaises(TypeError):
            gain(0, None, [1])

        with self.assertRaises(TypeError):
            gain([""], None, 0)

        with self.assertRaises(TypeError):
            gain("", None, 0)


    def test_lowpass(self):
        self.assertTrue(lowpass(1))
        self.assertTrue(lowpass(1))
        self.assertTrue(lowpass(1.0))
        self.assertTrue(lowpass(1, 0, 0))
        self.assertTrue(lowpass(1, 0.0))
        self.assertTrue(lowpass(1, 1.0))
        self.assertTrue(lowpass(1, 1.0, 1.0))
        self.assertTrue(lowpass(1, None, 0))
        self.assertTrue(lowpass([0.5, 2], None, 0))

        with self.assertRaises(TypeError):
            lowpass(1, beats="beats")

        with self.assertRaises(ValueError):
            lowpass(1, beats=-1)

        with self.assertRaises(ValueError):
            lowpass(1, beats=-1.0)

        with self.assertRaises(TypeError):
            lowpass(1, beats=None, start="start")

        with self.assertRaises(ValueError):
            lowpass(1, beats=1.0, start=-1)

        with self.assertRaises(TypeError):
            lowpass(1, beats=None, start=[1])

        with self.assertRaises(TypeError):
            lowpass([""], beats=None, start=0)

        with self.assertRaises(TypeError):
            lowpass("", beats=None, start=0)

    def test_highpass(self):
        self.assertTrue(highpass(1))
        self.assertTrue(highpass(1))
        self.assertTrue(highpass(1.0))
        self.assertTrue(highpass(1, 0, 0))
        self.assertTrue(highpass(1, 0.0))
        self.assertTrue(highpass(1, 1.0))
        self.assertTrue(highpass(1, 1.0, 1.0))
        self.assertTrue(highpass(1, None, 0))
        self.assertTrue(highpass([0.5, 2], None, 0))

        with self.assertRaises(TypeError):
            highpass(1, beats="beats")

        with self.assertRaises(ValueError):
            highpass(1, beats=-1)

        with self.assertRaises(ValueError):
            highpass(1, beats=-1.0)

        with self.assertRaises(TypeError):
            highpass(1, beats=None, start="start")

        with self.assertRaises(ValueError):
            highpass(1, beats=1.0, start=-1)

        with self.assertRaises(TypeError):
            highpass(1, beats=None, start=[1])

        with self.assertRaises(TypeError):
            highpass([""], beats=None, start=0)

        with self.assertRaises(TypeError):
            highpass("", beats=None, start=0)

    def test_bandpass(self):
        self.assertTrue(bandpass(1))
        self.assertTrue(bandpass(1))
        self.assertTrue(bandpass(1.0))
        self.assertTrue(bandpass(1, 0, 0))
        self.assertTrue(bandpass(1, 0.0))
        self.assertTrue(bandpass(1, 1.0))
        self.assertTrue(bandpass(1, 1.0, 1.0))
        self.assertTrue(bandpass(1, None, 0))
        self.assertTrue(bandpass([0.5, 2], None, 0))

        with self.assertRaises(TypeError):
            bandpass(1, beats="beats")

        with self.assertRaises(ValueError):
            bandpass(1, beats=-1)

        with self.assertRaises(ValueError):
            bandpass(1, beats=-1.0)

        with self.assertRaises(TypeError):
            bandpass(1, beats=None, start="start")

        with self.assertRaises(ValueError):
            bandpass(1, beats=1.0, start=-1)

        with self.assertRaises(TypeError):
            bandpass(1, beats=None, start=[1])

        with self.assertRaises(TypeError):
            bandpass([""], beats=None, start=0)

        with self.assertRaises(TypeError):
            bandpass("", beats=None, start=0)
    
    def test_notch(self):
        self.assertTrue(notch(1))
        self.assertTrue(notch(1))
        self.assertTrue(notch(1.0))
        self.assertTrue(notch(1, 0, 0))
        self.assertTrue(notch(1, 0.0))
        self.assertTrue(notch(1, 1.0))
        self.assertTrue(notch(1, 1.0, 1.0))
        self.assertTrue(notch(1, None, 0))
        self.assertTrue(notch([0.5, 2], None, 0))

        with self.assertRaises(TypeError):
            notch(1, beats="beats")

        with self.assertRaises(ValueError):
            notch(1, beats=-1)

        with self.assertRaises(ValueError):
            notch(1, beats=-1.0)

        with self.assertRaises(TypeError):
            notch(1, beats=None, start="start")

        with self.assertRaises(ValueError):
            notch(1, beats=1.0, start=-1)

        with self.assertRaises(TypeError):
            notch(1, beats=None, start=[1])

        with self.assertRaises(TypeError):
            notch([""], beats=None, start=0)

        with self.assertRaises(TypeError):
            notch("", beats=None, start=0)

    def test_misc(self):
        self.assertEqual(synthPatch(1), None)

        with self.assertRaises(TypeError):
            synthPatch("one")

        with self.assertRaises(TypeError):
            synthPatch([1])
            
        self.assertEqual(stop(), None)
        self.assertEqual(trace(1), None)


if __name__ == '__main__':
    unittest.main()