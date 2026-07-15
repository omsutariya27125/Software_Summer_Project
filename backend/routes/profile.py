from fastapi import APIRouter, Header, HTTPException

from auth import get_username_from_auth
from db import user_collection
from models.users import FullUser

router = APIRouter()

@router.get("/profile")
def getProfileInfo(token: str | None = None, authorization: str | None = Header(default=None)):
    username = get_username_from_auth(token, authorization)
    
    User = user_collection.find_one({ "username": username }, {"_id": 0, "password": 0})
    if User is None:
        raise HTTPException(status_code=404, detail="User not found")

    return{
        "success": True,
        "userInfo": User
    }
        
        
@router.patch("/profile")
def changeProfileInfo(user: FullUser):

    result = user_collection.update_one(
        {"username": user.username},
        {
            "$set": {
                "name": user.name,
                "email": user.email,
                "dob": user.dob,
                "board": user.board
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "success": True,
        "message": "Profile updated successfully"
    }