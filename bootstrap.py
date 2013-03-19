import webapp2
 
from api.modules.alarms import *
 
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

app = webapp2.WSGIApplication([
            #Implements REST product handlers   
            webapp2.Route(r'/api/alarms', handler=AlarmHandler, name='alarm-list'),
            webapp2.Route(r'/api/alarms/<key>', handler=AlarmHandler, name='alarm')
           ], debug=True)
 