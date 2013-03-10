import os, string, webapp2
from modules import baseLib
moduleName = string.split(os.path.realpath(__file__), "/")[-3]

"""  
Implements PRODUCT
post    product         create, returns id
get     product         read, returns collection of profiles
get     product/#       read, returns profile
del     product/#       delete, returns bool
put     product/#       update, returns modified profile
"""

class product_handler(webapp2.RequestHandler, baseLib):
    def post(self):
        file_content = self.request.get('upload')
        from ndb_product import Product
        p = Product(content = file_content)
        key = p.put()
         
        self.renderpage({"payload": key}, False, moduleName, "product.post.html")
                  
    def get(self, product_id = None):        
        if product_id == None:
            self.handleCollection()
        else:
            self.handleSingle(product_id)
            
    def handleCollection(self):
        from datetime import datetime
        from ndb_product import Product
        
        p = Product()        
        product_list = [{
                      'content'   : i.content, 
                      'date'    : i.date.strftime("%Y-%m-%d %H:%M:%S")
                      } for i in p.query()]
        
        self.renderpage({"product_list" : product_list}, True, moduleName, "product.list.html")
    
    def handleSingle(self, product_id):
        template_values = {"product_id": product_id}
        self.renderpage(template_values, True)
        
    def delete(self, product_id):
         template_values = {"product_id": product_id}
         self.renderpage(template_values, False, moduleName, "product.delete.html")
         
    def put(self, product_id):
         template_values = {"product_id": product_id}
         self.renderpage(template_values, False, moduleName, "product.put.html")
         
         
class product_main_handler(webapp2.RequestHandler, baseLib):
    def get(self, product_id = None):
        self.renderpage({}, False, moduleName, "product.main.html")
        
        
        
         