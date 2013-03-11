import webapp2, json
from model import *
from view import *

import logging

"""  
Implements PRODUCT
post    product         create, returns id
get     product         read, returns collection of products
get     product/#       read, returns product
del     product/#       delete, returns bool
put     product/#       update, returns modified product
"""

class ProductHandler(webapp2.RequestHandler):
    def post(self):
        j = json.loads(self.request.body)
        fd = j['fundamentalData']
        fundamentalData = FundamentalData(
                                        market = fd['market'],
                                        type = fd['type'],
                                        date = fd['date'],
                                        symbol = fd['symbol'],
                                        name = fd['name'],
                                        industry = fd['industry'],
                                        sector = fd['sector'],
                                        pe = fd['pe'],
                                        liquidity = fd['liquidity'])
        p = Product(fundamentalData = fundamentalData)
        key = p.put()
        # logging.info(repr(j))
        # self.response.out.write(jsonView(p))

    def get(self, product_id = None):        
        if product_id == None:
            products = Product.query()
            self.response.out.write(json_list(products))
        else:
            p = Product.get(product_id)
            self.response.out.write(json_detail(p))

    def delete(self, product_id):
        yield
      
    def put(self, product_id):
        yield
