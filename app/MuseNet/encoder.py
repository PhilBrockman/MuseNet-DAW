import pretty_midi

instruments = {"piano": 0, "violin": 1, "cello": 2, "bass": 3, "guitar": 4, "flute": 5, "clarinet": 6, "trumpet": 7, "harp": 8, "drum": 9}
mappings = {"violin": {"ids":[40, 41, 44, 45, 48, 49, 50, 51], "on": 14, "off": 15},
"cello": {"ids":[42, 43], "on": 16, "off": 17},
"bass": {"ids":[32, 33, 34, 35, 36, 37, 38, 39], "on": 18, "off": 19},
"guitar":  {"ids":[24, 25, 26, 27, 28, 29, 30, 31], "on": 20, "off": 21},
"flute": {"ids":[72, 73, 74, 75, 76, 77, 78, 79], "on": 22, "off": 23},
"clarinet": {"ids":[64, 65, 66, 67, 68, 69, 70, 71], "on": 24, "off": 25},
"trumpet": {"ids":[56, 57, 58, 59, 60, 61, 62, 63], "on": 26, "off": 27},
"harp": {"ids":[46], "on": 28, "off": 29},
"piano": {"ids":[], "on": 8, "off": 0},
"drum": {"ids":[], "on":30}
}

def wait_token(duration, beats):
    tokens = []
    adjustment = 120/beats
    delay = duration * adjustment
    full_blocks = int(delay/128)

    for i in range(full_blocks):
        tokens.append(4095)

    last_block = int(delay)%128
    if last_block > 0:
        tokens.append(3967 + last_block)

    return tokens

def num_to_instr(i):
  for m in mappings:
    if i in mappings[m]["ids"]:
      return m
  return "piano"

def secs2ticks(event, beats):
    return list(event.keys())[0]*beats*48/60

def generate_encoding(filename):
    pm = pretty_midi.PrettyMIDI(filename)
    bpm = pm.estimate_tempo()
    merge = []
    for instrument in pm.instruments:
        for note in instrument.notes:
            if instrument.is_drum:
              i = "drum"
            else:
              i = num_to_instr(instrument.program)

            duration = note.end-note.start
            merge.append({"instrument":i, "toggle": "on", "pitch":note.pitch, "time":note.start, "duration":duration})
            if not instrument.is_drum:
              merge.append({"instrument":i, "toggle": "off", "pitch":note.pitch, "time":note.end})

    event_timings = list(set([x["time"] for x in merge]))
    merge_events = []
    for time in event_timings:
        merge_events.append({time: [x for x in merge if x["time"] == time]})

    encodings = []
    last_time = 0
    for x in sorted(merge_events, key=lambda x: secs2ticks(x, bpm)):
        encodings.extend(wait_token(secs2ticks(x, bpm)-last_time, bpm))
        last_time = secs2ticks(x,bpm)
        for event in x[list(x.keys())[0]]:
            if "duration" not in event.keys() or event["duration"] > 0:
                encodings.append(event["pitch"] + 128*mappings[event["instrument"]][event["toggle"]])

    return " ".join([str(x) for x in encodings])
