import json

class musenetSettings:
  def __init__(self, enc="", audioFormat = "mp3", composer="thebeatles", truncation = 0, temp=.8, num_tokens=225, instrumentation = ["piano"]):
    self.project_root = "musenet_settings"
    self.enc = enc
    self.composer = composer
    self.temp = float(temp)
    self.turn_on(instrumentation)
    self.num_tokens = int(num_tokens)
    self.truncation = int(truncation)
    self.audioFormat = audioFormat

  def legal_instruments(self):
    return "piano strings winds drums harp guitar bass".split(" ")

  def legal_composers(self):
    return ['chopin','mozart','rachmaninoff','country','bach','beethoven','thebeatles','franksinatra','tchaikovsky']

  def turn_on(self, instruments):
    self.toggle_instruments(instruments, True)

  def toggle_instruments(self, instruments, state):
    instr_dict = {}
    lower_instruments = [x.lower() for x in instruments]
    for item in self.legal_instruments():
      if item in lower_instruments:
        instr_dict[item] = state
      else:
        instr_dict[item] = not state
    self.instrumentation = instr_dict

  def toJson(self):
    return json.dumps(self.__dict__)

  def __repr__(self):
    return self.toJson()

  def __str__(self):
    s = """genre: {}\ntemp: {}\ninstrumentation: {}\ntokens: {}\ntruncation: {}\naudio format: {}\nenc: <{}>"""
    return s.format(self.genre, self.temp, self.instrumentation, self.length, self.truncation, self.audioFormat, self.enc)
