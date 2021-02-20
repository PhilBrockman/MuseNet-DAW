import os
from pymongo import MongoClient
from bson import ObjectId

COLLECTION_NAME = 'generations'

class MongoGenerationRepository(object):
  def __init__(self):
    mongo_url = os.environ.get('MONGO_URL')
    self.db = MongoClient(mongo_url).generations

  def find_all(self, selector):
    return self.db.generations.find(selector)

  def find(self, selector):
    return self.db.generations.find_one(selector)

  def find_by_id(self, id):
    return self.db.generations.find_one(ObjectId(id))

  def create(self, kudo):
    return self.db.generations.insert_one(kudo)

  def update(self, selector, kudo):
    return self.db.generations.replace_one(selector, kudo).modified_count

  def delete(self, selector):
    r = self.find(selector)
    for k,v in r.items():
      try:
        if "/" in v:
          if os.path.exists(v) and (v.endswith(".completion")):
              os.remove(v)
      except:
        pass
    return self.db.generations.delete_one(selector).deleted_count
