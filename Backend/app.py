from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from models.user import mongo
app = Flask(__name__)
app.config.from_object(Config)
mongo.init_app(app)
CORS(app)
app.register_blueprint(auth_bp, url_prefix="/api/auth")
if __name__ == "__main__":
    app.run(debug=True)
