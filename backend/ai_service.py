# ai_service.py
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_study_plan(text, study_time, deadline):
    prompt = f"Create a study plan based on this material: {text}\nStudy time: {study_time} hours. Deadline: {deadline}."
    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[{"role": "system", "content": "Generate a structured study plan."},
              {"role": "user", "content": prompt}],
    max_tokens=500)
    return response.choices[0].message.content
