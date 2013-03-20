import webapp2
from webapp2_extras import sessions
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

class BaseHandler(webapp2.RequestHandler):
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        self.checkAuth()
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    def checkAuth(self):
        foo = self.session.get('login')
        #se diferente, entao bloqueia o pedido e envia para outro lado. caso contrario ignora.
        if foo != 'simesta':
            self.session.clear()
            self.redirect('/login')

class SaveLogin(BaseHandler):
    def post(self):
        failmsg = "Bad Login"
        username = self.request.get("user")
        password = self.request.get("pass")
        if username == "bigodes":
            if password == "grandes":
                self.session['login'] = 'simesta'
                self.redirect('/')
            else:
                self.response.write(failmsg)
        else:
            self.response.write(failmsg)

class ShowLogin(webapp2.RequestHandler):
    def get(self):
        loginform = "<form action='/loginsave' method='post'>" \
                    "<input placeholder='username' type='text' name='user'>" \
                    "<input placeholder='password' type='password' name='pass'>" \
                    "<input type='submit' value='Login'>" \
                    "</form>"
        self.response.write(loginform)


class PerformLogout(BaseHandler):
    def get(self):
        self.session.clear()
        self.redirect('/login')


class MainHandler(BaseHandler):
    def get(self):
        self.response.write("Main Page")

class Hello(BaseHandler):
    def get(self):
        foo = self.session.get('login')
        self.response.write("Hello")
        self.response.write(foo)

"""
logout: self.session.clear()
clear value: self.session.pop('counter')
"""

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
    }

app = webapp2.WSGIApplication([
            #webapp2.Route(r'/', handler=AlarmHandler, name='home'),
            #Implements REST product handlers
            #webapp2.Route(r'/alarms', handler=AlarmHandler, name='alarm-list'),
            #webapp2.Route(r'/alarms/<key>', handler=AlarmHandler, name='alarm'),
            ('/login', ShowLogin),
            ('/loginsave',SaveLogin),
            ('/logout', PerformLogout),
            #a partir daqui sim pode-se chamar o app/index.html e deixar os pedidos todos irem para ele *all of them*
            (r'/.*', MainHandler),
           ], debug=True, config=config)
