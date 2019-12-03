import os
from flask import Flask, send_from_directory, make_response, jsonify
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

from utils.db import Database

application = app = Flask(__name__)
CORS(app)
api = Api(app)

# API

# File Cache Management
class FileCache(Resource):

    # Constructor
    def __init__(self):
        
        # DB Instance
        self.dbObj = Database()

    # GET
    # Returns cached files
    def get(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('filename', type=str, help='Filename')
            args = parser.parse_args()

            _fileName = args['filename']

            # Get value by key from cache
            value = {
                'path': self.dbObj.get(_fileName)
            }

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':value}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)
    
    # POST
    # Cache new file
    def post(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('filename', type=str, help='Filename')
            parser.add_argument('path', type=str, help='File Path on system')
            args = parser.parse_args()

            _fileName = args['filename']
            _path = args['path']
            
            # Cache file
            self.dbObj.insert(_fileName, _path)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'filename' : _fileName}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)
    
    # DELETE
    # Delete cached file
    def delete(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('filename', type=str, help='Filename')
            args = parser.parse_args()

            _fileName = args['filename']
            
            # Delete cached file
            self.dbObj.delete(_fileName)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'filename' : _fileName}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Clear all cached file data
class ClearCache(Resource):

    # Constructor
    def __init__(self):
        
        # DB Instance
        self.dbObj = Database()
    
    # DELETE
    # Clear DB
    def delete(self):

        try:
            
            # Clear cached DB
            self.dbObj.clear()

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':None}, 200))
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Client/Admin Dashboard
class Dashboard(Resource):

    # Constructor
    def __init__(self):
        
        # DB Instance
        self.dbObj = Database()
    
    # GET
    # Return all cached filenames
    def get(self):

        try:
            
            # Get all cached files
            keys = self.dbObj.get_all_keys()
            for i in range(len(keys)):
                keys[i] = keys[i].decode('utf-8')

            # Set isEmpty flag
            isEmpty = True if not keys else False

            # Response Data
            res = {
                'empty' : isEmpty,
                'key_list' : keys
            }

            # Return response
            # return isEmpty
            return make_response(jsonify({'success':True, 'error':None, 'message':res}, 200))
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# User Request Handler
class UserRequests(Resource):

    # Constructor
    def __init__(self):
        
        # DB Instance
        self.dbObj = Database(index=1)
    
    # GET
    # Returns user access flag
    def get(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('username', type=str, help='Username')
            args = parser.parse_args()

            _username = args['username']

            # Get value by key from cache
            value = {
                'access': self.dbObj.get(_username)
            }

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':value}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)
    
    # POST
    # Cache new user
    def post(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('username', type=str, help='Username')
            args = parser.parse_args()

            _username = args['username']
            _access = 0

            # Cache user
            self.dbObj.insert(_username, _access)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'username' : _username}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)
    
    # PUT
    # Update user cache
    def put(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('username', type=str, help='Username')
            args = parser.parse_args()

            _username = args['username']
            _access = 1

            # Update cache
            self.dbObj.insert(_username, _access)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'username' : _username}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

    # DELETE
    # Delete cached user
    def delete(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('username', type=str, help='Username')
            args = parser.parse_args()

            _username = args['username']
            
            # Delete cached user
            self.dbObj.delete(_username)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'username' : _username}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Request Notifications Handler
class RequestNotification(Resource):

    # Constructor
    def __init__(self):
        
        # DB Instance
        self.dbObj = Database(index=1)
    
    # GET
    # Return all cached users
    def get(self):

        try:
            
            # Get all cached files
            keys = self.dbObj.get_all_keys()
            for i in range(len(keys)):
                keys[i] = keys[i].decode('utf-8')

            # Set isEmpty flag
            isEmpty = True if not keys else False

            approved_users = []
            waiting_users = []
            if not isEmpty:
                for key in keys:
                    flag = self.dbObj.get(key)
                    if int(flag):
                        approved_users.append(key)
                    else:
                        waiting_users.append(key)

            # Response Data
            res = {
                'empty' : isEmpty,
                'approved' : approved_users,
                "waiting" : waiting_users
            }

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':res}, 200))
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# API Resources
api.add_resource(FileCache, '/api/cache')
api.add_resource(Dashboard, '/api/dashboard')
api.add_resource(ClearCache, '/api/clear/cache')
api.add_resource(UserRequests, '/api/user/request')
api.add_resource(RequestNotification, '/api/user/request/all')

if __name__ == "__main__":
    
    port = os.environ.get("PORT", 5000)
    app.run(debug=True, host="0.0.0.0", port=port)
