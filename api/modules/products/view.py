import json
from model import *

def json_list(products):
    list = [{ 'id': product.key.urlsafe(),
                "imageUrl": "img/products/resistance.png",
                'market': product.fundamentalData.market,
                'type': product.fundamentalData.type,
                'date': product.fundamentalData.date}
            for product in products]
    return json.dumps(list)    

def json_detail(product):
    dict = { 'id': product.key.urlsafe(),
                'fundamentalData': {
                    'market': product.fundamentalData.market,
                    'type': product.fundamentalData.type,
                    'date': product.fundamentalData.date,
                    'symbol': product.fundamentalData.symbol,
                    'name': product.fundamentalData.name,
                    'industry': product.fundamentalData.industry,
                    'sector': product.fundamentalData.sector,
                    'pe': product.fundamentalData.pe,
                    'liquidity': product.fundamentalData.liquidity}}
    return json.dumps(dict)
