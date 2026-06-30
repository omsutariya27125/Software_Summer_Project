from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from passlib.context import CryptContext

#url = "my-url"

#client = MongoClient(url)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
try:
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB Atlas!")

except Exception as e:
    print(f"connection failed :{e}")

db = client["Sample"]
user_collection = db["Users"]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # OK while developing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
fakedb= {}

class User(BaseModel):
    username:str
    password:str

class UserRegistration(BaseModel):
        name:str
        email:str
        username:str
        password:str

@app.post("/login")
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
         return{
              "Success": True,
              "message": "Welcome to our platform."
         }


@app.post("/register")
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
    

    
   

