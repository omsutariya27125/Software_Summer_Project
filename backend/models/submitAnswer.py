from pydantic import BaseModel

class Attempt(BaseModel):

    question_id:int
    selected_option:str
    time_taken: int