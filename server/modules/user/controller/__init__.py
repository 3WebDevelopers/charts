import os, sys, string

"""
appends path to ../model
"""
path = string.split(os.path.realpath(__file__), "/")
del path[len(path)-2:]
path = string.join(path, "/")        
sys.path.append(path+"/model")


"""
appends path to ../../auth/controller
"""
path = string.split(os.path.realpath(__file__), "/")
del path[len(path)-3:] # deletes auth/controller/<file>.py from the path
path = string.join(path, "/")        
sys.path.append(path+"/auth/controller")