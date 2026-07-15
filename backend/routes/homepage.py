from fastapi import APIRouter, Header, HTTPException

from auth import get_username_from_auth
from db import attempt_collection, question_collection, user_collection, chapter_collection

router = APIRouter()

DEFAULT_TOPICS = {
    "Calculus": ["Limits", "Differentiation", "Definite Integration"],
    "Linear Algebra": ["Matrices", "Determinants"],
    "Trigonometry": ["Identities", "Functions", "Equations"],
    "Coordinate Geometry": ["Straight Lines", "Circles", "Conic Sections"],
    "Probability": ["Basic Probability", "Axioms", "Distributions"],
    "Complex Numbers": ["Algebra", "Polar Form"],
    "Vectors": ["Dot Product", "Magnitude", "Cross Product"],
    "3D Geometry": ["Distance Formula", "Planes", "Lines"],
}


def slugify_topic(topic: str) -> str:
    return "-".join(part for part in "".join(char.lower() if char.isalnum() else " " for char in topic).split())


def username_from_token(token: str | None = None, authorization: str | None = None):
    return get_username_from_auth(token, authorization)


@router.get("/homepage")
def home(token: str | None = None, authorization: str | None = Header(default=None)):
     username = username_from_token(token, authorization)
     user = user_collection.find_one({
          "username" : username
     }) or {"name": username, "username": username}
     total_questions_solved = attempt_collection.count_documents({
          "username" : username
     })

     correct_questions = attempt_collection.count_documents({
          "username" : username,
          "correct": True
     })
     
     if total_questions_solved == 0:
      accuracy_score = 0
     else:
        accuracy_score = (correct_questions / total_questions_solved) * 100

     attempts =  attempt_collection.find({
         "username": username
     })
     unique_chapters = {q["chapter"] for q in attempts}

     chapters_attempted = len(unique_chapters)

     return {
          "success": True,
          "user":{
               "name": user["name"],
               "username": user["username"]
          },
          "overall":{
               "chapters_attempted":chapters_attempted,

        "questions_solved":total_questions_solved,

        "accuracy":round(accuracy_score, 1),

        "activity":85

    },

    "weekly":{

        "days":[
            "Mon","Tue","Wed","Thu","Fri","Sat","Sun"
        ],

        "hours":[
            1.5,2.2,1.8,2.5,3,2,2.7
        ],

        "streak":[
            7,14,21,23,23,23,23
        ]

    },

    "leaderboard":[
        {
            "rank":1,
            "username":"Ananya",
            "questionsSolved":2890,
            "accuracy":92,
            "score":98
        }
    ]

}

@router.get("/topics_progression")
def topicwise(token: str | None = None, authorization: str | None = Header(default=None)):
     username = username_from_token(token, authorization)

     attempts = attempt_collection.find({
         "username": username
     })     

     questions = question_collection.find()

     attempt_counts={}
     question_counts = {}
     
     for a in attempts:

        topic = a["topic"]

        attempt_counts[topic] = attempt_counts.get(topic, 0) + 1
    
     for q in questions:

        topic = q["topic"]

        question_counts[topic] = question_counts.get(topic, 0) + 1

     topics = []

     for topic in DEFAULT_TOPICS:
        question_counts.setdefault(topic, len(DEFAULT_TOPICS[topic]))

     for topic,total in question_counts.items():

        attempted = attempt_counts.get(topic,0)

        if attempted == 0:

            status = "not_started"

        elif attempted >= total:

            status = "completed"

        else:

            status = "in_progress"

        topics.append({

            "name":topic,

            "status":status

        })

     return {
         "topics":topics
     }

@router.get("/chapters/{topic_slug}")
def chapters(topic_slug: str, token: str | None = None, authorization: str | None = Header(default=None)):
     username_from_token(token, authorization)

     topic_name = next((topic for topic in DEFAULT_TOPICS if slugify_topic(topic) == topic_slug), None)
     if topic_name is None:
          raise HTTPException(status_code=404, detail="Topic not found")

     questions = question_collection.find({"topic": topic_name})
     chapter_counts = {}
     for question in questions:
          chapter = question.get("chapter")
          if chapter:
               chapter_counts[chapter] = chapter_counts.get(chapter, 0) + 1

     chapters_payload = [
          {
               "name": chapter,
               "question_count": chapter_counts.get(chapter, 0),
          }
          for chapter in DEFAULT_TOPICS[topic_name]
     ]

     return {
          "success": True,
          "topic": topic_name,
          "chapters": chapters_payload,
          "total_questions": sum(chapter["question_count"] for chapter in chapters_payload),
          "topics": list(DEFAULT_TOPICS.keys()),
     }

@router.get("/chapter")
def get_chapter(chapter: bool = False, token: str | None = None, authorization: str | None = Header(default=None)):
    username_from_token(token, authorization)

    if(chapter):
        chapters_list = list(chapter_collection.find({}, {"_id": 0, "Topic": 1, "Chapters": 1}))
        if not chapters_list:
            raise HTTPException(status_code=404, detail="No chapters found.")
        return {
            "success": True,
            "data": chapters_list
        }
    else:
        topic_list = list(chapter_collection.find({}, {"_id": 0, "Topic": 1}))
        if not topic_list:
            raise HTTPException(status_code=404, detail="No topics found.")
        return {
            "success": True,
            "topics": topic_list
        }

    # chapter_data = chapter_collection.find_one({"chapter": chapter})
    # if not chapter_data:
    #     raise HTTPException(status_code=404, detail="Chapter not found")

    # return {
    #     "success": True,
    #     "chapter": chapter_data
    # }