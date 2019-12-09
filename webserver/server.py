import os
from flask import Flask, redirect, url_for
from blueprints.client import user
from blueprints.admin import administrator

application = Flask(__name__)
application.register_blueprint(user)
application.register_blueprint(administrator)

@application.route("/")
def client_index():
    return redirect(url_for("user.client_login"))

port = os.environ.get("PORT", 5001)
application.secret_key = os.urandom(12)
application.run(debug=False, port=port, host="0.0.0.0")