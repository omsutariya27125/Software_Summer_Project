from datetime import datetime

from fastapi import APIRouter, Header, HTTPException

from auth import get_username_from_auth
from db import attempt_collection, question_collection
from models.submitAnswer import *

router = APIRouter()


@router.post("/attempt")
def submit_answer(
    body: Attempt,
    authorization: str = Header(...)
):

    username = get_username_from_auth(authorization=authorization)

    question = question_collection.find_one({
        "question_id" : body.question_id
    })
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = (body.selected_option == question["answer"])
    
    attempt_collection.insert_one({
    
    "username": username,

    "question_id": body.question_id,

    "topic": question["topic"],

    "chapter": question["chapter"],

    "difficulty": question["difficulty"],

    "selected_option": body.selected_option,

    "correct": is_correct,

    "time_taken": body.time_taken,

    "attempted_at": datetime.utcnow()

    })

    return{
        "success": True,
        "correct": is_correct,
        "correct_option": question["answer"]
    }
