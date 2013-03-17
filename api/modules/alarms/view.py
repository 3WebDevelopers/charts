import json
from model import *

def json_list(alarms):
    list = [{ 'key': alarm.key.urlsafe(),
                'market': alarm.market,
                'pattern': alarm.pattern,
                'date': alarm.date,
                'symbol': alarm.symbol}
            for alarm in alarms]
    return json.dumps(list)    

def json_detail(alarm):
    dict = { 'key': alarm.key.urlsafe(),
                'fundamentalData': {
                    'market': alarm.market,
                    'type': alarm.type,
                    'date': alarm.date,
                    'symbol': alarm.symbol,
                    'name': alarm.name,
                    'industry': alarm.industry,
                    'sector': alarm.sector,
                    'pe': alarm.pe},
                'trendLines':  json.loads(alarm.trendLines),
                'chartData': json.loads(alarm.chartData)}
    return json.dumps(dict)
