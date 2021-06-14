from ..repository import Repository
from ..repository.mongoGenerations import MongoGenerationRepository
from .schema import GenerationSchema
from bson import ObjectId
from bson.json_util import dumps

from app.MuseNet.completion import completion
from app.MuseNet.helpers.musenetSettings import musenetSettings
from app.MuseNet.helpers.fetcher import fetcher

import logging
log = logging.getLogger("werkzeug")
log.info("main info")

class Service(object):
  def __init__(self, repo_client=Repository(adapter=MongoGenerationRepository)):
    self.repo_client = repo_client

  def find_all_generations(self):
    generations  = self.repo_client.find_all({})
    return generations
    # log.info(generations[0])
    # return [self.dump(generation) for generation in generations]
#
  def find_generation_by_id(self, id):
    res = self.repo_client.find({'_id': ObjectId(id)})
    return (res)

  def tracks(self, id):
    res = self.find_generation_by_id(id)
    c = completion.load_objects(res["completion_location"])
    return c.tracks

  def create_generation_for(self, options):
    log.info(options)
    instrumentation = [x for x in musenetSettings().legal_instruments() if options[x]]
    log.info(instrumentation)
    c = completion(project_root="user_id", enc=options["parent_enc"], composer=options["composer"],
                   temp=options["temp"], num_tokens=options["num_tokens"],
                   instrumentation=instrumentation)
    r = fetcher.fetch(c)
    newGens = []
    for child in r.children:
        save_location = child.save()
        child.test_save_loc = save_location
        child.save(save_location)
        newGens.append(self.repo_client.create(self.prepare_generation(child, options)))
    return [x.inserted_id for x in newGens]
#
#   def update_kudo_with(self, repo_id, githubRepo):
#     records_affected = self.repo_client.update({'user_id': self.user_id, 'repo_id': repo_id}, self.prepare_kudo(githubRepo))
#     return records_affected > 0
#
  def delete_generation_for(self, repo_id):
    records_affected = self.repo_client.delete({'_id': ObjectId(repo_id)})
    return records_affected > 0

  def dump(self, data):
    return GenerationSchema().dump(data)

  def prepare_generation(self, gen, options):
    settings = gen.settings
    log.info("Preparing generations")
    res = {}
    res["completion_location"] = gen.last_save_location

    for inst in musenetSettings().legal_instruments():
        res[inst] = settings.instrumentation[inst]

    for option in ['num_tokens', 'composer', 'temp', 'enc']:
        res[option] = settings.__dict__[option]

    for option in ["parent_id"]:
        res[option] = options[option]

    return res
