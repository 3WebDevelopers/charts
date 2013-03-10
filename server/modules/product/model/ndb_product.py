from google.appengine.ext import ndb

class Product(ndb.Model):
    content = ndb.BlobProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)