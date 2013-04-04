from google.appengine.ext import ndb

class Alarm(ndb.Model):
    market = ndb.StringProperty()
    pattern = ndb.StringProperty()
    interval = ndb.StringProperty()
    date = ndb.DateTimeProperty()
    start = ndb.DateTimeProperty()
    end = ndb.DateTimeProperty()
    symbol = ndb.StringProperty()
    name = ndb.StringProperty()
    industry = ndb.StringProperty()
    sector = ndb.StringProperty()
    pe = ndb.FloatProperty()
    liquidity = ndb.FloatProperty()
    trend_lines = ndb.JsonProperty()
    chart_data = ndb.JsonProperty()
    
    @staticmethod
    def get(key):
        return ndb.Key(urlsafe=key).get()
        