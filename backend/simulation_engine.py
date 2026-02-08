import json
import pandas as pd
from google import genai
from google.genai import types
import os
import asyncio
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class MarketSimulator:
    def __init__(self, api_key: str = None, model_name: str = "gemini-2.0-flash"):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set it in your environment or .env file.")
        
        # Initialize the modern SDK client with async support
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = model_name
        
    async def get_response(self, persona: Dict, question: str, retries: int = 3) -> str:
        # The "Soul" Injection (System Prompt)
        sys_instruct = (
            f"You are a persona simulation. You are NOT an AI assistant. "
            f"Roleplay as: {persona.get('name')}, {persona.get('age')}, from {persona.get('location')}. "
            f"Job: {persona.get('occupation')}. Traits: {persona.get('traits')}. "
            f"Rules: Be honest. If confused, say so. If it's too expensive, reject it."
        )
        
        for attempt in range(retries):
            try:
                # Use aio for async calls
                response = await self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=question,
                    config=types.GenerateContentConfig(
                        system_instruction=sys_instruct,
                        temperature=0.7
                    )
                )
                return response.text.strip()
            except Exception as e:
                print(f"Error on attempt {attempt + 1} for persona {persona.get('name')}: {e}")
                if attempt < retries - 1:
                    wait_time = (attempt + 1) * 2
                    await asyncio.sleep(wait_time)
                else:
                    return f"ERROR: {str(e)}"

    async def run_simulation(self, demographics: List[Dict], questions: List[str]):
        """Runs simulation using provided lists instead of files."""
        results = []
        for persona in demographics:
            row = {
                "Agent": persona.get('name', 'Unknown'),
                "Demographic": f"{persona.get('age', 'N/A')}/{persona.get('location', 'N/A')}"
            }
            # We can process questions in parallel or sequence. 
            # Given rate limits, let's stick to a slightly faster sequence with small sleeps or gathered tasks.
            tasks = []
            for q in questions:
                tasks.append(self.get_response(persona, q))
            
            answers = await asyncio.gather(*tasks)
            
            for q, answer in zip(questions, answers):
                row[q] = answer
            
            results.append(row)
            await asyncio.sleep(0.1) # Small gap between personas

        return pd.DataFrame(results)

    async def generate_personas(self, count: int, context: str) -> List[Dict]:
        """Uses AI to generate a synthetic population tailored to the survey context."""
        prompt = (
            f"Generate {count} unique and diverse personas for a market research study.\n"
            f"SURVEY CONTEXT: {context}\n"
            f"Return ONLY a JSON list of objects with these keys: 'name', 'age', 'location', 'occupation', 'traits'.\n"
            f"Ensure diversity in age, background, and attitude towards the context."
        )
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.8
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error generating personas: {e}")
            return [{"name": "Generic User", "age": 30, "location": "Global", "occupation": "Professional", "traits": "Neutral"}]

    async def generate_questions(self, context: str, count: int = 5) -> Dict:
        """Uses AI to suggest relevant survey questions and explains the strategy."""
        prompt = (
            f"Based on this survey context: '{context}', suggest {count} high-impact survey questions.\n"
            f"Format the output as a JSON object with two keys:\n"
            f"1. 'questions': A list of strings (the questions).\n"
            f"2. 'rationale': A brief explanation of why these questions were chosen for this specific context."
        )
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.7
                )
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Error generating questions: {e}")
            return {"questions": ["Q1: What do you think?"], "rationale": "Error generating suggestions."}

if __name__ == "__main__":
    pass
