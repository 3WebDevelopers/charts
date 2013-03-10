from google.appengine.ext import db


    
class UserProfile(db.Model):
    name        = db.StringProperty()
    
    def user_profile_key(self, userkey):
        return db.Key.from_path('UserProfile', userkey)

    #returns user or false
    def get_user_profile(self, userkey):
        q = db.Query(UserProfile)
        result = q.filter('userkey =', userkey).fetch(limit=1)
        
        if len(result) == 1:
            return result[0]
        else:
            return False 
             
         
    def save_new_profile(self, name = "n/a"):
        self.name      = name
        self.put()   
        
    """
    @todo: code this stuff!
    """
    def user_profile_list(self):
        print "stuff"
    
    def delete_user_profile(self, ancestor_key): 
        q = db.GqlQuery('SELECT * FROM UserProfile WHERE ANCESTOR IS :1 LIMIT 1', ancestor_key)[0]
        q.delete()
