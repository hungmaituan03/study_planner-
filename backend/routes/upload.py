from fastapi import APIRouter, UploadFile, File
import os
import shutil
import sys
sys.path.insert(0, '/Users/davidmai/Documents/personal_project/study_planner/backend')
from file_processing import extract_text_from_pdf, extract_text_from_pptx

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text based on file type
    text = ""
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".pptx"):
        text = extract_text_from_pptx(file_path)
    else:
        return {"error": "Unsupported file type"}

    return {"filename": file.filename, "extracted_text": text}
