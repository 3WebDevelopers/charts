import webapp2
from webapp2_extras import sessions

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
        if username == "yardcharts":
            if password == "greatday":
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
