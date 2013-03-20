from google.appengine.ext import ndb

class Alarm(ndb.Model):
    market = ndb.StringProperty()
    pattern = ndb.StringProperty()
    date = ndb.StringProperty()
    start_date = ndb.StringProperty()
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
        
class Market(ndb.Model):
	name = ndb.StringProperty()
	index = ndb.IntegerProperty()
	
    @staticmethod
    def get(key):
        return ndb.Key(urlsafe=key).get()	
	
class Pattern(ndb.Model):
	name = ndb.StringProperty()
	index = ndb.IntegerProperty()
	
    @staticmethod
    def get(key):
        return ndb.Key(urlsafe=key).get()	        
        