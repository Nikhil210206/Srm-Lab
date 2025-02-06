from flask_pymongo import PyMongo
from bson.objectid import ObjectId

mongo = PyMongo()

class Test:
    @staticmethod
    def create_test(test_data):
        """Insert a new test into the database."""
        test_id = mongo.db.tests.insert_one(test_data).inserted_id
        return str(test_id)

    @staticmethod
    def get_all_tests():
        """Retrieve all available tests."""
        tests = list(mongo.db.tests.find({}, {"questions": 0}))
        return tests

    @staticmethod
    def get_test_by_id(test_id):
        """Retrieve a specific test by ID."""
        return mongo.db.tests.find_one({"_id": ObjectId(test_id)})

    @staticmethod
    def submit_test(test_id, student_id, answers):
        """Store a student's test attempt."""
        mongo.db.results.insert_one({
            "test_id": ObjectId(test_id),
            "student_id": student_id,
            "answers": answers
        })
        return True

    @staticmethod
    def get_results(student_id):
        """Fetch test results for a student."""
        return list(mongo.db.results.find({"student_id": student_id}))
