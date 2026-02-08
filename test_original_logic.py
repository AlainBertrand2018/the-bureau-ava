import pandas as pd
import google.generativeai as genai
import time
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

# Use Gemini 1.5 Flash for speed and cost-efficiency
model = genai.GenerativeModel('gemini-1.5-flash')

# --- THE SYNTHETIC POPULATION ---
personas = [
    {
        "id": "P001", "name": "Sarah", "age": 24, "location": "Ebène",
        "occupation": "Junior Auditor", "income_level": "Middle-High",
        "traits": "Tech-savvy, skeptical of marketing, busy."
    }
]

# --- THE CLIENT SURVEY ---
survey_questions = [
    "Q1: On a scale of 1-10, how concerned are you about food prices?"
]

def run_simulation():
    results = []
    for p in personas:
        system_instruction = (
            f"You are a persona simulation. You are NOT an AI assistant. "
            f"Roleplay as: {p['name']}, {p['age']}, from {p['location']}. "
            f"Job: {p['occupation']}. Traits: {p['traits']}. "
            f"Rules: Be honest. If confused, say so. If it's too expensive, reject it."
        )
        agent_data = {"Agent": p['name'], "Demographic": f"{p['age']}/{p['location']}"}
        for q in survey_questions:
            try:
                prompt = f"{system_instruction}\n\nQUESTION: {q}\n\nANSWER:"
                response = model.generate_content(prompt)
                print(f"Response: {response.text.strip()}")
                agent_data[q] = response.text.strip()
            except Exception as e:
                print(f"Error: {e}")
                agent_data[q] = "ERROR"
        results.append(agent_data)
    return results

if __name__ == "__main__":
    run_simulation()
