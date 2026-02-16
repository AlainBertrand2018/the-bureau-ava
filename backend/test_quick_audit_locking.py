import urllib.request
import json
import time

API_URL = "http://127.0.0.1:8000/quick_audit"

# A set of "Gold Standard" questions that SHOULD get 100/100 with the new locking logic
PERFECT_QUESTIONS = [
    "Overall, how satisfied are you with the customer service you received? (1=Very Dissatisfied, 5=Very Satisfied)",
    "To what extent do you agree with the statement: 'The product meets my needs'? (1=Strongly Disagree, 5=Strongly Agree)",
    "How likely are you to recommend our service to a friend or colleague? (0=Not at all likely, 10=Extremely likely)",
    "Thinking about your last visit, how would you rate the cleanliness of the facility? (1=Poor, 5=Excellent)",
    "How satisfied are you with the speed of delivery? (1=Very Dissatisfied, 7=Very Satisfied)"
]

# A set of "Flawed" questions that SHOULD NOT get 100/100
FLAWED_QUESTIONS = [
    "Do you refrain from not using our product?",
    "How awesome is our amazing product?",
    "Do you like our product and its price? (Yes/No)",
    "What do you think about the government?",
]

def run_test():
    print(f"--- STARTING QUICK AUDIT STRESS TEST ---")
    print(f"Target URL: {API_URL}")
    print(f"Testing {len(PERFECT_QUESTIONS)} PERFECT questions (Expecting 100/100)")
    print(f"Testing {len(FLAWED_QUESTIONS)} FLAWED questions (Expecting <100)\n")

    passed_count = 0
    total_count = 0

    # 1. TEST PERFECT QUESTIONS
    print(">>> PHASE 1: GOLD STANDARD VALIDATION")
    for q in PERFECT_QUESTIONS:
        total_count += 1
        payload = {"question": q}
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
        
        try:
            start = time.time()
            with urllib.request.urlopen(req) as response:
                resp_data = json.loads(response.read().decode('utf-8'))
                duration = time.time() - start
                
                score = resp_data.get("quality_score")
                issues = resp_data.get("issues")
                verdict = resp_data.get("verdict")
                
                print(f"Q: '{q}'")
                print(f"   -> Score: {score}/100 | Issues: {len(issues)} | Time: {duration:.2f}s")
                
                if score == 100 and len(issues) == 0:
                    print(f"   [PASS] Locked to 100 correctly.")
                    passed_count += 1
                else:
                    print(f"   [FAIL] Did not get 100. Verdict: {verdict}")
                    print(f"   Issues found: {issues}")

        except Exception as e:
            print(f"   [ERROR] Request failed: {e}")
        print("-" * 60)

    # 2. TEST FLAWED QUESTIONS
    print("\n>>> PHASE 2: FLAW DETECTION VALIDATION")
    for q in FLAWED_QUESTIONS:
        total_count += 1
        payload = {"question": q}
        data = json.dumps(payload).encode('utf-8')
        
        req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
        
        try:
            with urllib.request.urlopen(req) as response:
                resp_data = json.loads(response.read().decode('utf-8'))
                
                score = resp_data.get("quality_score")
                issues = resp_data.get("issues")
                
                print(f"Q: '{q}'")
                print(f"   -> Score: {score}/100 | Issues: {len(issues)}")
                
                if score < 100:
                    print(f"   [PASS] Correctly identified flaws.")
                    passed_count += 1
                else:
                    print(f"   [FAIL] False Positive! Gave 100/100 to a bad question.")
        except Exception as e:
            print(f"   [ERROR] Request failed: {e}")
        print("-" * 60)

    print(f"\n--- TEST SUMMARY ---")
    print(f"Passed: {passed_count}/{total_count}")
    if passed_count == total_count:
        print("RESULT: SUCCESS - ALL SYSTEMS NOMINAL")
    else:
        print("RESULT: FAILURE - ADJUSTMENTS NEEDED")

if __name__ == "__main__":
    run_test()
