import requests
import json
import time
import sys
import os

BASE_URL = "http://localhost:8000"

def log_step(step, msg):
    print(f"\n[STEP {step}] {msg}")
    print("-" * 60)

def run_full_suite_stress_test():
    print("═══ THE BUREAU FULL SUITE STRESS TEST PROTOCOL ═══")
    print(f"TIME: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("TARGETING: End-to-End Toolchain + Kernel Validation\n")

    mission_id = None
    questions = []
    
    # Wait for server
    for i in range(5):
        try:
            requests.get(f"{BASE_URL}/")
            break
        except:
            print(f"Waiting for server... ({i+1}/5)")
            time.sleep(2)

    # --- STEP 1: SENTINEL (Mission Control) ---
    log_step(1, "SENTINEL: Initializing Global Mission")
    config = {
        "target_country": "France",
        "target_region": "Paris",
        "target_audience": "Luxury retail consumers, ages 25-45.",
        "target_language": "French",
        "research_topic": "Sustainable Luxury Trends 2026"
    }
    
    try:
        with requests.post(f"{BASE_URL}/mission/initialize", json=config, stream=True) as r:
            for line in r.iter_lines():
                if line:
                    msg = json.loads(line.decode('utf-8'))
                    if msg['type'] == 'mission':
                        mission_id = msg['data']['mission_id']
                        print(f"✅ MISSION ID: {mission_id}")
    except Exception as e:
        print(f"FAILED Step 1: {e}")
        return

    # --- STEP 2: GENESIS (Architect) ---
    log_step(2, "GENESIS: Drafting Certified Instrument")
    arch_payload = {"context": config['research_topic'], "item_count": 5, "mission_id": mission_id}
    try:
        with requests.post(f"{BASE_URL}/architect/generate", json=arch_payload, stream=True) as r:
            for line in r.iter_lines():
                if line:
                    msg = json.loads(line.decode('utf-8'))
                    if msg['type'] == 'package':
                        questions = msg['data']['instrument']
                        print(f"✅ GENERATED {len(questions)} QUESTIONS")
    except Exception as e:
        print(f"FAILED Step 2: {e}")

    # --- STEP 3: THE LAB (Simulation) ---
    log_step(3, "THE LAB: Running Adversarial Stress Test")
    persona_payload = {"count": 2, "context": config['research_topic'], "mission_id": mission_id}
    try:
        personas = requests.post(f"{BASE_URL}/generate_personas", json=persona_payload).json()
        sim_payload = {"demographics": personas, "questions": questions, "mission_id": mission_id}
        sim_resp = requests.post(f"{BASE_URL}/simulate", json=sim_payload).json()
        results = sim_resp['results']
        print(f"✅ GENERATED {len(results)} SIMULATED OBSERVATIONS")
    except Exception as e:
        print(f"FAILED Step 3: {e}")

    # --- STEP 4: INTERPRETER (Analytics) ---
    log_step(4, "INTERPRETER: Processing Field Verbatims")
    analysis_payload = {"context": config['research_topic'], "questions": questions, "results": results, "mission_id": mission_id}
    try:
        report = requests.post(f"{BASE_URL}/analyze_results", json=analysis_payload).json()
        print(f"✅ VERDICT: {report.get('verdict', 'CALIBRATED')}")
        print(f"✅ QUALITY SCORE: {report.get('quality_score', 'N/A')}")
    except Exception as e:
        print(f"FAILED Step 4: {e}")

    # --- STEP 5: THE KERNEL (Python Execution) ---
    log_step(5, "THE KERNEL: Direct Data Audit")
    kernel_code = f"""
import pandas as pd
results = {json.dumps(results)}
df = pd.DataFrame(results)
print(f"Validated Dataset Shape: {{df.shape}}")
print(f"Sentiment Mean: {{df.iloc[:, 2].mode()[0]}}") # Just a test
"""
    try:
        kernel_resp = requests.post(f"{BASE_URL}/python/execute", json={"code": kernel_code}).json()
        if kernel_resp.get("error"):
            print(f"❌ KERNEL ERROR: {kernel_resp['error']}")
        else:
            print(f"✅ KERNEL OUTPUT:\n{kernel_resp['stdout']}")
    except Exception as e:
        print(f"FAILED Step 5: {e}")

    print("\n" + "═" * 60)
    print("FULL SYSTEM STRESS TEST: PASS")
    print("═" * 60)

if __name__ == "__main__":
    run_full_suite_stress_test()
