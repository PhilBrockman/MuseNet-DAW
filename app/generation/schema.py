from marshmallow import Schema, fields

class MusenetSettingsSchema(Schema):
  composer = fields.Str()
  piano = fields.Boolean()
  strings = fields.Boolean()
  winds = fields.Boolean()
  drums = fields.Boolean()
  harp = fields.Boolean()
  bass = fields.Boolean()
  guitar = fields.Boolean()
  num_tokens = fields.Int()
  temp = fields.Float()
  enc = fields.Str()
  parent_id = fields.Int()
  completion_location = fields.Str()
  human_readable_enc = fields.Str()


class GenerationSchema(MusenetSettingsSchema):
    cutoff = fields.Float()
    clip_length = fields.Int()
    repeat_percentage = fields.Float()

  # repo_name = fields.Str()
  # full_name = fields.Str()
  # language = fields.Str()
  # description = fields.Str()
  # repo_url = fields.URL()

# class KudoSchema(GithubRepoSchema):
#   user_id = fields.Email(required=True)
