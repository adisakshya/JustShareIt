import os
from flask import Flask, send_from_directory, make_response
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

from utils.db import Database

application = app = Flask(__name__)
CORS(app)
api = Api(app)

# API

# Cache Management
class Cache(Resource):

    # GET
    # Returns cached files
    def get(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('filename', type=str, help='Filename')
            args = parser.parse_args()

            _fileName = args['filename']
            
            # DB Instance
            obj = Database()

            # Get value by key from cache
            value = {
                'path': obj.get(_fileName)
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
            
            # DB Instance
            obj = Database()

            # Cache file
            obj.insert(_fileName, _path)

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
            
            # DB Instance
            obj = Database()

            # Delete cached file
            obj.delete(_fileName)

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':{'filename' : _fileName}}), 200)
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)
    
    # PURGE
    # Clear DB
    def purge(self):

        try:
            
            # DB Instance
            obj = Database()

            # Clear cached DB
            obj.clear()

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':None}, 200))
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Client/Admin Dashboard
class Dashboard(Resource):

    # GET
    # Return all cached filenames
    def get(self):

        try:
            
            # DB Instance
            obj = Database()

            # Clear cached DB
            keys = obj.get_all_keys()

            # Response Data
            res = {
                'key_list' : keys
            }

            # Return response
            return make_response(jsonify({'success':True, 'error':None, 'message':res}, 200))
        
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# File Sharing
class File(Resource):

    # GET
    # Return all cached filenames
    def get(self):

        try:
            
            # Parse the arguments
            parser = reqparse.RequestParser()
            parser.add_argument('filename', type=str, help='Filename')
            args = parser.parse_args()

            _fileName = args['filename']

            # DB Instance
            obj = Database()

            # Get value by key
            file_path = obj.get(_fileName)
            
            # Send file as attachment
            return send_from_directory(file_path, filename=_fileName, as_attachment=False)
            
        except Exception as error:
            
            # Report error
            print("[ERROR] ==>", error)
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# API Resources
api.add_resource(Cache, '/api/cache')
api.add_resource(Dashboard, '/api/dashboard')
api.add_resource(File, '/api/file')

if __name__ == "__main__":
    
    port = os.environ.get("PORT", 5000)
    app.run(debug=True, host="127.0.0.1", port=port)