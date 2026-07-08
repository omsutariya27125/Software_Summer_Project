from pydantic import BaseModel

class User(BaseModel):

    username:str
    password:str


class UserRegistration(BaseModel):

    name:str
    email:str
    username:str
    password:str