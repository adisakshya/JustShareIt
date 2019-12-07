import os
from flask import Flask
from blueprints.client import user
from blueprints.admin import administrator

application = Flask(__name__)
application.register_blueprint(user)
application.register_blueprint(administrator)

port = os.environ.get("PORT", 5001)
application.run(debug=False, port=port, host="0.0.0.0")