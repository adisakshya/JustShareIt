import os
import requests
from flask import Flask, render_template, request

from util.apiUtil import APIRequest

application = app = Flask(__name__)

# Admin Page
@app.route("/",methods = ["GET", "POST"])
def index():
    
    # Initialize empty file list
    file_list = []

    # POST
    if request.method == "POST":
        
        try:
            
            # Fetch form data
            filename = request.form.get("filename")
            filepath = request.form.get("filepath")
            
            # POST request to API
            # Check if success
            obj = APIRequest()
            response = obj.post("/cache", {
                                    "filename" : filename,
                                    "path" : filepath
                                    })
            post_success = response["success"]
            
            # GET request to API
            response = obj.get("/dashboard", {})           

            # list of files
            file_list = response[0]["message"]["key_list"]
            
            # Response Variable
            res = {
                'post_success' : post_success,
                'file_list' : file_list,
                'number_of_files' : len(file_list)
            }

            # Render index page
            return render_template("index.html", files=res)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

    # GET
    else:

        try:
            
            # GET request to API
            obj = APIRequest()
            response = obj.get("/dashboard", {}) 

            # list of files
            file_list = response[0]["message"]["key_list"]
            
            # Response Variable
            res = {
                'file_list' : file_list,
                'number_of_files' : len(file_list)
            }

            # Render index page
            return render_template("index.html", files=res)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

if __name__ == "__main__":
    
    port = os.environ.get("PORT", 5000)
    app.run(debug = True, host="127.0.0.1", port=port)