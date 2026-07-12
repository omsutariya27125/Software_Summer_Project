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
    


