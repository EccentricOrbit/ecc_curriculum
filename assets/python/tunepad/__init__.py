"""
The `tunepad` module contains the basic functions for creating music.
The module is automatically imported into every TunePad cell.
"""
from math import floor
from inspect import getframeinfo, stack
import sys, traceback


beats_per_measure = 4
home_key = 'C'

_playhead = 0.0     # gets advanced for every playNote and rest
_tunepad_trace = [] # trace is stored here for tunepad to generate audio
_trace_id = 0



#---------------------------------------------------------------------
# reset globals
#---------------------------------------------------------------------
def start_tunepad_trace():
    global _playhead, _tunepad_trace, beats_per_measure, home_key, _trace_id
    _playhead = 0.0
    _tunepad_trace = [ ]
    beats_per_measure = 4
    home_key = 'C'
    _trace_id = 0
    sys.stdout.flush()


def playNote(note, beats=1, velocity = 90, sustain = 0):
    """
    Play a note with a pitch value greater than 0. You can also call `playNote` with a list of 
    notes that will be played at the same time. The optional parameter `beats` sets how long the 
    note will last, and the optional `velocity` parameter sets how hard/loud the note sounds. 
    Velocity can be any number between 0 and 127. The optional `sustain` parameter allows a 
    note to ring out longer than the value given by the beats parameter. The value of the parameter 
    is the number of beats the note should sustain in beats.

    Examples:
    ```python
    playNote(32)
    playNote(55, beats = 0.5)
    playNote(0, beats = 2, velocity = 80)
    playNote(0, beats = 2, velocity = 80, sustain = 2)
    playNote([36, 40, 43])
    playNote([36, 40, 43], beats = 2)
    ```

    Parameters:
        note (int, float, list): the note or notes to play
        beats (float, optional): how long to play (default value is 1)
        velocity (int, float, optional): how hard/loud the note sounds
        sustain (float, optional): how long to sustain the note


    Notes:
        You can also use `play_note()` and `play()` instead of `playNote()`.
    """
    global _playhead, _trace_id

    # generate debug information for step-by-step tracing
    caller = getframeinfo(stack()[1][0])
    line = caller.lineno

    def check_notes(n):
        if not n: return True
        elif type(n) in [int, float] and n >= 0 and n <= 127: return True
        else: return False


    ## check inputs
    if type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats' on line {}. Must be int or float.".format(line))
    if beats < 0: raise ValueError("Invalid value for 'beats' on line {}. Beats must be non-negative int or float.".format(line))

    if type(velocity) not in [int, float]: raise TypeError("Invalid type for 'velocity' on line {}. Must be numeric value in range [0, 127].".format(line))
    if not(velocity >= 0 and velocity <= 127): raise ValueError("Invalid value for 'velocity' on line {}. Velocity must be numeric value in range [0, 127].".format(line))

    if type(sustain) not in [int, float]: raise TypeError("Invalid type for 'sustain' on line {}. Must be int or float.".format(line))
    if sustain < 0: raise ValueError("Invalid value for 'sustain' on line {}. Sustain must be non-negative int or float.".format(line))

    if type(note) is not list: note = [ note ]
    if type(note) is list and not all(check_notes(x) for x in note):
        raise TypeError("Invalid type for 'note' on line {}. Must be int/float or list of int/float in range [0, 127].".format(line))


    params = { 
        "velocity" : velocity, 
        "sustain" : sustain,
        "line" : line,
        "trace" : _trace_id
    }
    for n in note:
        params['note'] = n
        if n is None:
            _tunepad_event("rest", _playhead, duration = beats, params = params)
        else:
            _tunepad_event("play", _playhead, duration = beats, params = params)

    _playhead = _check_playhead(_playhead) + beats
    _trace_id += 1


play_note = playNote

play = playNote

#---------------------------------------------------------------------
# plays a custom recorded sample or sound (by sound ID number)
#---------------------------------------------------------------------
def playSound(sound, beats=1, pitch = 0, velocity = 90, sustain = 0):
    """
    Play a custom sound using its ID number. You can also call `playSound` with a list of 
    sounds that will be played at the same time. The optional parameter `beats` sets how 
    long the note will last, and the optional parameter `velocity` sets how hard/loud the 
    note sounds. Velocity can be any number between 0 and 127. The optional `pitch` parameter 
    changes the pitch of the sound by the given number of semi-tones. For example, a pitch 
    value of 3.0 would be the same as the difference from a C to a D♯ on the piano keyboard. 
    The optional `sustain` parameter allows a note to ring out longer than the value given 
    by the `beats` parameter. The value of the parameter is the number of beats the note 
    should sustain in beats.

    Examples:
    ```python
    playSound(1203)
    playSound(1203, beats = 0.5, velocity = 20)
    playSound(1203, beats = 0.5, velocity = 20, sustain = 4)
    playSound(1203, beats = 2, pitch = 3, velocity = 80)
    playSound([1203, 559, 43])
    ```

    Parameters:
        sound (int): the sound ID number
        beats (float, optional): how long to play (default value is 1)
        pitch (int, float): change the pitch of the sound by the given number of semi-tones
        velocity (int, float, optional): how hard/loud the note sounds
        sustain (float, optional): how long to sustain the note
    """
    global _playhead, _trace_id

    # generate debug information for step-by-step tracing
    caller = getframeinfo(stack()[1][0])
    line = caller.lineno

    def check_notes(n):
        if not n: return True
        elif type(n) in [int]: return True
        else: return False

    ## check inputs
    if type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats' on line {}. Must be int or float.".format(line))
    if beats < 0: raise ValueError("Invalid value for 'beats' on line {}. Beats must be non-negative int or float.".format(line))

    if type(velocity) not in [int, float]: raise TypeError("Invalid type for 'velocity' on line {}. Must be numeric value in range [0, 127].".format(line))
    if not (velocity >= 0 and velocity <= 127): raise ValueError("Invalid value for 'velocity' on line {}. Velocity must be numeric value in range [0, 127].".format(line))

    if type(sustain) not in [int, float]: raise TypeError("Invalid type for 'sustain' on line {}. Must be int or float.".format(line))
    if sustain < 0: raise ValueError("Invalid value for 'sustain' on line {}. Sustain must be non-negative int or float.".format(line))

    if type(pitch) not in [int, float]: raise TypeError("Invalid type for 'pitch' on line {}. Must be int or float.".format(line))

    if type(sound) is not list: sound = [ sound ]
    if type(sound) is list and not all(check_notes(x) for x in sound):
        raise TypeError("Invalid type for 'sound' on line {}. Must be int or list of int.".format(line))

    ##

    unadjustedPlayhead = _playhead
    unadjustedBeats = beats

    params = { 
        "pitch" : pitch, 
        "velocity" : velocity, 
        "sustain" : sustain,
        "line" : line,
        "trace" : _trace_id
    }
    for s in sound:
        params['sound'] = s
        _tunepad_event("sound", _playhead, duration = beats, params = params)


    _playhead = unadjustedPlayhead
    _playhead = _check_playhead(_playhead)
    _playhead += unadjustedBeats
    _trace_id += 1


#---------------------------------------------------------------------
# pause playback for a period of time
#---------------------------------------------------------------------
def rest(beats=1):
    """
    Add a pause between notes. The length of the pause can be set using the optional `beats` parameter.
    ```python
    rest()    # rest for 1 beat
    rest(2)
    rest(beats = 1.5)
    ```
    """
    global _playhead, _trace_id

    # generate debug information for step-by-step tracing
    caller = getframeinfo(stack()[1][0])
    line = caller.lineno

    if type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats' on line {}. Must be int or float.".format(line))
 
    params = { "line" : line, "trace" : _trace_id }
    _tunepad_event("rest", _playhead, duration = beats, params = params)

    _playhead = _check_playhead(_playhead) + beats
    _trace_id += 1


#---------------------------------------------------------------------
# move the playhead to the given time (beats)
#---------------------------------------------------------------------
def _moveTo(beats, line):
    global _playhead, _trace_id

    if type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats' on line {}. Must be int or float.".format(line))

    beats = round(beats, 5)
    if (beats < 0): beats = 0.0

    params = {
        "line" : line,
        "trace" : _trace_id
    }

    _tunepad_event("moveTo", beats, params = params)
    _playhead = beats
    _trace_id += 1

#---------------------------------------------------------------------
# adjust the playhead position
#---------------------------------------------------------------------
def moveTo(beats):
    """
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
    """
    caller = getframeinfo(stack()[1][0])
    _moveTo(beats, caller.lineno)

def rewind(beats):
    """
    Moves the playhead backward in time by an amount relative to its current position. 
    This can be a useful way to play multiple notes at the same time. The `beats`
    parameter specifies the number of beats to move the playhead. Negative values of 
    `beats` move the playhead forward.
    ```python
    rewind(1)
    rewind(-2)
    rewind(0.5)
    ```
    """
    caller = getframeinfo(stack()[1][0])
    _moveTo(_playhead - beats, caller.lineno)

def fastForward(beats):
    """
    Moves the playhead forward in time by an amount relative to its current position. 
    This can be a useful way to play multiple notes at the same time. The `beats` parameter 
    specifies the number of beats to move the playhead. Negative values of `beats` move the 
    playhead backward.
    ```python
    fastForward(1.5)
    fastForward(-2)
    ```
    """
    caller = getframeinfo(stack()[1][0])
    _moveTo(_playhead + beats, caller.lineno)


#---------------------------------------------------------------------
# return current position of the playhead as float
#---------------------------------------------------------------------
def getPlayhead():
    """
    Returns the current value of the playhead as a float. This value is
    zero-indexed, so the first beat will be zero rather than one.
    ```python
    getPlayhead() # returns 0.0
    playNote(0, beats = 1)
    getPlayhead() # returns 1.0
    ```
    """
    return _playhead

#---------------------------------------------------------------------
# return current tunepad trace list
#---------------------------------------------------------------------
def getTrace():
    return _tunepad_trace

#---------------------------------------------------------------------
# return current beat (based on global time sig) as float
#---------------------------------------------------------------------
def getBeat():
    """
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
    """
    return getPlayhead() % beats_per_measure

#---------------------------------------------------------------------
# return current measure (based on global time sig) as int
#---------------------------------------------------------------------
def getMeasure():
    """
    Returns an integer of the value of the current measure. This value is 
    zero-indexed, therefore the first measure will be zero rather than one.
    ```python
    getMeasure() # returns 0
    playNote(0, beats = 4)
    getMeasure() # returns 1
    ```
    """
    return int(getPlayhead() // beats_per_measure)


#---------------------------------------------------------------------
# dynamic effect superclass
#
#    The constructor expects the following parameters
#       * name: The name of the effect or filter (e.g. "lowpass")
#
#       * beats: The duration of the effect in beats. If this parameter
#         is omitted, the effect will not be dynamic.
#
#       * start: An optional start time (how long to wait) before the
#         effect will be applied (in beats). 0 means start immediately
#
#       * Additional parameters passed to the effect. Each parameter can
#         be a single numeric value, an array of values to define
#         change over time, or a function that returns a value given an
#         elapsed time parameter (in beats)
#---------------------------------------------------------------------
class effect(object):
    def __init__(self, name, beats=-1, start=0, *argv):
        self.name = name
        self.beats = beats
        self.start = start
        self.values = [ ]
        for arg in argv: self.values.append(arg)

    def __enter__(self):
        params = { }
        params['effect'] = self.name
        params['beats'] = self.beats
        params['start'] = self.start + _playhead
        params['values'] = [ ]
        for p in self.values:
            value = [ ]
            if callable(p):
                t = 0
                while t < self.beats and t < 100:  # FIXME: should this be capped at 100 or higher?
                    value.append(p(t))
                    t += 1/16.0
            else:
                value = p
            params['values'].append(value)
        _tunepad_event('push_fx', _playhead, params = params)
        return self.beats

    def __exit__(self, type, value, traceback):
        _tunepad_event('pop_fx', _playhead)



#---------------------------------------------------------------------
# reverb effect
#---------------------------------------------------------------------
class reverb(effect):
    def __init__(self, impulse = "Hall", wet = 1.0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and (n >= 0.0 and n <= 1.0): return True
            else: return False

        if type(impulse) not in [str]: raise TypeError("Invalid type for 'impulse'. Must be string.")
        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(wet) is not list: wet = [wet]
        if type(wet) is list and not all(check_notes(x) for x in wet): raise TypeError("Invalid type for 'wet'. Must be int or float in range 0.0 to 1.0.")


        transformedImpulse = filter(str.isalnum, impulse).lower()
        effect.__init__(self, "reverb", beats, start, transformedImpulse, wet)


#---------------------------------------------------------------------
# transpose effect
#---------------------------------------------------------------------
class transpose(effect):
    """
    TunePad effect that shifts the pitch of a section of music by a constant amount. 
    This is equivalent to adding or subtracting a constant number from the note parameter 
    of playNote. The `steps` parameter represents the change in pitch. One step moves up
    one note value. Using a value of 12 for the steps parameter would shift every note up 
    by an octave.

    Examples:
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

    Parameters:
        steps (int, float): how many steps to transpose a section of music
    """
    def __init__(self, steps=0):
        if type(steps) not in [int, float]: raise TypeError("Invalid type for 'steps'. Must be int or float.")

        effect.__init__(self, "bend", -1, 0, (steps*100))


#---------------------------------------------------------------------
# pitch bend effect
#---------------------------------------------------------------------
class bend(effect):
    """
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

    Examples:
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

    Parameters:
        cents (int, float, list): how much to bend the note (in cents)
        beats (float, optional): how long it takes to bend the note
        start (int, float, optional): how long to wait in beats before starting the effect
    """
    def __init__(self, cents=0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float]: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if callable(cents): pass
        elif type(cents) is not list:
            cents = [cents]
            if type(cents) is list and not all(check_notes(x) for x in cents): raise TypeError("Invalid type for 'cents'. Must be int or float.")


        effect.__init__(self, "bend", beats, start, cents)

#---------------------------------------------------------------------
# pan effect
#---------------------------------------------------------------------
class pan(effect):
    """
    Applies a stereo pan effect, shifting the sound more towards the left or right speaker. 
    The `value` parameter ranges from -1.0 (full left speaker) to 1.0 (full right speaker). 
    A value of 0.0 evenly splits the sound. If a single number is provided, the effect will 
    be constant—there will be no change over time. You can also pass a list of numbers to 
    create a change over time. Each number will be evenly distributed over the duration of 
    the effect given by the `beats` parameter. An optional `start` parameter specifies how 
    long to wait (in beats) before starting the effect.

    Example:
    ```python
    # slowly pan from the left speaker to the right over three beats
    with pan(value = [-1.0, 1.0], beats = 3):
        playNote(35, beats = 3)
    ```

    Parameters:
        value (int, float, list): how much to pan the note (-1.0 to 1.0)
        beats (float, optional): how long it takes to pan the note
        start (int, float, optional): how long to wait in beats before starting the effect
    """
    def __init__(self, value=0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= -1.0 and n <= 1.0: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(value) is not list: value = [value]
        if type(value) is list and not all(check_notes(x) for x in value): raise TypeError("Invalid type for 'value'. Must be int or float in range [-1.0, 1.0].")


        effect.__init__(self, "pan", beats, start, value)

#---------------------------------------------------------------------
# gain effect
#---------------------------------------------------------------------
class gain(effect):
    """
    This TunePad effect changes the volume of notes. The `value` parameter represents 
    the change in volume (for example a value of 0.5 would reduce the volume by 50%). 
    If a single number is provided, a constant change in volume will be applied—there 
    will be no change over time. You can also pass a list of numbers to create a change 
    over time. Each number will be evenly distributed over the duration of the effect 
    given by the `beats` parameter. An optional `start` parameter specifies how long 
    to wait (in beats) before starting the effect.

    Examples:
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

    Parameters:
        value (int, float, list): how much to change the volume (1.0 means no change, 0.0 means silent)
        beats (float, optional): duration of the effect
        start (int, float, optional): how long to wait in beats before starting the effect
    """
    def __init__(self, value=0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= 0: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(value) is not list: value = [value]
        if type(value) is list and not all(check_notes(x) for x in value): raise TypeError("Invalid type for 'value'. Must be int or float.")


        effect.__init__(self, "gain", beats, start, value)

#---------------------------------------------------------------------
# standard filters
#---------------------------------------------------------------------
class lowpass(effect):
    """
    Applies a lowpass filter effect that reduces the energy of high frequency 
    sounds while leaving low frequency sounds below a cutoff point unaffected. 
    The `frequency` parameter specifies the cutoff frequency for the effect 
    (between 10 Hz and 22 kHz). You can also pass a list of numbers to create a 
    change over time. Each number will be evenly distributed over the duration of 
    the effect given by the `beats` parameter. An optional `start` parameter 
    specifies how long to wait (in beats) before starting the effect.

    Examples:
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

    Parameters:
        frequency (int, float, list): cutoff frequency (default is 1000)
        Q (int, float, list, optional): resonance of the filter (default is 2.0)
        beats (int, float, optional): duration of the effect
        start (int, float, optional): how long to wait in beats before starting the effect    
    """
    def __init__(self, frequency=1000, Q=2.0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= 0: return True
            else: return False


        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(frequency) is not list: frequency = [frequency]
        if type(frequency) is list and not all(check_notes(x) for x in frequency): raise TypeError("Invalid type for 'frequency'. Must be int or float.")


        effect.__init__(self, "lowpass", beats, start, frequency, Q)

class highpass(effect):
    """
    The highpass filter reduces the energy of low frequency sounds while allowing frequencies
    above the cutoff point to pass through unaltered. The `frequency` parameter specifies the 
    cutoff frequency for the effect (between 10 Hz and 22 kHz). You can also pass a list of 
    numbers to create a change over time. Each number will be evenly distributed over the 
    duration of the effect specified by the `beats` parameter. An optional `start` parameter 
    specifies how long to wait (in beats) before starting the effect.
    """
    def __init__(self, frequency=3000, Q=2.0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= 0: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(frequency) is not list: frequency = [frequency]
        if type(frequency) is list and not all(check_notes(x) for x in frequency): raise TypeError("Invalid type for 'frequency'. Must be int or float.")


        effect.__init__(self, "highpass", beats, start, frequency, Q)

class bandpass(effect):
    """
    The bandpass filter allows frequencies near the cutoff point to pass through unaltered 
    while reducing the energy of frequencies above and below. The `frequency` parameter 
    specifies the cutoff frequency for the effect (between 10 Hz and 22 kHz). You can also 
    pass a list of numbers to create a change over time. Each number will be evenly 
    distributed over the duration of the effect specified by the `beats` parameter. An 
    optional `start` parameter specifies how long to wait (in beats) before starting the effect.

    Example:
    ```python
    # carving out frequencies for a clap sound in the drums
    clap = 10
    with bandpass(frequency = [100, 11000], beats=4):
        for i in range(0, 16):
            playNote(clap, beats = 0.25)    
    ```
    """
    def __init__(self, frequency=3000, Q=2.0, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= 0: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(frequency) is not list: frequency = [frequency]
        if type(frequency) is list and not all(check_notes(x) for x in frequency): raise TypeError("Invalid type for 'frequency'. Must be int or float.")


        effect.__init__(self, "bandpass", beats, start, frequency, Q)

class notch(effect):
    """
    The notch filter reduces the energy of sounds near the cutoff frequency, 
    while allowing higher and lower frequencies to pass through unaltered. 
    The frequency parameter specifies the cutoff frequency for the effect 
    (between 10 Hz and 22 kHz). You can also pass a list of numbers to create
    a change over time. Each number will be evenly distributed over the duration 
    of the effect specified by the `beats` parameter. An optional `start` parameter 
    specifies how long to wait (in beats) before starting the effect.
    """
    def __init__(self, frequency=3000, Q=0.8, beats=None, start=0):
        def check_notes(n):
            if type(n) in [int, float] and n >= 0: return True
            else: return False

        if beats and type(beats) not in [int, float]: raise TypeError("Invalid type for 'beats'. Must be int or float.")
        if beats and beats < 0: raise ValueError("'Beats' must be non-negative int or float.")
        if beats == None: beats = -1
        if type(start) not in [int, float]: raise TypeError("Invalid type for 'start'. Must be int or float.")
        if start < 0: raise ValueError("'Start' must be non-negative int or float.")
        if type(frequency) is not list: frequency = [frequency]
        if type(frequency) is list and not all(check_notes(x) for x in frequency): raise TypeError("Invalid type for 'frequency'. Must be int or float.")


        effect.__init__(self, "notch", beats, start, frequency, Q)


def reformat_exception():
    e = { }
    e["name"] = "Unknown Error"
    e["message"] = "An unknown error occurred running your Python code."
    e["line"] = -1
    e["details"] = ""

    if (hasattr(sys, "last_type") and hasattr(sys, "last_value")):
        e["name"] = sys.last_type.__name__
        e["message"] = sys.last_value.__str__()
        tb = sys.last_traceback
        if tb is not None: 
            details = traceback.format_exception(sys.last_type, sys.last_value, sys.last_traceback)
            e["details"] = ''.join(details)
        if isinstance(sys.last_value, IndentationError):
            e["message"] = e["message"].split(" (")[0]
            e["line"] = sys.last_value.lineno
            if " on line " in e["message"]:
                line = e["message"].split(" on line ")[-1]
                e["message"] = e["message"].split(" on line ")[0]
                if line.isdigit():
                    e["line"] = int(line)
        elif isinstance(sys.last_value, SyntaxError):
            e["line"] = sys.last_value.lineno
        elif tb is not None:
            fs = traceback.extract_tb(tb)
            if len(fs) > 0:
                e["line"] = fs[-1].lineno
    return e

#---------------------------------------------------------------------
# show user code hint, linter message, etc
#---------------------------------------------------------------------
def message(msg):
    """
    Display a message to the user (e.g. code hint, linter message, etc.)
    ```python
    message('Try to create 12 notes that increase in volume over time.')
    ```
    """
    _tunepad_event("message", _playhead, params = { "message" : msg, "type" : "message" })

#---------------------------------------------------------------------
# show user result of a unit test
#---------------------------------------------------------------------
def test_result(msg, passed):
    """
    Display outcome of a unit test (PASS/FAIL). The second boolean parameter
    indicates pass (True) or fail (False).
    ```python
    # shows a red FAIL message
    test_result('Create 12 notes that increase in volume over time.', False)

    # shows a green PASS message
    test_result('Create 12 notes that get shorter and shorter over time.', True)
    ```
    """
    if passed:
        _tunepad_event("message", _playhead, params = { "message" : msg, "type" : "pass" })
    else:
        _tunepad_event("message", _playhead, params = { "message" : msg, "type" : "fail" })
    

#---------------------------------------------------------------------
# utility function that generates a tunepad trace event
#---------------------------------------------------------------------
def _tunepad_event(command, when, duration = 0, params = {}):
    e = { }
    e["command"] = command
    e["duration"] = duration
    e["time"] = when
    for key in params: e[key] = params[key]
    _tunepad_trace.append(e)


def _check_playhead(p):
    # floor and subtract small tolerance to account for floating point errors
    # downside is that everything is infinitesimally off, but fractional note
    # values will work correctly (e.g. 1/3, 1/6, etc.)

    if int(round(p)) == p: return floor(p) - 1e-10
    else: return p