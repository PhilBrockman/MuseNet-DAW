from ..repository import Repository
from ..repository.mongoMedia import MongoMediaRepository
from .schema import MediaSchema

import logging, os
log = logging.getLogger("werkzeug")
log.info("main info")

class Service(object):
  def __init__(self, repo_client=Repository(adapter=MongoMediaRepository)):
    self.repo_client = repo_client

  def find_all(self, selector = {}):
    return self.repo_client.find_all(selector)

  def delete_media_for(self, generation_id):
    records_affected = self.repo_client.delete({'generation_id': generation_id})
    return records_affected

  # def find_all_media(self):
  #   generations  = self.repo_client.find_all({})
  #   return generations
    # log.info(generations[0])
    # return [self.dump(generation) for generation in generations]
  def delete(self, filename):
      if os.path.exists(filename):
          log.info(f"deleting {filename}")
          os.remove(filename)

  def generate_or_update_media_for(self, generation_id, **kwargs):
    selector = {"generation_id": generation_id}
    res = self.repo_client.find_all(selector)
    tmp = {}
    tmp["generation_id"] = generation_id
    if(res.count() > 0):
      for k, v in res[0].items():
          if not k == "_id":
              # if k in kwargs:
              #     self.delete(res[0][k])
              tmp[k] = v
      for k,v in kwargs.items():
          tmp[k] = v
      return self.repo_client.update(selector, tmp)
    else:
      for k,v in kwargs.items():
        tmp[k] = v
      return self.repo_client.create(tmp)
