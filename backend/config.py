from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

MONGO_URL = os.getenv("url")

ACCESS_TOKEN_EXPIRATION_MINUTES = 30




