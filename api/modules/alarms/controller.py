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
                                end = datetime.datetime.strptime(fundamental_data['date'],
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
            num_days = 366
            today = datetime.datetime.now()
            min_date = today - datetime.timedelta(days=num_days)
            query = Alarm.query(Alarm.date > min_date).order(-Alarm.date)
            alarms = query.fetch(projection=[Alarm.market,
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
        filters = { 'markets': ['NASDAQ', 'NYSE', 'LSE',
                                        'MLSE', 'HKEX', 'PAR'],
                        'patterns': ['BOTTOM RIGHT TRIANGLE',
                                        'TOP RIGHT TRIANGLE',
                                        'SUPPORT',
                                        'RESISTANCE',
                                        'BOTTOM END SWEEP',
                                        'TOP END SWEEP',
                                        'BOTTOM REVERSAL',
                                        'TOP REVERSAL']}    
        self.response.out.write(AlarmFilterOptionsView.single(filters))
        
    def delete(self):
        yield

    def put(self):
        yield

class MarketDataHandler(webapp2.RequestHandler):
    def post(self):
        data_points = json.loads(self.request.body)
        # logging.info(j)
        
        for data_point in data_points:
            date = datetime.datetime.strptime(data_point['date'], "%Y-%m-%dT%H:%M:%S.%fZ")
            market = data_point['market']
            symbol = data_point['symbol']
            query = Alarm.query(Alarm.end < date, 
                                            Alarm.market == market,
                                            Alarm.symbol == symbol)
            count = query.count()

            if (count > 0):
                alarms = query.fetch(count)
                for alarm in alarms:
                    cd =  json.loads(alarm.chart_data)
                    cd.append(data_point)
                    alarm.chart_data = json.dumps(cd)
                    alarm.end = date
                    key = alarm.put()
                logging.info(str(date)+","+market+","+symbol+","+str(count))
            
    def get(self):        
        yield
        
    def delete(self):
        yield

    def put(self):
        yield
