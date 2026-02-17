import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000"

COUNTRIES = [
    {
        "target_country": "United Kingdom",
        "target_region": "London",
        "target_audience": "Working Professionals",
        "target_language": "English"
    },
    {
        "target_country": "Reunion",
        "target_region": "Saint-Denis",
        "target_audience": "General Population",
        "target_language": "French"
    }
]

def test():
    print("--- FOCUSED STRESS COMPLETED ---")
    for config in COUNTRIES:
        country = config["target_country"]
        print(f"--> Testing {country}...")
        start = time.time()
        
        try:
            with requests.post(f"{BASE_URL}/mission/initialize", json=config, stream=True) as r:
                if r.status_code != 200:
                    print(f"FAILED: HTTP {r.status_code}")
                    continue
                
                final_dossier = None
                for line in r.iter_lines():
                    if line:
                        try:
                            obj = json.loads(line)
                            if obj.get("type") == "mission":
                                final_dossier = obj.get("data", {}).get("dossier")
                        except:
                            pass
                
                if final_dossier:
                    econ = final_dossier.get("economics", {})
                    # Check for "Data unavailable"
                    unavailable = str(econ).count("Data unavailable")
                    print(f"  Result: {unavailable} unavailable fields.")
                    if unavailable > 2 and country == "United Kingdom":
                        print("  ❌ UK FAILED: Too much missing data.")
                    elif unavailable > 3 and country == "Reunion":
                        print("  ⚠️ REUNION WARNING: Check data manually.")
                    else:
                        print("  ✅ SUCCESS.")
                    
                    if country == "United Kingdom":
                        print(f"  Sample: {str(econ)[:100]}...")
                else:
                    print("  ❌ FAILED: No dossier returned.")
                    
        except Exception as e:
            print(f"  ❌ EXCEPTION: {e}")

if __name__ == "__main__":
    test()
