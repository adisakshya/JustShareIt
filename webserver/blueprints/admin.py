import os
from flask import Blueprint, render_template, redirect, make_response, jsonify, request, url_for

from utils.apiUtil import APIRequest
from utils.qrcode import GenerateQRCode

administrator = Blueprint("admin", "admin", url_prefix="/JustShareIt/admin")

# Admin

# Dashboard
@administrator.route("/dashboard", methods = ["GET", "POST"])
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
            return redirect(url_for('admin.index'))

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
                qrcode.store_code("http://" + request.host + "/JustShareIt/user")

            # GET request to API
            response = obj.get("/user/request/all", {})

            # list of visiters
            approved = response[0]["message"]["approved"]
            waiting = response[0]["message"]["waiting"]

            # Render index page
            return render_template("index.html", files=res, qr_code_address="http://" + request.host + "/JustShareIt/user", approved=approved, waiting=waiting)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

# Approve user request
@administrator.route("/approve/user", methods = ["PUT"])
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
@administrator.route("/reject/user", methods = ["DELETE"])
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
@administrator.route("/delete/file", methods = ["DELETE"])
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
            return redirect(url_for('admin.index'))

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)
