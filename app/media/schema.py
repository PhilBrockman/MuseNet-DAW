from marshmallow import Schema, fields

class MediaSchema(Schema):
  generation_id = fields.Str()
  midi_location = fields.Str()
  wav_location = fields.Str()
