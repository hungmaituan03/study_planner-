from fastapi import APIRouter
from pydantic import BaseModel
import sys

sys.path.insert(0, '/Users/davidmai/Documents/personal_project/study_planner/backend')
from ai_service import generate_study_plan

router = APIRouter(prefix="/study-plan", tags=["Study Plan"])

class StudyPlanRequest(BaseModel):
    text: str
    study_time: int
    deadline: str

@router.post("/")
async def get_study_plan(request: StudyPlanRequest):
    study_plan = generate_study_plan(request.text, request.study_time, request.deadline)
    return {"study_plan": study_plan}
