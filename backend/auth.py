import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ALGORITHM
from fastapi import HTTPException
from jose.exceptions import JWTError

class PasswordContext:
    def hash(self, password: str) -> str:
        password_bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode("utf-8")

    def verify(self, password: str, hashed_password: str) -> bool:
        try:
            password_bytes = password.encode("utf-8")
            hashed_bytes = hashed_password.encode("utf-8")
            return bcrypt.checkpw(password_bytes, hashed_bytes)
        except Exception:
            return False

pwd_context = PasswordContext()

def create_access_token(data: dict):
     to_encode = data.copy()
     expire = datetime.utcnow() + timedelta(minutes=30 * 1440)
     to_encode.update({"exp": expire})

     encoded_jwt = jwt.encode(
          to_encode,
          SECRET_KEY,
          algorithm=ALGORITHM
     )

     return encoded_jwt

def verify_jwt(token: str):
     try:
          payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
          username = payload.get("sub")
          if not username:
               raise HTTPException(status_code=401, detail="Token payload is missing the subject claim")
          return username
     except JWTError as e:
          raise HTTPException(status_code=401, detail=f"Invalid or expired authentication token: {str(e)}")

def get_username_from_auth(token: str | None = None, authorization: str | None = None) -> str:
     bearer_token = token
     if authorization and authorization.lower().startswith("bearer "):
          bearer_token = authorization.split(" ", 1)[1]
     elif authorization:
          bearer_token = authorization
     
     if not bearer_token:
          raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
          
     return verify_jwt(bearer_token)
