import os, sys, string

"""
The purpose of this code is to populate the namespace of auth/controller/*.py 
with the path for user/model so It can perform operations with user module->model.
"""

path = string.split(os.path.realpath(__file__), "/")
del path[len(path)-3:] # deletes auth/controller/<file>.py from the path
path = string.join(path, "/")        
sys.path.append(path+"/user/model")