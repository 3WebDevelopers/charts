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
                    'pattern': alarm.pattern,
                    'date': alarm.date,
                    'symbol': alarm.symbol,
                    'name': alarm.name,
                    'industry': alarm.industry,
                    'sector': alarm.sector,
                    'pe': alarm.pe,
                    'liquidity': alarm.liquidity},
                'trendLines':  json.loads(alarm.trend_lines),
                'chartData': json.loads(alarm.chart_data)}
    return json.dumps(dict)
