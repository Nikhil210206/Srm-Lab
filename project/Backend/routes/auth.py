from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import User, bcrypt
auth_bp = Blueprint("auth", __name__)
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if User.get_user_by_email(email):
        return jsonify({"msg": "User already exists"}), 400
    User.create_user(email, password)
    return jsonify({"msg": "User created successfully"}), 201
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.get_user_by_email(email)
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid credentials"}), 401
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200
