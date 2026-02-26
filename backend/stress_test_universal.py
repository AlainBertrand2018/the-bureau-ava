import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def log_step(step, msg):
    print(f"\n[STEP {step}] {msg}")
    print("-" * 50)

def run_universal_stress_test():
    print("═══ THE BUREAU UNIVERSAL STRESS TEST PROTOCOL ═══")
    print(f"TIME: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("TARGETING: Full Toolchain Validation\n")

    mission_id = None
    targeting = None
    questions = []
    
    # --- STEP 1: MISSION CONTROL (Sentinel/Profiler) ---
    log_step(1, "MISSION CONTROL: Initializing Context for 'Project Tokyo'")
    config = {
        "target_country": "Japan",
        "target_region": "Tokyo (Shibuya/Minato)",
        "target_audience": "Tech-savvy high-income Gen Z professionals.",
        "target_language": "Japanese",
        "research_topic": "Mobile Payments & CBDC Adoption"
    }
    
    try:
        with requests.post(f"{BASE_URL}/mission/initialize", json=config, stream=True) as r:
            if r.status_code != 200:
                print(f"FAILED: {r.status_code}")
                return
            
            for line in r.iter_lines():
                if line:
                    msg = json.loads(line.decode('utf-8'))
                    if msg['type'] == 'log':
                        # Handle both nested and flat schemas
                        data = msg.get('data', msg)
                        print(f"  [{data.get('agent', '?')}] {data.get('action', '?')}: {data.get('details', '')[:60]}...")
                    elif msg['type'] == 'mission':
                        mission_id = msg['data']['mission_id']
                        targeting = msg['data']['config'].get('targeting_refinement')
                        print(f"\n✅ MISSION ESTABLISHED: {mission_id}")
    except Exception as e:
        print(f"ERROR in Step 1: {e}")
        return

    # --- STEP 2: GENESIS (Survey Architect) ---
    log_step(2, "GENESIS: Generating Statistically Rigorous Instrument")
    arch_payload = {
        "context": f"Japanese CBDC adoption survey for {config['target_audience']}",
        "item_count": 5,
        "mission_id": mission_id
    }
    
    try:
        with requests.post(f"{BASE_URL}/architect/generate", json=arch_payload, stream=True) as r:
            instrument_data = None
            for line in r.iter_lines():
                if line:
                    msg = json.loads(line.decode('utf-8'))
                    if msg['type'] == 'log':
                        # Handle both nested and flat schemas
                        data = msg.get('data', msg)
                        print(f"  [{data.get('agent', '?')}] {data.get('action', '?')}: {data.get('details', '')[:60]}...")
                    elif msg['type'] == 'package':
                        instrument_data = msg['data']
            
            if instrument_data:
                questions = instrument_data['instrument']
                print(f"\n✅ INSTRUMENT GENERATED: {len(questions)} items.")
                for i, q in enumerate(questions):
                    print(f"  {i+1}. {q[:70]}...")
    except Exception as e:
        print(f"ERROR in Step 2: {e}")

    # --- STEP 3: LAB (Persona Synthesis) ---
    log_step(3, "THE LAB: Synthesizing Adversarial Personas")
    persona_payload = {
        "count": 3,
        "context": "Focus on high-income Japanese tech workers.",
        "mission_id": mission_id
    }
    
    personas = []
    try:
        resp = requests.post(f"{BASE_URL}/generate_personas", json=persona_payload)
        if resp.status_code == 200:
            personas = resp.json()
            print(f"✅ SYNTHESIZED {len(personas)} PERSONAS.")
            for p in personas:
                print(f"  - {p['name']} ({p.get('occupation', 'No Occupation')})")
        else:
            print(f"FAILED PERSONA GEN: {resp.status_code}")
    except Exception as e:
        print(f"ERROR in Step 3: {e}")

    # --- STEP 4: SIMULATION (Stress-Testing Engine) ---
    log_step(4, "SIMULATION: Running Adversarial Auditing")
    sim_payload = {
        "demographics": personas,
        "questions": questions,
        "mission_id": mission_id
    }
    
    results = []
    try:
        resp = requests.post(f"{BASE_URL}/simulate", json=sim_payload)
        if resp.status_code == 200:
            results = resp.json()['results']
            print(f"✅ SIMULATION COMPLETE: {len(results)} response rows generated.")
        else:
            print(f"FAILED SIMULATION: {resp.status_code}")
    except Exception as e:
        print(f"ERROR in Step 4: {e}")

    # --- STEP 5: INTERPRETER (Narrative Reporting) ---
    log_step(5, "INTERPRETER: Generating Executive Narrative")
    analysis_payload = {
        "context": "CBDC Adoption in Japan high-income segments.",
        "questions": questions,
        "results": results,
        "mission_id": mission_id
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/analyze_results", json=analysis_payload)
        if resp.status_code == 200:
            report = resp.json()
            print("✅ REPORT GENERATED.")
            print(f"\nEXECUTIVE SUMMARY:\n{report.get('executive_summary', 'N/A')[:300]}...")
        else:
            print(f"FAILED REPORT GEN: {resp.status_code}")
    except Exception as e:
        print(f"ERROR in Step 5: {e}")

    # --- STEP 6: ADJUDICATOR (Quick Audit) ---
    log_step(6, "ADJUDICATOR: Consensus Engine Verification")
    audit_payload = {
        "question": "How likely are you to use a Digital Yen if it gives you 2% cashback? (1=Very Unlikely, 5=Very Likely)"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/quick_audit", json=audit_payload)
        if resp.status_code == 200:
            audit = resp.json()
            print(f"✅ AUDIT COMPLETE. SCORE: {audit['quality_score']}/100")
            print(f"  VERDICT: {audit['verdict']}")
        else:
            print(f"FAILED AUDIT: {resp.status_code}")
    except Exception as e:
        print(f"ERROR in Step 6: {e}")

    print("\n" + "═" * 50)
    print("UNIVERSAL STRESS TEST COMPLETE.")
    print("═" * 50)

if __name__ == "__main__":
    run_universal_stress_test()
