import os
from pymongo import MongoClient
from bson import ObjectId

COLLECTION_NAME = 'media'


import logging
log = logging.getLogger("werkzeug")
log.info("main info")

class MongoMediaRepository(object):
  def __init__(self):
    mongo_url = os.environ.get('MONGO_URL')
    self.db = MongoClient(mongo_url).media

  def find_all(self, selector):
    return self.db.media.find(selector)

  def update(self, selector, data):
    records_affected = self.db.media.update(selector, data)
    return records_affected['n'] > 0

  def create(self, data):
    return self.db.media.insert_one(data)

  def delete(self, selector):
    res = self.find_all(selector)
    for r in res:
        log.info("info on", r)
        for k,v in r.items():
            log.info("value", v)
            try:
                if "/" in v:
                    if os.path.exists(v) and (v.endswith(".mid") or v.endswith(".wav")):
                        os.remove(v)
            except:
                pass
    return self.db.media.remove(selector)
