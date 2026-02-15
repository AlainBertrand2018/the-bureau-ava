import requests
import json

def test_survey_architect():
    url = "http://localhost:8000/architect/generate"
    
    # Test Case "Phoenix": Brand Manager for a new Coffee Brand
    payload_phoenix = {
        "context": "Launching a new premium organic coffee brand (Cafe de Chamarel) targeting high-income urban professionals in Mauritius. Need to understand price sensitivity, preferred roast levels, and ethical sourcing priorities.",
        "item_count": 5  # Using 5 for a faster test
    }
    
    print("\n--- TESTING 'SURVEY ARCHITECT' [PHOENIX CASE] ---")
    try:
        response = requests.post(url, json=payload_phoenix)
        if response.status_code == 200:
            data = response.json()
            print("\nSTATUS: 200 OK")
            print(f"CERTIFIED BY: {data['certified_by']}")
            print("\nINSTRUMENT PREVIEW:")
            for i, q in enumerate(data['instrument']):
                print(f"{i+1}. {q}")
            
            print("\nSTRATEGIC RATIONALE:")
            print(data['strategic_rationale'])
            
            print("\nSCIENTIFIC DISCLOSURE:")
            print(data['field_manual']['scientific_disclosure'][:200] + "...")
        else:
            print(f"ERROR: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"FAILED TO CONNECT: {e}")

if __name__ == "__main__":
    test_survey_architect()
