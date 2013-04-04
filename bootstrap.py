import webapp2
import os
from api.modules.alarms import *
from google.appengine.api import users
from google.appengine.ext.webapp import template
"""
****************
 READ ME FIRST
****************
Comments:
Don't use unicode, just pure ascii.

Request handlers:
--> BE CAREFULL <--
All of them should be wrapped in try except.
You are locking up default debug info.
Do this ONLY for production release or final tests in staging.

**************************************
 How to use status codes in webapp2: 
**************************************
self.response.set_status( status_Number )   
self.abort( status_Number )

*****************************
 Some usefull status codes:
 Taken from: http://www.w3.org/Protocols/HTTP/HTRESP.html 
*****************************
Success 2xx
OK 200
CREATED 201
Accepted 202
Partial Information 203
No Response 204

Error 4xx, 5xx
Bad request 400
Unauthorized 401
PaymentRequired 402
Forbidden 403
Not found 404
Not implemented 501

Por default acontecem os seguintes:
200 se nao houver erros
500 on server error, error display nao esta oculta
404 not found

"""

class MainHandler(webapp2.RequestHandler):
    def get(self):
        if users.is_current_user_admin():
            path = os.path.join(os.path.dirname(__file__), 'app' + os.sep + 'index.html')
            self.response.out.write(template.render(path, { 'a':'b'}))
        else:
            self.redirect(users.create_login_url(self.request.uri))



app = webapp2.WSGIApplication([
            #Implements REST product handlers   
            webapp2.Route(r'/api/alarm_filter_options', handler=AlarmFilterOptionsHandler, name='alarm_filters'),
            webapp2.Route(r'/api/market_data', handler=MarketDataHandler, name='market_data'),
            webapp2.Route(r'/api/alarms', handler=AlarmHandler, name='alarms'),
            webapp2.Route(r'/api/alarms/<key>', handler=AlarmHandler, name='alarm'),
            (r'/.*', MainHandler),
           ], debug=True)
 