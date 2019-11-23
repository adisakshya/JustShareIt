import os
import sys
from flask import Flask, send_file, send_from_directory, safe_join, abort

application = app = Flask(__name__)

app.config["CLIENT_FILE"] = sys.argv[1]

@app.route("/get-file/<file_name>")
def get_file(file_name):

    try:
        return send_from_directory(app.config["CLIENT_FILE"], filename=file_name, as_attachment=False)
    except FileNotFoundError:
        abort(404)

if __name__ == "__main__":
    
    port = os.environ.get("PORT", 5000)
    app.run(debug=True, host="127.0.0.1", port=port)