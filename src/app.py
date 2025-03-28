import os
from dotenv import load_dotenv
from autorization import auth_bp
from handler import handlers_bp
from models import db
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# from config import SQLALCHEMY_DATABASE_URI, JWT_SECRET_KEY

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(handlers_bp)
app.register_blueprint(auth_bp)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

with app.app_context():
    db.create_all()


@app.route("/favicon.ico")
def favicon():
    return "", 204


if __name__ == "__main__":
    app.run(debug=True)
