from pymongo import MongoClient

from config import MONGO_URL

client = MongoClient(MONGO_URL)
db = client["Sample"]

user_collection = db["Users"]
question_collection = db["Questions"]
attempt_collection = db["Attempts"]
chapter_collection = db["Chapters"]
