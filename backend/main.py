from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, study_plan
import uvicorn

app = FastAPI()
list = ["http://localhost:3000",]
app.add_middleware(
    CORSMiddleware,
    allow_origins=list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(study_plan.router)


if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True)