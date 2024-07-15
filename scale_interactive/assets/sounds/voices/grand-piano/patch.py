import json

notes = [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
octaves = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]

samples = [ ]

midi = 12
for octave in octaves:
    for note in notes:
        if midi >= 21 and midi <= 108:
            path = str(midi) + "piano" + note + str(octave)
            sample = {
                "sample" : f"/assets/sounds/voices/piano/{path}",
                "step" : midi
            }
            samples.append(sample)
        midi += 1

patch = {
    "name": "Grand Piano",
    "instrument": "piano",
    "version": "2.0",
    "format": "tunepad-patch",
    "created": "2024-03-31",
    "modified": "2024-03-31",
    "id": -1,
    "nodes": [
        {
            "id": 0,
            "type": "out",
            "level" : 0,
            "A": 0, "D": 0, "S": 1, "R": 0.01,
            "a shape": 4, "d shape": 2, "r shape": 2,
        },
        { "id": 1, "type": "sample", "samples": samples }
    ],
    "routing": [
        {   "source": 1, "dest": 0, "type": "audio", "level": 0 }
    ]
}

print(json.dumps(patch, indent=4))
