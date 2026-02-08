import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

print("Checking models reachable via google-genai SDK...")
try:
    models = client.models.list()
    for m in models:
        # Only show models relevant to the task
        if "flash" in m.name.lower():
            print(f"Model: {m.name} | Supported Gen: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
