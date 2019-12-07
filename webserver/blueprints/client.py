from flask import Blueprint, render_template, send_from_directory, request

from utils.apiUtil import APIRequest
from utils.db import Database
from utils.pathManipulator import PathManipulator
from utils.decorators import auth

user = Blueprint("user", "user", url_prefix="/JustShareIt/user")

# Client

# User Landing Page
@user.route("/", methods = ["GET", "POST"])
@auth.login_required
def client_login():

    if request.method == "POST":
    
        try:

            # Get username
            username = request.form.get("username")
                
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

            # Render dashboard page
            return render_template("share.html", files=res, admin_name="Adisakshya Chauhan", username=username)

        # Report Exception
        except Exception as error:

            return render_template("wrong.html", error=error)

# User Request
@user.route("/register", methods = ["POST"])
def register_user():

    # POST
    if request.method == "POST":

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

# Share File
@user.route("/share", methods = ["POST"])
@auth.login_required
def share_file():

    # GET
    if request.method == "POST":

        try:
            
            # Fetch passed parameters
            filename = request.form.get('filename')
            
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