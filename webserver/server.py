import os
import requests
from flask import Flask, render_template, request, redirect, url_for, make_response, send_from_directory, jsonify

from utils.apiUtil import APIRequest
from utils.db import Database
from utils.pathManipulator import PathManipulator
from utils.qrcode import GenerateQRCode

application = app = Flask(__name__)

# Admin

# Dashboard
@app.route("/JustShareIt/dashboard/admin", methods = ["GET", "POST"])
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
            
            if not post_success:
                raise ValueError("Failed to add file, POST Response: " + str(response))

            # Render index page
            return redirect(url_for('index'))

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)
    
    # GET
    elif request.method == "GET":

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

            # Generate QRCode
            if not os.path.isfile("../static/img/qrcode/qr.svg"):
                qrcode = GenerateQRCode()
                qrcode.store_code("http://" + request.host + "/JustShareIt/dashboard")

            # GET request to API
            response = obj.get("/user/request/all", {})

            # list of visiters
            approved = response[0]["message"]["approved"]
            waiting = response[0]["message"]["waiting"]

            # Render index page
            return render_template("index.html", files=res, qr_code_address="http://" + request.host + "/JustShareIt/dashboard", approved=approved, waiting=waiting)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

# Approve user request
@app.route("/JustShareIt/user/approve", methods = ["PUT"])
def approve():

    if request.method == "PUT":

        try:

            # Fetch passed parameters
            username = request.args.get('username')
            
            # PUT request to API
            obj = APIRequest()
            response = obj.put("/user/request", {
                "username" : username
            })

            success = response["success"]
            if not success:
                raise ValueError("Failed to approve user, PUT Response: " + str(response))
            
            # Make Response
            return make_response(jsonify({'success':True, 'error':None, 'message':username}), 200)
        
        # Report Exception
        except Exception as error:
            
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Reject user request
@app.route("/JustShareIt/user/reject", methods = ["DELETE"])
def reject():

    if request.method == "DELETE":

        try:

            # Fetch passed parameters
            username = request.args.get('username')
            
            # DELETE request to API
            obj = APIRequest()
            response = obj.delete("/user/request", {
                "username" : username
            })

            success = response["success"]
            if not success:
                raise ValueError("Failed to delete user, DELETE Response: " + str(response))
            
            # Make response
            return make_response(jsonify({'success':True, 'error':None, 'message':username}), 200)
        
        # Report Exception
        except Exception as error:
            
            return make_response(jsonify({'success':False, 'error':str(error), 'message':None}), 500)

# Remove added file
@app.route("/JustShareIt/admin/delete/file", methods = ["DELETE"])
def delete():

    # DELETE
    if request.method == "DELETE":

        try:
            
            # Fetch passed arguments
            filename = request.args.get('filename')
            
            # DELETE request to API
            obj = APIRequest()
            response = obj.delete("/cache", {
                "filename" : filename
            })
            delete_success = response["success"]
            
            # ------------Not working------------
            if not delete_success:
                raise ValueError("Failed to delete file, DELETE Response: " + str(response))
            # -----------------------------------

            # Render index page
            return redirect(url_for('index'))

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

# Client

# Client Landing Page
@app.route("/JustShareIt", methods = ["GET", "POST"])
def client_login():

    # GET
    if request.method == "GET":

        try:
            
            # Fetch passed parameters
            username = request.args.get("username")
            
            # If username provided
            if username:

                # GET request to API
                obj = APIRequest()
                response = obj.get("/user/request", {
                    "username" : username
                })

                # If user is approved
                if response["message"]["access"] == "1":
                    return redirect(url_for("user_dashboard"))
                # elif user is not approved
                elif response["message"]["access"] == "0":
                    return render_template("client_login.html", requested=True)      
                # else user hasn't requested
                else:
                    return render_template("client_login.html", clear_cookie=True)                    

            # Render client login page
            return render_template("client_login.html", requested=False, error=False)
        
        # Report Exception
        except Exception as error:
            
            return render_template("wrong.html", error=error)

    # POST
    elif request.method == "POST":

        try:

            # Fetch form data
            username = request.form.get("username")
            
            # PUT request to API
            obj = APIRequest()
            response = obj.post("/user/request", {
                "username" : username
            })

            success = response["success"]
            if not success:
                raise ValueError("Failed to submit request for user, POST Response: " + str(response))
            
            
            # Render client login page
            return render_template("client_login.html", requested=True, error=False)
        
        # Report Exception
        except Exception as error:
            
            return render_template("client_login.html", requested=False, error=error)

# File sharing dashboard
@app.route("/JustShareIt/dashboard", methods = ["GET"])
def user_dashboard():

    # GET
    if request.method == "GET":

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
            return render_template("share.html", files=res, admin_name="Adisakshya Chauhan")

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

# Share File
@app.route("/JustShareIt/client/share", methods = ["GET"])
def share_file():

    # GET
    if request.method == "GET":

        try:
            
            # Fetch passed parameters
            filename = request.args.get('filename')
            
            # DB Instance
            obj = Database()

            # Get value by key
            file_path = obj.get(filename)
            if not file_path:
                res = {
                    'no_files': True
                }
                return res

            # Manipulate file path
            manipObj = PathManipulator("JustShareIt/data")
            file_path = manipObj.path_in_mount(file_path)

            # Send file as attachment
            return send_from_directory(file_path, filename=filename, as_attachment=True)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

if __name__ == "__main__":
    
    port = os.environ.get("PORT", 5001)
    app.run(debug = True, host="0.0.0.0", port=port)