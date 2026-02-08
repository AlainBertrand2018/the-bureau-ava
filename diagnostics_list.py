import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

print("Listing ALL models available to this key via google-genai:")
try:
    for m in client.models.list():
        print(f" - {m.name}")
except Exception as e:
    print(f"Error: {e}")
