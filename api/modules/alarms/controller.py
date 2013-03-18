import webapp2, json
from model import *
from view import *

import logging

"""  
Implements ALARM
post    alarm         create, returns id
get     alarm         read, returns collection of products
get     alarm/#       read, returns alarm
del     alarm/#       delete, returns bool
put     alarm/#       update, returns modified alarm
"""

class AlarmHandler(webapp2.RequestHandler):
    def post(self):
        j = json.loads(self.request.body)
        fundamentalData = j['fundamentalData']
        trendLines = j['trendLines']
        chartData = j['chartData']
        alarm = Alarm(market = fundamentalData['market'],
                                    pattern = fundamentalData['pattern'],
                                    date = fundamentalData['date'],
                                    symbol = fundamentalData['symbol'],
                                    name = fundamentalData['name'],
                                    industry = fundamentalData['industry'],
                                    sector = fundamentalData['sector'],
                                    pe = fundamentalData['pe'],
                                    trendLines = json.dumps(trendLines),
                                    chartData = json.dumps(chartData))
        key = alarm.put()
        # logging.info(repr(j))
        # self.response.out.write(jsonView(p))

    def get(self, key = None):        
        if key == None:
            alarms = Alarm.query().fetch(projection=[Alarm.market, 
                                                                            Alarm.pattern,
                                                                            Alarm.date,
                                                                            Alarm.symbol])
            self.response.out.write(json_list(alarms))
        else:
            p = Alarm.get(key)
            self.response.out.write(json_detail(p))

    def delete(self, key):
        yield
      
    def put(self, key):
        yield