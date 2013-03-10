import sys, os, string, webapp2
from google.appengine.ext.webapp import template
from modules import baseLib

moduleName = string.split(os.path.realpath(__file__), "/")[-3]

""" ***************** REQUEST HANDLER ********************"""
class login_handler(webapp2.RequestHandler, baseLib):     
    def get(self):
        template_values = {
            'greetings': "greetings world. I am here for you!",
            'special':"Here you may log me in ^:-) if you know what I mean"
        }
        self.renderpage(template_values, False, moduleName, "login.html")
        
    def post(self):
         user_email      = self.request.get('email')
         user_password   = self.request.get('password')
        
         from encoder import *
         a = Encoder()        
         user_password       = a.encode_pass(user_email, user_password)
         user_email          = a.encode_email(user_email)

         from db_user import User
         user            = User()        
         old_user        = user.find_registered_user(user_email, user_password);         
          
         if old_user != False:
             user_status = "Hi you are logged in. Here goes teh cookie!"
         else:
             user_status = "YOUR PASSWORD IS WRONG. YOUR EMAIL IS WRONG. YOU ARE WRONG."
             self.response.set_status(401)
      
         status              = self.response.status         
         response_headers    = self.response.headers
         
         data = []         
         for item in response_headers:
             data.append(item+":"+response_headers[item])
            
         template_values = {
            'original_email'    : a.decode_email(user_email),
            'hashed_email'      : user_email,
            'hashed_password'   : user_password,
            'http_status'       : status,
            'response_headers'  : data,
            'user_status'       : user_status
         }
         self.renderpage(template_values, True)
        
""" ***************** REQUEST HANDLER ********************"""
class logout_handler(webapp2.RequestHandler, baseLib):     
    def get(self):        
        template_values = {
            'greetings': "Sad to see you go! bye :("
        }
        self.renderpage(template_values, False, moduleName, "logout.html")
        
""" ***************** REQUEST HANDLER ********************"""
class register_handler(webapp2.RequestHandler, baseLib):     
    def get(self):
        self.renderpage({"greetings":"Register here"}, False, moduleName, "register.html")
        
    def post(self):
        #try:  
        user_email      = self.request.get('email')
        user_password   = self.request.get('password')
            
        from encoder import *
        a = Encoder()        
        user_password       = a.encode_pass(user_email, user_password)
        user_email          = a.encode_email(user_email)
       
        from db_user import User
        user            = User()        
        old_user        = user.find_user(user_email);
        
        if old_user != False:
            user_status = "user exists, perform login"
            user_key = str(user.user_key(user_email))
        else:
            user_status = "new user created"
            user_key = user.save_new_user(user_email, user_password)
            """SUCCESS CREATED 201"""
            self.response.set_status(201)
            #now perform login
        
        # DEBUG OUTPUT
        status              = self.response.status #by default its 200
        response_headers    = self.response.headers
         
        data = []         
        for item in response_headers:
            data.append(item+":"+response_headers[item])
            
        template_values = {
            'decrypted_email'   : a.decode_email(user_email),
            'encrypted_email'   : user_email,
            'http_status'       : status,
            'response_headers'  : data,
            'user_status'       : user_status,
            'user_key'          : user_key
        }
    
        self.renderpage(template_values, True, moduleName, "register.html")
        """
        except:
            self.abort(500)
            
        """
        