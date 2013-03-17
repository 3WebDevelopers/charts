from google.appengine.ext import ndb

class Alarm(ndb.Model):
    market = ndb.StringProperty()
    pattern = ndb.StringProperty()
    date = ndb.StringProperty()
    symbol = ndb.StringProperty()
    name = ndb.StringProperty()
    industry = ndb.StringProperty()
    sector = ndb.StringProperty()
    pe = ndb.StringProperty()
    trendLines = ndb.JsonProperty()
    chartData = ndb.JsonProperty()
    
    @staticmethod
    def get(key):
        return ndb.Key(urlsafe=key).get()
        