from flask import Flask, json, g, request, send_from_directory
from flask_cors import CORS
from bson.json_util import dumps
import ast, logging, sys, os

from app.generation.service import Service as Generation
from app.media.service import Service as Media
from app.MuseNet.completion import completion

app = Flask(__name__, static_folder="user_id")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)
# app.config.update({
#   'OIDC_CLIENT_SECRETS': './../../../../client_secrets.json',
#   'OIDC_RESOURCE_SERVER_ONLY': True
# })
# oidc = OpenIDConnect(app)
CORS(app)
@app.route('/midifiles/<path:path>')
def sendMidi(path):
    if(path.endswith("mid")):
        return send_from_directory(f"../../../", filename=path, as_attachment= True, mimetype= "audio/midi")
    else:
        return json_response({})

@app.route("/generation/<string:generation_id>/generate_midi", methods=["GET"])
def mediaIndex(generation_id):
  res = Generation().find_generation_by_id(generation_id)
  c = completion.load_objects(res['completion_location'])
  Media().generate_or_update_media_for(str(res["_id"]), midi_location=c.save_midi())
  return json_response(Media().find_all({"generation_id": str(res["_id"])}))

@app.route("/generation/<string:generation_id>/media", methods=["GET"])
def mediaList(generation_id):
    return json_response(Media().find_all({"generation_id": generation_id}))


@app.route("/generation/<string:generation_id>/tracks", methods=["GET"])
def mediaListTracks(generation_id):
    return json_response(Generation().tracks(generation_id))

# @app.route("/generation/<string:generation_id>/media/<string:media_id>", methods=["GET"])
# def mediaListForGeneration(generation_id, media_id):
#     return json_response(Media().find_all({"generation_id": generation_id}))

@app.route("/generations", methods=["GET"])
def index():
  g = Generation().find_all_generations()
  return json_response(g);#json_response(Kudo(g.oidc_token_info['sub']).find_all_kudos())

@app.route("/generation", methods=["POST"])
def create():
  data = request.data.decode("UTF-8")
  data = json.loads(data)
  generation = Generation().create_generation_for(data)

  if generation:
    return json_response(generation)
  else:
    return json_response({'error': 'generation not found'}, 404)

@app.route("/generation/<string:id>", methods=["get"])
def get(id):
  service = Generation()
  res = service.find_generation_by_id(id)
  if res:
    return json_response(res)
  else:
    return json_response({'error': 'kudo not found'}, 404)

@app.route("/generation/<string:generation_id>", methods=["delete"])
def delete(generation_id):
  service = Generation()
  relevant_media = Media().delete_media_for(generation_id)

  if service.delete_generation_for(generation_id):
    return json_response({})
  else:
    return json_response({'error': 'kudo not found'}, 404)

# @app.route("/kudos", methods=["POST"])
# @oidc.accept_token(True)
# def create():
#   github_repo = GithubRepoSchema().load(json.loads(request.data))
#
#   if github_repo.errors:
#     return json_response({'error': github_repo.errors}, 422)
#
#   kudo = Kudo(g.oidc_token_info['sub']).create_kudo_for(github_repo)
#   return json_response(kudo)
#
#

#
#
# @app.route("/kudo/<int:repo_id>", methods=["PUT"])
# @oidc.accept_token(True)
# def update(repo_id):
#    github_repo = GithubRepoSchema().load(json.loads(request.data))
#
#    if github_repo.errors:
#      return json_response({'error': github_repo.errors}, 422)
#
#    kudo_service = Kudo(g.oidc_token_info['sub'])
#    if kudo_service.update_kudo_with(repo_id, github_repo):
#      return json_response(github_repo.data)
#    else:
#      return json_response({'error': 'kudo not found'}, 404)
#
#
#
#
def parse_json(data):
  return dumps(data)
  # return json.loads(json_util(data))

def json_response(payload, status=200):
  # app.logger.info(payload)
  return (parse_json(payload), status, {'content-type': 'application/json'})
