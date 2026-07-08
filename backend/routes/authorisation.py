from fastapi import APIRouter

from auth import create_access_token, pwd_context
from db import user_collection
from models.users import User, UserRegistration

router = APIRouter()


@router.post("/login")
def login(userlogin: User):
    user = user_collection.find_one({
         "username" : userlogin.username
    })

    if user is None:
         return {
              "Failure": False,
              "message": "Username not found"
         }
    else:
         if not pwd_context.verify(userlogin.password, user["password"]):
              return{
                    "Fail": False,
                    "message": "Wrong Password."
              }
         token = create_access_token({"sub": user["username"]})

         return{
              "Success": True,
              "access_token": token,
              "token_type": "bearer"
         }



@router.post("/register")
def register(new_user: UserRegistration):
         user = user_collection.find_one({
                 "$or":[
          {"username" : new_user.username},
          {"email": new_user.email}]
     })
         if user is not None:
              return{
                   "Fail": False,
                   "message":"Already registered with this credential, please try login"
              }
         hashed_pass = pwd_context.hash(new_user.password)
             
         user_collection.insert_one(
                   {
                        "name" : new_user.name,
                        "email" : new_user.email,
                        "username":new_user.username,
                        "password": hashed_pass
                   }
              )
         return{
          "Nicee":True,
          "message":"Succesfully Registered"
     }
