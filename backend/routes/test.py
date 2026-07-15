from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import List
import random

from auth import get_username_from_auth
from db import question_collection, attempt_collection

router = APIRouter(prefix="/test", tags=["Test"])


class TestRequest(BaseModel):
    chapters: List[str]


@router.post("/test")
def start_test(
    request: TestRequest,
    authorization: str = Header(...)
):
    username = get_username_from_auth(authorization)

    if len(request.chapters) == 0:
        raise HTTPException(
            status_code=400,
            detail="No chapters selected."
        )

    questions = list(
        question_collection.find(
            {
                "chapter": {
                    "$in": request.chapters
                }
            },
            {"_id": 0}
        )
    )

    if len(questions) == 0:
        raise HTTPException(
            status_code=404,
            detail="No questions found."
        )

    attempted_ids = attempt_collection.distinct(
        "question_id",
        {
            "username": username
        }
    )

    available_questions = [
        q for q in questions
        if q["question_id"] not in attempted_ids
    ]

    if len(available_questions) == 0:
        available_questions = questions

    random.shuffle(available_questions)

    return {
        "success": True,
        "total_questions": len(available_questions),
        "questions": available_questions
    }