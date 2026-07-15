from auth import get_username_from_auth
from fastapi import APIRouter, Header, HTTPException
from db import attempt_collection, question_collection
import random
router = APIRouter()

@router.get("/questions/{chapter}")
def get_questions(chapter: str, authorization: str = Header(...)):
    username = get_username_from_auth(authorization=authorization)
    
    attempted_ids = attempt_collection.distinct(
        "question_id",
        {
            "username" : username,
            "chapter": chapter
        }
    )

    unique_questions = list(question_collection.find({
        "chapter": chapter,
        "question_id": {"$nin": attempted_ids}
    }))

    if not unique_questions:
        raise HTTPException(
    status_code=404,
    detail="No unanswered questions left."
)

    question = random.choice(unique_questions)

    return{
        "success": True,
        "question": question
    }
    
@router.get("/q/{chapter}")
def get_q(chapter: str, authorization: str = Header(...)):
    
    questions = list(question_collection.find({"chapter": chapter}, {"_id": 0, "question_id": 1, "type": 1, "chapter": 1, "difficulty": 1, "question": 1, "options": 1, "correctOptionId": 1, "solution": 1}))

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this chapter.")

    return{
        "success": True,
        "question": questions
    }