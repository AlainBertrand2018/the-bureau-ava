import requests
import json

url = "http://localhost:8000/quick_audit"
question = "Thinking of banks you have personally used in Mauritius, how satisfied are you with the service?"

print(f"Auditing original bad question: {question}")
payload = {"question": question}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Original Score: {result.get('quality_score')}")
    print(f"AVA Recommendation: {result.get('rewrite')}")
    
    # Now Re-Audit the recommendation
    print("\nRE-AUDITING THE RECOMMENDATION...")
    pass2 = requests.post(url, json={"question": result.get('rewrite')})
    print(f"Status: {pass2.status_code}")
    res2 = pass2.json()
    print(f"Recommendation's Audit Score: {res2.get('quality_score')}")
    if res2.get('quality_score', 0) >= 95:
        print("✅ SUCCESS: The recommendation is officially failproof!")
    else:
        print(f"❌ FAILURE: The recommendation still only scores {res2.get('quality_score')}")
        print(f"Issues found: {res2.get('issues')}")

except Exception as e:
    print(f"Error: {e}")
