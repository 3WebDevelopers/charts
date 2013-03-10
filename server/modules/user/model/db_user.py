from google.appengine.ext import db


    
class User(db.Model):
    email       = db.StringProperty(indexed = True)
    password    = db.StringProperty()
    date        = db.DateTimeProperty(auto_now_add=True)
    
    def user_key(self, user_email):
        return db.Key.from_path('User', user_email)

    #returns user or false
    def find_user(self, user_email):
        q = db.Query(User)
        result = q.filter('email =', user_email).fetch(limit=1)
        
        if len(result) == 1:
            return result[0]
        else:
            return False
        
    def find_registered_user(self, user_email, user_password):
        q = db.Query(User)
        q.filter('email =', user_email)
        q.filter('password = ', user_password)
        result = q.fetch(limit=1)
        
        if len(result) == 1:
             return result[0]              
        else:
             return False
            
    def delete_user(self, email):
        try:        
            user = self.find_user(email)
            if user != False:
                """ DELETE the son """
                from db_user_profile import UserProfile
                up = UserProfile()
                up.delete_user_profile(user.key())
                
                """ DELETE the father """
                e = db.get(user.key())
                db.delete(e)
                return True
            return False
        except Exception:
            return False
    
    def save_new_user(self, user_email, user_password):        
        self.email      = user_email
        self.password   = user_password
        user_key = self.put()       
        
        """ Create default user profile on register """        
        from db_user_profile import UserProfile        
        u = UserProfile(parent = user_key)        
        u.save_new_profile(name = "n/a") #God I hope the delay will not return error here.
       
        
    #not prepared for cloud - there is no limit
    def user_list(self):
        return db.GqlQuery("SELECT * "
                           "FROM User "
                           "ORDER BY date DESC LIMIT 10")
        
    def user_list_special(self):
        from db_user_profile import UserProfile
        
        user_profile_query = UserProfile.all()
        user_profile_query.ancestor(db.Key.from_path('User', "GWc/Aayx4iIj4VFxTdm5fnS9KnzrlTy2JvjHd0BcPao="))
        
        return user_profile_query.run(limit=5)

        
        
        
        
        