from google.appengine.ext import db

class db_session(db.Model):
    user_key    = db.StringProperty(indexed = True)
    session_key = db.StringProperty()
    date        = db.DateTimeProperty(auto_now_add=True)

    #get session by key
    def session_key(self, key):
        return db.Key.from_path('Session', key)
    
    #returns session or false
    def find_by_user_key(self, user_key):
        q = db.Query(Session)
        result = q.filter('user_key =', user_key).fetch(limit=1)
        
        if len(result) == 1:
            return result[0]
        else:
            return False
        
    def find_by_session_key(self, session_key):
        q = db.Query(Session)
        result = q.filter('session_key =', session_key).fetch(limit=1)
        
        if len(result) == 1:
            return result[0]
        else:
            return False
        
    def delete_session(self, session_key):
         try:        
            session = self.find_by_session_key(session_key)
            e = db.get(session.key())
            db.delete(e)   
            return True
         except Exception:
            return False
        
    def save_new_session(self, user_key, session_key):
        self.user_key      = user_key
        self.session_key   = session_key
        self.put()   
        