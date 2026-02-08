import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
print(f"API Key found: {bool(api_key)}")
if api_key:
    genai.configure(api_key=api_key)
    try:
        print("Models available:")
        for m in genai.list_models():
            print(f" - {m.name}")
    except Exception as e:
        print(f"Error: {e}")
