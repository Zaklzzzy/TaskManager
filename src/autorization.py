from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin
from models import User
from models import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(
        username=username,
    ).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(
        identity={"id": user.id, "username": user.username}
    )
    return jsonify(access_token=access_token)


@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify({"message": f"Hello, {user['username']}"}), 200
