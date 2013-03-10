import sys, os, webapp2
 
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
 
from modules.index import *
from modules.auth import *
from modules.product import *
from modules.user import *
 
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

application = webapp2.WSGIApplication([('/', index_handler),
                                       
                                       ('/auth/login', login_handler),
                                       ('/auth/logout', logout_handler),
                                       ('/auth/register', register_handler),
                                       
                                       #Implements REST product handlers                                       
                                       ('/product', product_handler),
                                       ('/product/(\d+)', product_handler),
                                       ('/product/main', product_main_handler),
                                       
                                        #Implements REST user handlers                                       
                                        ('/user', user_handler),
                                        ('/user/delete', user_delete_handler),
                                        ('/user/(\d+)', user_handler),
                                        
                                        #Implements REST email handlers                                       
                                        #('/contact', contact_handler),
                                       ],
                                      debug=True)

def bootstrap():
    run_wsgi_app(application)


if __name__ == "__main__":
    bootstrap()
 