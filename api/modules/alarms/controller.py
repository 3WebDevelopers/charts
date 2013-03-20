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
        fundamental_data = j['fundamentalData']
        trend_lines = j['trendLines']
        chart_data = j['chartData']
        alarm = Alarm(market = fundamental_data['market'],
                                    pattern = fundamental_data['pattern'],
                                    date = fundamental_data['date'],
                                    start_date = fundamental_data['start'],
                                    symbol = fundamental_data['symbol'],
                                    name = fundamental_data['name'],
                                    industry = fundamental_data['industry'],
                                    sector = fundamental_data['sector'],
                                    pe = fundamental_data['pe'],
                                    liquidity = fundamental_data['liquidity'],
                                    trend_lines = json.dumps(trend_lines),
                                    chart_data = json.dumps(chart_data))
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
