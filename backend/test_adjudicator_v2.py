
import asyncio
import json
import os
from architect_service import SurveyArchitect

async def test_adjudicator():
    os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY" # It should be already in environment if running via main.py environment
    architect = SurveyArchitect()
    
    # CASE 1: Election context vs Sports question
    topic = "2026 National Elections in South Africa"
    market = "South Africa"
    drift_question = "Please rate your satisfaction with the pre-game warm-up activities provided by [Organization Name] during the last [Sport/Event]."
    
    print(f"\n--- TESTING ADJUDICATOR: CONTEXT DRIFT ---")
    print(f"Topic: {topic}")
    print(f"Question: {drift_question}")
    
    relevance = await architect._verify_relevance(drift_question, topic, market)
    print(f"ADJUDICATOR VERDICT: {json.dumps(relevance, indent=2)}")
    
    if not relevance.get("is_relevant"):
        print("\n--- REGENERATING WITH ADJUDICATOR CORRECTION ---")
        perfected = await architect._perfect_single_question(drift_question, targeting={"country": market, "topic": topic})
        print(f"PERFECTED QUESTION: {perfected}")
    else:
        print("Adjudicator failed to catch the drift!")

    # CASE 2: Valid question
    valid_question = "How confident are you in the transparency of the upcoming electoral process? (1=Not at all, 5=Extremely)"
    print(f"\n--- TESTING ADJUDICATOR: VALID CONTEXT ---")
    print(f"Topic: {topic}")
    print(f"Question: {valid_question}")
    
    relevance_valid = await architect._verify_relevance(valid_question, topic, market)
    print(f"ADJUDICATOR VERDICT: {json.dumps(relevance_valid, indent=2)}")

if __name__ == "__main__":
    asyncio.run(test_adjudicator())
