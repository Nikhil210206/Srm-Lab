from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
mongo = PyMongo()
bcrypt = Bcrypt()
class User:
    def __init__(self, email, password):
        self.email = email
        self.password = password
    @staticmethod
    def get_user_by_email(email):
        return mongo.db.users.find_one({"email": email})
    @staticmethod
    def create_user(email, password):
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        mongo.db.users.insert_one({"email": email, "password": hashed_password})