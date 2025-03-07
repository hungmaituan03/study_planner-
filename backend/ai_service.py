from openai import OpenAI
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_study_plan_ui(text, deadline, studyTime):
    prompt = f"""
    You are a study planner. Make a UI study planner based on the input below:
    I am a student who wants to study this material: {text}. 
    I dedicate {studyTime} hours per day for {deadline} days. 
    """

    response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You are a UI generator AI. Convert the study plan into a structured UI."},
            {"role": "user", "content": prompt}
        ],
        response_format={
            "type": "object",
            "properties": {
                "courseTitle": {
                    "type": "string",
                    "description": "The title of the course, e.g., 'CS 351: Introduction to Cyber Security Study Plan'."
                },
                "assignments": {
                    "type": "array",
                    "description": "A list of assignments for the course.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "assignmentNumber": {
                                "type": "string",
                                "description": "The identifier for the assignment, e.g., 'Assignment 1'."
                            },
                            "goal": {
                                "type": "string",
                                "description": "The goal or objective of the assignment."
                            },
                            "tasks": {
                                "type": "array",
                                "description": "A list of tasks to complete for the assignment.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "description": {
                                            "type": "string",
                                            "description": "A detailed description of the task."
                                        },
                                        "studyTime": {
                                            "type": "string",
                                            "description": "The recommended time to spend on the task, e.g., '45 minutes'."
                                        }
                                    },
                                    "required": ["description", "studyTime"]
                                }
                            }
                        },
                        "required": ["assignmentNumber", "goal", "tasks"]
                    }
                }
            },
            "required": ["courseTitle", "assignments"]
        },
        temperature=0,
        top_p=0,
        max_tokens=2000
    )

    output = json.loads(response.choices[0].message.content)
    return output
