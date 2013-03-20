import json, datetime, google.appengine.ext.db
from model import *    

def custom_formats(obj):
    if isinstance(obj, google.appengine.ext.ndb.Key):
        return obj.urlsafe()
    if isinstance(obj, datetime.date):
        return obj.strftime("%Y-%m-%dT00:00:00.000Z")        
    if isinstance(obj, datetime.datetime):
        return obj.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    raise TypeError(repr(obj) + ' is not JSON serializable')
    
class AlarmView(object):
    @staticmethod
    def list(alarms):
        list = [{ 'key': alarm.key,
                    'market': alarm.market,
                    'pattern': alarm.pattern,
                    'interval': alarm.interval,
                    'date': alarm.date,
                    'symbol': alarm.symbol}
                for alarm in alarms]
        return json.dumps(list, default=custom_formats)  

    @staticmethod	
    def single(alarm):
        dict = { 'key': alarm.key,
                    'fundamentalData': {
                        'market': alarm.market,
                        'pattern': alarm.pattern,
                        'interval': alarm.interval,
                        'date': alarm.date,
                        'symbol': alarm.symbol,
                        'name': alarm.name,
                        'industry': alarm.industry,
                        'sector': alarm.sector,
                        'pe': alarm.pe,
                        'liquidity': alarm.liquidity},
                    'trendLines':  json.loads(alarm.trend_lines),
                    'chartData': json.loads(alarm.chart_data)}
        return json.dumps(dict, default=custom_formats)

class AlarmFilterOptionsView(object):
    @staticmethod
    def single(filters):
        return json.dumps(filters, default=custom_formats)