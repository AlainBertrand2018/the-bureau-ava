import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000"

COUNTRIES = [
    {
        "target_country": "Mauritius",
        "target_region": "Port Louis",
        "target_audience": "Working Professionals",
        "target_language": "English/French"
    },
    {
        "target_country": "United Kingdom",
        "target_region": "London",
        "target_audience": "Millennials",
        "target_language": "English"
    },
    {
        "target_country": "Reunion",
        "target_region": "Saint-Denis",
        "target_audience": "General Population",
        "target_language": "French/Creole"
    }
]

def test_mission_initialization():
    print("--- STARTING GLOBAL STRESS TEST ---")
    print(f"Targeting: {[c['target_country'] for c in COUNTRIES]}\n")
    
    results = {}

    for config in COUNTRIES:
        country = config["target_country"]
        print(f"--> Initiating Mission for {country}...")
        start = time.time()
        
        try:
            # We use stream=True to handle the NDJSON/SSE response
            with requests.post(f"{BASE_URL}/mission/initialize", json=config, stream=True) as r:
                if r.status_code != 200:
                    print(f"FAILED: HTTP {r.status_code}")
                    print(r.text)
                    results[country] = "HTTP_ERROR"
                    continue
                
                final_data = None
                logs = []
                
                for line in r.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        try:
                            obj = json.loads(decoded_line)
                            if obj.get("type") == "log":
                                log_entry = obj.get("data", {})
                                logs.append(f"[{log_entry.get('agent', '?')}] {log_entry.get('action', '?')}")
                            elif obj.get("type") == "mission":
                                final_data = obj.get("data")
                            elif obj.get("type") == "dossier":
                                # Sometimes it might return dossier directly, checking both
                                pass
                        except:
                            pass
                
                duration = round(time.time() - start, 2)
                
                if final_data:
                    # VALIDATION LOGIC
                    dossier = final_data.get("dossier", {})
                    issues = []
                    
                    # 1. Check Root Fields
                    if not dossier.get("economics"): issues.append("Missing Economics")
                    if not dossier.get("education"): issues.append("Missing Education")
                    
                    # 2. Check "Data unavailable" prevalence
                    # It's okay for Reunion to have some, but UK/Mauritius should be mostly full
                    econ = dossier.get("economics", {})
                    unavailable_count = str(econ).count("Data unavailable")
                    
                    if country in ["United Kingdom", "Mauritius"] and unavailable_count > 2:
                        issues.append(f"Too many 'Data unavailable' ({unavailable_count}) for major market")
                        
                    # 3. Check Archetypes
                    archetypes = dossier.get("demographic_archetypes", [])
                    if not archetypes:
                        issues.append("No Archetypes generated")
                    elif len(archetypes) < 3:
                        issues.append(f"Low Archetype count: {len(archetypes)}")
                        
                    if issues:
                        print(f"  ❌ COMPLETED with ISSUES in {duration}s")
                        print(f"  Issues: {issues}")
                        results[country] = "ISSUES"
                    else:
                        print(f"  ✅ SUCCESS in {duration}s")
                        results[country] = "PASS"
                        
                        # Print snapshot for verification
                        print(f"  Snapshot: Eco={str(econ)[:50]}... Arch={len(archetypes)}")
                else:
                    print(f"  ❌ FAILED: No final mission object received in {duration}s")
                    results[country] = "NO_DATA"
                    
        except Exception as e:
            print(f"  ❌ EXCEPTION: {e}")
            results[country] = "EXCEPTION"
            
        print("-" * 50)

    print("\n--- TEST SUMMARY ---")
    for c, res in results.items():
        print(f"{c}: {res}")

if __name__ == "__main__":
    test_mission_initialization()
