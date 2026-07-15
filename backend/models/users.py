from pydantic import BaseModel

class User(BaseModel):

    username:str
    password:str


class UserRegistration(BaseModel):

    name:str
    email:str
    username:str
    password:str
    mobileNumber:str
    
    
class AcademicGoals(BaseModel):
    
    targetExam: str
    targetScore: float
    dailyQuestionGoal: int


class FullUser(BaseModel):
    
    name: str
    email: str
    username: str
    mobileNumber: str
    # academicGoals: AcademicGoals
    dob:str
    board:str