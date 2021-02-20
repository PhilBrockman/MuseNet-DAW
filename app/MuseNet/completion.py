from app.MuseNet.helpers.fileSaver import fileHelper
from app.MuseNet.helpers.musenetSettings import musenetSettings

import copy
import time
import IPython
import pretty_midi
import numpy as np
import os, json
from datetime import datetime

import logging
log = logging.getLogger("werkzeug")
log.info("main info")

class audioManipulation:
  def __init__(self, tracks):
    self.tracks = tracks

  def instrument_name_to_program(self, string):
    lookup = {
      "piano": "Acoustic Grand Piano",
      "bass": "Acoustic Bass",
      "winds": "Recorder",
      "drums": "Synth Drum",
      "harp": "Orchestral Harp",
      "guitar": "Acoustic Guitar (nylon)",
      "strings": "Violin"
    }
    try:
      return pretty_midi.instrument_name_to_program(lookup[string].title())
    except:
      return pretty_midi.instrument_name_to_program(string.title())

  def append_notes_to_inst(self, inst, notes, velocity=100):
    for note in notes:
        inst.notes.append(pretty_midi.Note(velocity, note["pitch"], note["time_on"], note["time_on"] + note["duration"]))
    return inst

  def to_midi(self):
    pm = pretty_midi.PrettyMIDI(initial_tempo=120)
    if self.tracks is not None:
      for track in self.tracks:
        inst = pretty_midi.Instrument(program=self.instrument_name_to_program(track['instrument']), is_drum=False)
        inst = self.append_notes_to_inst(inst, track['notes'])
        pm.instruments.append(inst)
    return pm

  def play(self, play_each = True, sleep=False):
    IPython.display.display(IPython.display.Audio(self.to_midi().synthesize(fs=16000), rate=16000, autoplay=play_each))
    if sleep:
        time.sleep(self.totalTime + .25)

  def play_gens(self, **kwargs):
    for c in self.children:
      c.play(**kwargs)

  def save_midi(self, filename = None, overwrite=False):
    if filename is None:
      if not overwrite and self.midi_location:
          filename = self.midi_location
      else:
          filename = "{}/{}.mid".format(self.project_root, self.default_filename())
    if overwrite or (self.midi_location is None):
        if self.last_save_location is None:
            self.save()
        fileHelper.touch_directory(filename)
        self.to_midi().write(filename)
        self.midi_location = filename
        self.save(self.last_save_location)
    else:
        log.info("Midi Location already exisited")
    return filename

class completion(fileHelper, audioManipulation):
  def __init__(self, project_root = None, file_extension = "completion", **kwargs):
    self.settings = musenetSettings(**kwargs)
    self.children = []
    self.totalTime = 0
    self.tracks = None
    self.midi_location = None
    self.file_extension = file_extension
    self.loop_count = None
    self.fetch_count = None
    self.human_readable_enc = None
    if project_root is not None:
      self.project_root = project_root
    #else all is blank

  def add_children(self, processed_musenet):
    for item in processed_musenet:
      tmp = completion()
      tmp.settings = copy.copy(self.settings)
      tmp.settings.enc = ("{} {}".format(self.settings.enc.strip(), item['encoding'].strip())).strip()
      tmp.totalTime = item["totalTime"]
      tmp.tracks = item["tracks"]
      tmp.project_root = self.project_root
      self.children.append(tmp)

  def has_children(self):
    return len(self.children) > 0

  def default_filename(self):
    instr = self.settings.instrumentation
    return "{}/{}/{}".format(self.settings.composer,
                                self.settings.temp,
                                datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f"))

  def load_objects(filename):
    json = completion.load_json(filename)
    return completion.objectize(json)

  def objectize(json):
    if json is None:
      return None
    partial = fileHelper.convert(json, completion())
    partial.settings = fileHelper.convert(partial.settings, musenetSettings())
    if not partial.has_children():
      return partial
    else:
      for i in range(len(partial.children)):
        partial.children[i] = completion.objectize(partial.children[i])
      return partial
