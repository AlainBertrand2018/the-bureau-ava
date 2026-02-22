import asyncio
import os
import json
import time
from typing import List, Dict, Any
from google import genai
from dotenv import load_dotenv

# Load env from root
load_dotenv()

# We need to import the services to test them
import sys
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import ai_utils

# Global token counters
global_input_tokens = 0
global_output_tokens = 0

# Track the number of actual calls that were tracked
tracked_calls = 0

# Monkeypatch generate_with_retry to track tokens
original_generate = ai_utils.generate_with_retry

async def tracked_generate(*args, **kwargs):
    global global_input_tokens, global_output_tokens, tracked_calls
    response = await original_generate(*args, **kwargs)
    tracked_calls += 1
    if response and hasattr(response, 'usage_metadata'):
        usage = response.usage_metadata
        # Check if it's the modern SDK format
        if hasattr(usage, 'prompt_token_count'):
            global_input_tokens += usage.prompt_token_count
            global_output_tokens += usage.candidates_token_count
        else:
            # Fallback for other potential formats
            global_input_tokens += getattr(usage, 'input_tokens', 0)
            global_output_tokens += getattr(usage, 'output_tokens', 0)
    return response

# Apply patch to the source module
ai_utils.generate_with_retry = tracked_generate

# Now import the services - they might still have the old reference if they used 'from ai_utils import ...'
from architect_service import SurveyArchitect
import architect_service
import simulation_engine

# Force the patch onto the imported modules' namespaces
architect_service.generate_with_retry = tracked_generate
simulation_engine.generate_with_retry = tracked_generate

async def run_full_lab_audit():
    print("--- STARTING FULL LAB (GENESIS PIPELINE) TOKEN AUDIT ---")
    architect = SurveyArchitect()
    
    context = "Launching a new premium organic coffee brand (Cafe de Chamarel) targeting high-income urban professionals in Mauritius. Need to understand price sensitivity, preferred roast levels, and ethical sourcing priorities."
    
    start_time = time.time()
    # Run the full package with 20 questions
    print(f"Executing create_full_package(context, count=20)...")
    package = await architect.create_full_package(context=context, count=20)
    end_time = time.time()
    
    duration = end_time - start_time
    
    # GEMINI 2.0 FLASH PRICING (USD per 1M tokens)
    # Input: $0.10 / 1M
    # Output: $0.40 / 1M
    
    cost_input = (global_input_tokens / 1_000_000) * 0.10
    cost_output = (global_output_tokens / 1_000_000) * 0.40
    total_cost = cost_input + cost_output
    
    print("\n" + "="*50)
    print("AUDIT RESULTS")
    print("="*50)
    print(f"Project Context: {context[:60]}...")
    print(f"Questions Generated: {len(package.get('instrument', []))}")
    print(f"Total Time Taken: {duration:.2f} seconds")
    print(f"Total API Calls Tracked: {tracked_calls}")
    print("-" * 50)
    print(f"TOTAL INPUT TOKENS:  {global_input_tokens:,}")
    print(f"TOTAL OUTPUT TOKENS: {global_output_tokens:,}")
    print("-" * 50)
    print(f"Cost (Input):  ${cost_input:.6f}")
    print(f"Cost (Output): ${cost_output:.6f}")
    print(f"TOTAL COST:    ${total_cost:.6f}")
    print("="*50)
    
    print("\nPROPOSED PRODUCT PRICING STRATEGY:")
    print(f"Platform Baseline: $1.00 USD minimum per Lab run")
    print(f"Cost-to-Price Markup: 20x (Software-as-a-Service standard)")
    suggested_price = total_cost * 20
    suggested_credits = int(max(suggested_price, 1.0) * 100) # 100 credits = $1.00
    
    print(f"Calculated Price: ${suggested_price:.2f}")
    print(f"Final Suggested Credits: {suggested_credits} credits")
    print(f"Value Proposition: A human consultant would charge $5,000 for this work.")

if __name__ == "__main__":
    asyncio.run(run_full_lab_audit())
