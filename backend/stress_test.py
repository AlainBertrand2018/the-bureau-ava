import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

def stress_test_agentic_flow():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY not found.")
        return

    client = genai.Client(api_key=api_key)

    # Challenge Configuration
    target_country = "France"
    target_region = "Paris & Suburbs (Banlieue)"
    target_audience = "Young Gig-Economy Delivery Drivers (Auto-Entrepreneurs)"
    
    print(f"--- STRESS TEST (PHASE 3): AGENTIC BROWSER FLOW ---")
    print(f"Target: {target_audience}")
    print("Objective: 2-Step Flow (Research -> Synthesis) to bypass API limitations.\n")

    # STEP 1: RESEARCH AGENT (Browsing Enabled, No JSON Constraint)
    print("--> Step 1: Deploying Research Agent (Google Search)...")
    research_prompt = f"""
    Find specific, recent real-world data about the earnings and costs of '{target_audience}' (Livreur Uber Eats/Deliveroo/Stuart) in {target_region}.
    
    Specifically look for:
    1. Average monthly turnover vs net income (after cotisations).
    2. Hourly rates in 2024/2025.
    3. Cost of scooter rental/insurance in Paris.
    4. Recent strikes or grievances regarding pay.
    
    Provide a detailed summary with numbers.
    """

    try:
        response_research = client.models.generate_content(
            model="gemini-1.5-flash", 
            contents=research_prompt,
            config={
                "tools": [{"google_search": {}}]
            }
        )
        
        research_data = response_research.text
        print("\n--- RAW RESEARCH DATA ---")
        print(research_data[:500] + "...\n(truncated)\n")
        
        # Check for grounding metadata
        if hasattr(response_research, 'candidates') and response_research.candidates:
            meta = response_research.candidates[0].grounding_metadata
            if meta:
                print("--- SOURCES FOUND ---")
                # Print search entry points if available
                if hasattr(meta, 'search_entry_point') and meta.search_entry_point:
                     print(f"Ref: {meta.search_entry_point.rendered_content}")
                else:
                    print("Grounding metadata present.")

    except Exception as e:
        print(f"Research Step Failed: {e}")
        return

    # STEP 2: AUDITOR AGENT (JSON Formatting, No Browsing)
    print("\n--> Step 2: Deploying Auditor Agent (Formatting)...")
    
    synthesis_prompt = f"""
    ROLE: You are an Expert Forensic Auditor.
    
    INPUT DATA:
    {research_data}
    
    TASK: Convert the above research into a structured JSON Economic Dossier for {target_audience}.
    
    REQUIREMENTS:
    - Use ONLY facts from the input data.
    - If specific numbers are found, cite them.
    - Extract sociological insights implied by the data.
    
    Output JSON format:
    {{
      "economic_context": "Detailed analysis citing specific Euro amounts found...",
      "average_monthly_income_estimate": "Value in EUR",
      "key_financial_pain_points": ["Cost 1", "Cost 2"],
      "sociological_typage": ["axiom 1", "axiom 2"],
      "specific_taboos": ["taboo 1"]
    }}
    """

    try:
        response_synthesis = client.models.generate_content(
            model="gemini-1.5-flash", 
            contents=synthesis_prompt,
            config={
                "response_mime_type": "application/json"
            }
        )
        
        if response_synthesis.text:
            data = json.loads(response_synthesis.text)
            print("\n--- FINAL DOSSIER ---")
            print(json.dumps(data, indent=2))
        else:
            print("Synthesis failed: No text.")

    except Exception as e:
        print(f"Synthesis Step Failed: {e}")

if __name__ == "__main__":
    stress_test_agentic_flow()
