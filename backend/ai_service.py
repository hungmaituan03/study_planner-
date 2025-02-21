from openai import OpenAI
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def calculate_days_until_deadline(deadline):
    """Calculate the number of days available until the given deadline."""
    today = datetime.today().date()
    deadline_date = datetime.strptime(deadline, "%Y-%m-%d").date()
    available_days = (deadline_date - today).days
    return max(available_days, 1)  # Ensure at least 1 day

def generate_study_plan(text, study_time, deadline):
    """Generate a structured study plan based on study material, study time, and deadline."""
    
    available_days = calculate_days_until_deadline(deadline)
    hours_per_day = round(study_time / available_days, 2)

    prompt = f"""
    Given the following study material:
    {text}
    Generate a study plan, knowing that I have {hours_per_day} hours to study starting from today and have {available_days} days left to study.
    """

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Generate a structured, time-bound study plan strictly following the user's constraints."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    
    return response.choices[0].message.content
