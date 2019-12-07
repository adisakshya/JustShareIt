from functools import wraps
from flask import request, redirect, render_template
from utils.apiUtil import APIRequest

class auth:
    
    def admin_login_required(function):

        @wraps(function)
        def verify_admin(*args, **kwargs):

            # Get passcode
            passcode = request.form.get("passcode")

            # GET Request to API
            apiObj = APIRequest()
            response = apiObj.get("/admin/request", {
                "passcode" : username
            })

            # Verify Access
            if not response["error"] and response["message"]["access"]:
                return "Admin Login Required"

            return function(*args, **kwargs)

        return verify_admin

    def login_required(function):

        @wraps(function)
        def verify_user(*args, **kwargs):
            
            # Get username
            username = request.form.get('username')
            
            if not username:
                # Render client login page
                return render_template("client_login.html", requested=False)
            
            # GET Request to API
            apiObj = APIRequest()
            response = apiObj.get("/user/request", {
                "username" : username
            })

            # If user is not approved
            if not response["error"] and response["message"]["access"] == "0":
                return render_template("client_login.html", requested=True)      
            # elif user hasn't requested
            if not response["error"] and not response["message"]["access"]:
                return render_template("client_login.html", clear_cookie=True)

            return function(*args, **kwargs)
        
        return verify_user