""" 
This is the base library of auxiliary code.
"""

import os, string, json
from google.appengine.ext.webapp import template
             
def dump(obj):
    '''return a printable representation of an object for debugging'''
    newobj=obj
    if '__dict__' in dir(obj):
        newobj=obj.__dict__
        if ' object at ' in str(obj) and not newobj.has_key('__type__'):
            newobj['__type__']=str(obj)
    for attr in newobj:
        newobj[attr]=dump(newobj[attr])
    return newobj
    

class stdClass(object): pass
""" example usage: 
        data = []
         
        for item in response_headers:
            obj = stdClass()
            obj.header = item
            obj.content = response_headers[item]
            data.append(obj)
"""

class baseLib():
    """
    @warning: Should be included in all request handlers!
    @summary: Renders a page either in html or json
    @requires: template_values, jsonOutput 
    
    @param template_values: Array, of values to replace with templating engine 
    @param jsonOutput: Boolean
    @param moduleName: String, only if jsonOutput is False
    @param fileName: String, only if jsonOutput is False
    """      
    def renderpage(self, template_values = { }, jsonOutput = False,  moduleName = None, fileName = None):        
        if jsonOutput:
            self.response.headers['Content-Type'] = 'application/json'
            output  = json.dumps(template_values)
        else:
            self.response.headers['Content-Type'] = 'text/html'
            name    = moduleName + "/view/" + fileName
            path    = os.path.join(os.path.dirname(__file__), name)
            output  = template.render(path, template_values)
       
        self.response.out.write(output)
 











