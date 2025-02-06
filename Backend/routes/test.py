from flask import Blueprint, request, jsonify
from models.test import Test
from bson.objectid import ObjectId

test_bp = Blueprint("test", __name__)

@test_bp.route("/create", methods=["POST"])
def create_test():
    data = request.get_json()
    if not data or "title" not in data or "questions" not in data:
        return jsonify({"msg": "Invalid test data"}), 400
    
    test_id = Test.create_test(data)
    return jsonify({"msg": "Test created successfully", "test_id": test_id}), 201

@test_bp.route("/all", methods=["GET"])
def get_tests():
    tests = Test.get_all_tests()
    return jsonify(tests), 200

@test_bp.route("/<test_id>", methods=["GET"])
def get_test(test_id):
    test = Test.get_test_by_id(test_id)
    if not test:
        return jsonify({"msg": "Test not found"}), 404
    return jsonify(test), 200

@test_bp.route("/submit", methods=["POST"])
def submit_test():
    data = request.get_json()
    if not data or "test_id" not in data or "student_id" not in data or "answers" not in data:
        return jsonify({"msg": "Invalid submission data"}), 400
    
    Test.submit_test(data["test_id"], data["student_id"], data["answers"])
    return jsonify({"msg": "Test submitted successfully"}), 200

@test_bp.route("/results/<student_id>", methods=["GET"])
def get_results(student_id):
    results = Test.get_results(student_id)
    return jsonify(results), 200
