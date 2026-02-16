import asyncio
import sys
import os
import json
from context_engine import context_engine, MissionConfiguration

async def run_agentic_stress_test():
    print("\n--- INITIATING AGENTIC STRESS TEST: 'PROJECT LAGOS' ---\n")
    
    config = MissionConfiguration(
        target_country="Nigeria",
        target_region="Lagos (Yaba/Ikeja)",
        target_language="English (Pidgin/Naija Slang)",
        target_audience="Gen Z Cryptocurrency Traders & Freelancers",
        research_topic="Trust in Fiat vs Digital Assets"
    )

    print(f"TARGET: {config.target_audience} in {config.target_region}")
    print("STATUS: Deploying Agents via Neural Stream...\n")

    mission = None
    audit_trail = []

    try:
        # Using the new Streaming Generator
        async for chunk in context_engine.initialize_mission_stream_generator(config):
            try:
                msg = json.loads(chunk)
                if msg["type"] == "log":
                    log = msg["data"]
                    # Simulate Ticker Display
                    print(f"[{log['timestamp']}] {log['agent'].ljust(12)} | {log['action'].ljust(15)} | {log.get('details', '')[:100]}...")
                    audit_trail.append(log)
                elif msg["type"] == "mission":
                    mission = msg["data"]
                    print("\n[STREAM COMPLETE] Mission Object Received.")
                elif msg["type"] == "error":
                    print(f"\n[STREAM ERROR] {msg['detail']}")
            except json.JSONDecodeError:
                pass
        
        if mission:
            print("\n--- ECONOMIC REALITY (VERIFIED) ---")
            # Mission is a dict here because we loaded it from JSON in the stream wrapper in main.py? 
            # No, streaming generator yields json.dumps of model.json().
            # So mission is a dict.
            dossier = mission["dossier"]
            print(dossier["economic_context"])
            
            print("\n--- CULTURAL AXIOMS ---")
            for axiom in dossier["cultural_axioms"][:3]:
                print(f"- {axiom}")

            print("\n--- LINGUISTIC NUANCES (SLANG) ---")
            for word in dossier["linguistic_nuances"][:5]:
                print(f"- {word}")

            print("\n--- CITATION INDEX ---")
            for i, cite in enumerate(dossier["citation_index"], 1):
                print(f"{i}. {cite}")
                
            print("\n--- STRESS TEST RESULT: SUCCESS ---")
        else:
             print("\n--- STRESS TEST RESULT: FAILED (No Mission Returned) ---")

    except Exception as e:
        print(f"\n--- TEST RESULT: FAILED WITH EXCEPTION ---")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_agentic_stress_test())
