import os, string, webapp2
from google.appengine.ext.webapp import template
from modules import baseLib
 
moduleName = string.split(os.path.realpath(__file__), "/")[-3]

class index_handler(webapp2.RequestHandler, baseLib):     
    def get(self):
        template_values = {
            'greetings': "greetings world. I am here for you!"
        }
        self.renderpage(template_values, False, moduleName, "index.html")
