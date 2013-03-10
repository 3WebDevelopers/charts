import os, string, webapp2
from modules import baseLib
from modules import stdClass

moduleName = string.split(os.path.realpath(__file__), "/")[-3]

class user_handler(webapp2.RequestHandler, baseLib):           
    def get(self):
        from db_user import User
        u = User()
        
        from encoder import *
        a = Encoder()        
         
        from datetime import datetime
        
        """ from this:
        user_list = []
        for item in u.user_list():
            obj                 = {}
            obj['email']        = item.email
            obj['email_decoded']= a.decode_email(item.email)
            obj['date']         = item.date.strftime("%Y-%m-%d %H:%M:%S")
            user_list.append(obj)
        to this: """
        
        """
        user_list = [{
                      'email'   : a.decode_email(i.email), 
                      'date'    : i.date.strftime("%Y-%m-%d %H:%M:%S"),
                      'name'    : i.name
                      } for i in u.user_profile_list()]
        """ 
        list = u.user_list_special()
        template_values = {
            'user_list' : list,
            'size'      : 666
        }
        self.renderpage(template_values, False, moduleName, "index.html")
        
class user_delete_handler(webapp2.RequestHandler, baseLib):           
    def get(self):
        self.renderpage({}, False, moduleName, "delete.html")

    def post(self):
        key = self.request.get('key')
         
        from db_user import User
        user            = User()     
        result = user.delete_user(key)
        
        if result : 
            result_status = "all good"
        else:
            result_status = "YOUR DELETE IS WRONG. YOUR ACTION IS WRONG. YOU ARE WRONG."
      
        self.renderpage({"result" : result_status}, False, moduleName, "delete.html")
