import webapp2, json, datetime
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
                                    interval = fundamental_data['interval'],
                                    date = datetime.datetime.strptime(fundamental_data['date'],
                                                                                    "%Y-%m-%dT%H:%M:%S.%fZ"),
                                    start = datetime.datetime.strptime(fundamental_data['start'],
                                                                                    "%Y-%m-%dT%H:%M:%S.%fZ"),
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
                                                                        Alarm.interval,
                                                                        Alarm.date,
                                                                        Alarm.symbol])
            self.response.out.write(AlarmView.list(alarms))
        else:
            self.response.out.write(AlarmView.single(Alarm.get(key)))

    def delete(self, key):
        yield
      
    def put(self, key):
        yield
        
class AlarmFilterOptionsHandler(webapp2.RequestHandler):
    def post(self):
        yield

    def get(self):
        max_dates = 22
        dates = []
        curr = datetime.date.today()
        
        while (len(dates) < max_dates):
            if (curr.isoweekday() <= 5):
                dates.append(curr)
            curr = curr - datetime.timedelta(days=1)
        
        filters = { 'markets': ['NASDAQ', 'NYSE', 'LSA',
                                        'MLSE', 'HKEX', 'PAR'],
                        'patterns': ['BOTTOM SQUARE TRIANGLE',
                                        'TOP SQUARE TRIANGLE',
                                        'SUPPORT',
                                        'RESISTANCE',
                                        'BOTTOM END SWEEP',
                                        'TOP END SWEEP',
                                        'BOTTOM REVERSAL',
                                        'TOP REVERSAL'],
                        'dates': dates}
        self.response.out.write(AlarmFilterOptionsView.single(filters))
        
    def delete(self):
        yield

    def put(self):
        yield

        
