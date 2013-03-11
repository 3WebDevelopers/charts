from google.appengine.ext import ndb

class FundamentalData(ndb.Model):
    market = ndb.StringProperty()
    type = ndb.StringProperty()
    date = ndb.StringProperty()
    symbol = ndb.StringProperty()
    name = ndb.StringProperty()
    industry = ndb.StringProperty()
    sector = ndb.StringProperty()
    pe = ndb.StringProperty()
    liquidity = ndb.StringProperty()
    
# class Trendline(ndb.Model):
    # lineColor =ndb.StringProperty()
    # initialDate = ndb.StringProperty()
    # initialValue = ndb.StringProperty()
    # finalDate = ndb.StringProperty()
    # finalValue = ndb.StringProperty()
    # lineThickness = ndb.StringProperty() 

class Product(ndb.Model):
    fundamentalData = ndb.StructuredProperty(FundamentalData)
    # trendlines = ndb.StructuredProperty(Trendline, repeated=True)
    
    @staticmethod
    def get(key):
        return ndb.Key(urlsafe=key).get()
        