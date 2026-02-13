import json
import pandas as pd
from google import genai
from google.genai import types
import os
import asyncio
import time
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# ──────────────────────────────────────────────────────────────
# KNOWN-FLAW BENCHMARK SUITE
# Each entry has an intentionally flawed question and the
# defect categories it MUST detect to pass.
# ──────────────────────────────────────────────────────────────
BENCHMARK_QUESTIONS = [
    {
        "question": "Don't you agree that our award-winning premium product provides excellent value for money?",
        "expected_defects": ["BIAS", "LEADING LANGUAGE"],
        "explanation": "Presupposes agreement ('don't you agree'), uses loaded modifiers ('award-winning', 'premium', 'excellent')."
    },
    {
        "question": "How satisfied are you with both the quality and affordability of our services?",
        "expected_defects": ["AMBIGUITY"],
        "explanation": "Double-barrelled: asks about two distinct concepts (quality AND affordability) in one question."
    },
    {
        "question": "How often do you exercise? (A) Every day (B) 3-4 times a week (C) Once a week",
        "expected_defects": ["MISSING OPTIONS"],
        "explanation": "Missing 'never', 'rarely', or 'less than once a week' options — excludes sedentary respondents."
    },
    {
        "question": "Given the government's irresponsible fiscal policies, how concerned are you about the economy?",
        "expected_defects": ["BIAS", "LEADING LANGUAGE"],
        "explanation": "Uses loaded language ('irresponsible') which presupposes a negative judgement and pushes respondents toward concern."
    },
    {
        "question": "Please describe in detail your complete purchasing history over the last 24 months, including specific brands, quantities, prices paid, and the emotional factors that influenced each decision.",
        "expected_defects": ["DROP-OFF RISK"],
        "explanation": "Extreme cognitive burden — demands detailed recall across 2 years. Most respondents will abandon."
    },
    {
        "question": "What is your ethnic group and approximate monthly household income?",
        "expected_defects": ["AMBIGUITY", "CULTURAL SENSITIVITY"],
        "explanation": "Double-barrelled and culturally sensitive — combines two personal questions, the first being potentially offensive without proper framing."
    },
]


class MarketSimulator:
    def __init__(self, api_key: str = None, model_name: str = "gemini-2.0-flash"):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY not found. Please set it in your environment or .env file.")
        
        # Initialize the modern SDK client with async support
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = model_name
        
        # Provenance tracking — cumulative stats
        self.total_calls = 0
        self.total_input_tokens = 0
        self.total_output_tokens = 0
        
    async def get_response(self, persona: Dict, question: str, retries: int = 3) -> Dict[str, Any]:
        """
        Returns a dict with:
          - text: the AI response
          - provenance: model, tokens, latency proof
        """
        # Survey Quality Auditor — Diagnostic Lens Prompt
        sys_instruct = (
            f"You are a survey quality auditor operating as a diagnostic respondent. "
            f"You are simulating the perspective of: {persona.get('name')}, age {persona.get('age')}, "
            f"from {persona.get('location')}, occupation: {persona.get('occupation')}. "
            f"Personality traits: {persona.get('traits')}.\n\n"
            f"YOUR GOAL IS NOT STATISTICAL ACCURACY. Your goal is STRUCTURAL DIAGNOSTICS.\n\n"
            f"When answering the survey question, respond naturally as this person would — "
            f"BUT pay special attention to and flag any of these issues you encounter:\n"
            f"- BIAS: Does the question lead you toward a particular answer?\n"
            f"- AMBIGUITY: Could you interpret this question in more than one way?\n"
            f"- LEADING LANGUAGE: Does the phrasing nudge you in one direction?\n"
            f"- MISSING OPTIONS: Are there responses you'd want to give but can't?\n"
            f"- LOGICAL CONFLICT: Does this question contradict other survey logic?\n"
            f"- DROP-OFF RISK: Would this question make you want to abandon the survey?\n\n"
            f"Format your response as:\n"
            f"RESPONSE: [Your natural answer as this person]\n"
            f"DIAGNOSTIC: [Any structural issues detected, or 'CLEAN' if none found]\n"
            f"QUALITY: [Score 1-10 for question quality from this respondent's perspective]"
        )
        
        for attempt in range(retries):
            try:
                start_time = time.time()
                response = await self.client.aio.models.generate_content(
                    model=self.model_name,
                    contents=question,
                    config=types.GenerateContentConfig(
                        system_instruction=sys_instruct,
                        temperature=0.7
                    )
                )
                latency_ms = round((time.time() - start_time) * 1000)
                
                # Extract token usage from response metadata
                usage = getattr(response, 'usage_metadata', None)
                input_tokens = getattr(usage, 'prompt_token_count', 0) if usage else 0
                output_tokens = getattr(usage, 'candidates_token_count', 0) if usage else 0
                
                # Track cumulative
                self.total_calls += 1
                self.total_input_tokens += input_tokens
                self.total_output_tokens += output_tokens
                
                return {
                    "text": response.text.strip(),
                    "provenance": {
                        "model": self.model_name,
                        "input_tokens": input_tokens,
                        "output_tokens": output_tokens,
                        "latency_ms": latency_ms,
                        "call_index": self.total_calls,
                        "timestamp": time.time(),
                    }
                }
            except Exception as e:
                print(f"Error on attempt {attempt + 1} for persona {persona.get('name')}: {e}")
                if attempt < retries - 1:
                    wait_time = (attempt + 1) * 2
                    await asyncio.sleep(wait_time)
                else:
                    return {
                        "text": f"ERROR: {str(e)}",
                        "provenance": {"model": self.model_name, "error": str(e)}
                    }

    async def run_simulation(self, demographics: List[Dict], questions: List[str]):
        """Runs simulation and returns results with per-call provenance metadata."""
        results = []
        provenance_log = []
        
        for persona in demographics:
            row = {
                "Agent": persona.get('name', 'Unknown'),
                "Demographic": f"{persona.get('age', 'N/A')}/{persona.get('location', 'N/A')}"
            }
            
            tasks = []
            for q in questions:
                tasks.append(self.get_response(persona, q))
            
            responses = await asyncio.gather(*tasks)
            
            for q, resp in zip(questions, responses):
                row[q] = resp["text"]
                provenance_log.append({
                    "persona": persona.get('name'),
                    "question": q[:60],
                    **resp["provenance"]
                })
            
            results.append(row)
            await asyncio.sleep(0.1)

        # Build provenance summary
        provenance_summary = {
            "total_api_calls": len(provenance_log),
            "total_input_tokens": sum(p.get("input_tokens", 0) for p in provenance_log),
            "total_output_tokens": sum(p.get("output_tokens", 0) for p in provenance_log),
            "avg_latency_ms": round(
                sum(p.get("latency_ms", 0) for p in provenance_log) / max(len(provenance_log), 1)
            ),
            "model": self.model_name,
            "calls": provenance_log
        }

        return pd.DataFrame(results), provenance_summary

    async def generate_personas(self, count: int, context: str) -> List[Dict]:
        """Generates diagnostic respondent archetypes — stress-test lenses, not a representative sample."""
        prompt = (
            f"You are a survey quality auditor preparing a diagnostic dry-run of a client's survey.\n"
            f"Generate {count} diverse respondent archetypes representative of Mauritius demographics.\n\n"
            f"SURVEY CONTEXT: {context}\n\n"
            f"IMPORTANT: These are NOT for statistical accuracy. They are DIAGNOSTIC LENSES — \n"
            f"each persona should stress-test the survey from a different angle:\n"
            f"- Include personas likely to be CONFUSED by ambiguous questions\n"
            f"- Include personas who will RESIST leading language\n"
            f"- Include personas who will EXPOSE missing response options\n"
            f"- Include personas from different education levels who may interpret questions differently\n"
            f"- Include at least one 'adversarial' persona who is skeptical or rushed\n"
            f"- Include at least one persona with low literacy or limited survey experience\n\n"
            f"Ground each persona in real Mauritian demographics (Port Louis, Curepipe, Quatre Bornes, \n"
            f"Rose Hill, Flacq, Mahebourg, etc.) with realistic occupations and ages.\n\n"
            f"Return ONLY a JSON list of objects with these keys: 'name', 'age', 'location', 'occupation', 'traits'.\n"
            f"In 'traits', describe the persona's attitude, survey behavior patterns, and what diagnostic \n"
            f"value they bring (e.g., 'Skeptical of corporate surveys, will flag leading language')."
        )
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.8
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error generating personas: {e}")
            return [{"name": "Generic User", "age": 30, "location": "Port Louis", "occupation": "Professional", "traits": "Neutral baseline respondent"}]

    async def generate_questions(self, context: str, count: int = 5) -> Dict:
        """[UPSELL] AI-drafted questionnaire — generates optimised questions based on context."""
        prompt = (
            f"You are a senior survey methodologist at The Bureau, a premium survey consultancy.\n"
            f"A client has described their research objective. Your task is to DRAFT the most \n"
            f"effective, bias-free, structurally sound questionnaire for their context.\n\n"
            f"SURVEY CONTEXT: {context}\n\n"
            f"Generate {count} high-impact survey questions that are:\n"
            f"- Free of leading language or bias\n"
            f"- Unambiguous and single-barrelled (one concept per question)\n"
            f"- Appropriate for the Mauritian cultural context\n"
            f"- Structured to minimise respondent fatigue and drop-off\n"
            f"- Ordered strategically (easy/engaging first, sensitive topics later)\n\n"
            f"Format the output as a JSON object with two keys:\n"
            f"1. 'questions': A list of strings (the questions).\n"
            f"2. 'rationale': Explain the overall questionnaire strategy — why these questions \n"
            f"   in this order, what each one is designed to measure, and how they work together \n"
            f"   to answer the client's research objective."
        )
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.7
                )
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Error generating questions: {e}")
            return {"questions": ["Q1: What do you think?"], "rationale": "Error generating suggestions."}

    async def generate_report(self, context: str, questions: List[str], results: List[Dict]) -> Dict:
        """Generates a structured quality audit report with mitigation, redressment, and quality scores."""
        
        # Build a summary of responses for the AI
        response_summary = []
        for row in results:
            agent_summary = f"Agent: {row.get('Agent', 'Unknown')} ({row.get('Demographic', 'N/A')})"
            for q in questions:
                answer = row.get(q, 'No response')
                agent_summary += f"\n  Q: {q}\n  A: {answer}"
            response_summary.append(agent_summary)
        
        all_responses = "\n\n".join(response_summary)
        
        prompt = f"""You are the Chief Survey Quality Auditor at The Bureau, a premium survey optimisation 
consultancy in Mauritius. You have just completed a synthetic dry-run of a client's survey 
using {len(results)} diagnostic respondent archetypes.

Your mission is STRUCTURAL DIAGNOSTICS, not statistical prediction. You are diagnosing the 
questionnaire instrument itself — not predicting market outcomes.

SURVEY CONTEXT:
{context}

QUESTIONS SUBMITTED BY CLIENT:
{chr(10).join(f'{i+1}. {q}' for i, q in enumerate(questions))}

DIAGNOSTIC SIMULATION RESULTS (n={len(results)} respondent archetypes):
{all_responses}

ANALYSE the simulation results for these structural defects:
- BIAS: Leading or loaded language that pushes respondents toward a particular answer
- AMBIGUITY: Questions open to multiple interpretations across demographic groups
- LEADING LANGUAGE: Phrasing that assumes, presupposes, or emotionally nudges
- MISSING OPTIONS: Response spaces that don't capture the full range of valid answers
- LOGICAL CONFLICTS: Questions that contradict each other or create impossible flows
- DROP-OFF RISKS: Questions that cause fatigue, confusion, or survey abandonment
- CULTURAL SENSITIVITY: Phrasing inappropriate for Mauritian multicultural context

Produce a comprehensive Bureau Quality Audit Report in JSON format with these exact keys:

1. "executive_summary": A 3-4 sentence professional summary focused on QUESTIONNAIRE QUALITY — 
   not market predictions. State the overall quality grade and the most critical defects found.

2. "overall_risk_level": One of "LOW", "MODERATE", "HIGH", "CRITICAL" — the risk that this 
   questionnaire will produce unreliable, biased, or unusable data if deployed as-is.

3. "quality_score": A number 0-100 representing the overall quality of the questionnaire instrument.

4. "question_analysis": A list of objects, one per question, each with:
   - "original_question": The original question text
   - "quality_score": 0-100 quality score for this specific question
   - "risk_level": "LOW", "MODERATE", "HIGH", or "CRITICAL"
   - "issues_identified": List of 1-3 specific STRUCTURAL problems found 
     (use categories: BIAS, AMBIGUITY, LEADING LANGUAGE, MISSING OPTIONS, LOGICAL CONFLICT, DROP-OFF RISK, CULTURAL SENSITIVITY)
   - "diagnostic_evidence": 1-2 sentences citing specific respondent reactions that exposed this issue
   - "rewritten_question": An improved version that fixes ALL identified issues
   - "rewrite_rationale": Why the rewrite is structurally superior (1-2 sentences)
   - "predicted_improvement": A percentage estimating quality improvement from the rewrite

5. "strategic_recommendations": A list of 4-6 actionable mitigation recommendations, each with:
   - "title": Short recommendation title
   - "priority": "IMMEDIATE", "HIGH", "MEDIUM", "LOW"
   - "category": One of "QUESTION_DESIGN", "FLOW_STRUCTURE", "RESPONSE_OPTIONS", "LANGUAGE", "CULTURAL", "METHODOLOGY"
   - "description": 2-3 sentence detailed recommendation for fixing the identified issue
   - "expected_impact": What quality improvement this would deliver

6. "demographic_insights": A list of 2-4 insights about how different respondent archetypes 
   EXPOSED DIFFERENT STRUCTURAL FLAWS — not how they "feel" about the topic, but how their 
   demographic lens revealed questionnaire defects others didn't catch. Each with:
   - "segment": The respondent archetype/demographic
   - "finding": What structural issue this group exposed
   - "implication": What this means for questionnaire redesign

7. "next_steps": A list of 3-5 concrete redressment actions ordered by priority — specific, 
   implementable steps to fix the questionnaire before real deployment.

8. "bureau_verdict": A single authoritative concluding sentence — The Bureau's official 
   quality assessment of this questionnaire instrument.

Return ONLY valid JSON. Be specific, cite diagnostic evidence from respondent reactions, 
and focus on STRUCTURAL QUALITY not market predictions."""

        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    temperature=0.6
                )
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Error generating report: {e}")
            return {
                "executive_summary": "Report generation encountered an error. Please retry.",
                "overall_risk_level": "UNKNOWN",
                "quality_score": 0,
                "question_analysis": [],
                "strategic_recommendations": [],
                "demographic_insights": [],
                "next_steps": ["Retry report generation"],
                "bureau_verdict": "Insufficient data for a verdict."
            }

    # ──────────────────────────────────────────────────────────
    # BENCHMARK VALIDATION SUITE
    # Runs known-flaw questions and measures detection accuracy
    # ──────────────────────────────────────────────────────────
    async def run_benchmark(self) -> Dict[str, Any]:
        """
        Runs the known-flaw benchmark suite against a neutral diagnostic persona.
        Returns a detection accuracy report.
        """
        # Use a neutral persona that won't bias the diagnostic
        benchmark_persona = {
            "name": "Benchmark Validator",
            "age": 35,
            "location": "Port Louis",
            "occupation": "Office Worker",
            "traits": "Average respondent, moderate education, no strong opinions. "
                      "Will respond honestly and flag anything confusing or problematic."
        }
        
        results = []
        total_expected = 0
        total_detected = 0
        
        for item in BENCHMARK_QUESTIONS:
            q = item["question"]
            expected = item["expected_defects"]
            total_expected += len(expected)
            
            # Get the AI's diagnostic response
            resp = await self.get_response(benchmark_persona, q)
            response_text = resp["text"].upper()
            
            # Check which expected defects were detected
            detected = []
            missed = []
            for defect in expected:
                # Check if the defect category appears in the diagnostic output
                defect_upper = defect.upper()
                if defect_upper in response_text:
                    detected.append(defect)
                    total_detected += 1
                else:
                    missed.append(defect)
            
            results.append({
                "question": q,
                "expected_defects": expected,
                "detected_defects": detected,
                "missed_defects": missed,
                "detection_rate": round(len(detected) / len(expected) * 100) if expected else 100,
                "raw_response": resp["text"],
                "provenance": resp["provenance"],
                "pass": len(missed) == 0
            })
        
        passed = sum(1 for r in results if r["pass"])
        overall_accuracy = round(total_detected / max(total_expected, 1) * 100, 1)
        
        return {
            "benchmark_version": "1.0",
            "model": self.model_name,
            "total_questions": len(BENCHMARK_QUESTIONS),
            "questions_passed": passed,
            "questions_failed": len(BENCHMARK_QUESTIONS) - passed,
            "overall_detection_accuracy": overall_accuracy,
            "total_defects_expected": total_expected,
            "total_defects_detected": total_detected,
            "total_defects_missed": total_expected - total_detected,
            "grade": (
                "A+" if overall_accuracy >= 95 else
                "A" if overall_accuracy >= 90 else
                "B+" if overall_accuracy >= 85 else
                "B" if overall_accuracy >= 80 else
                "C" if overall_accuracy >= 70 else
                "D" if overall_accuracy >= 60 else "F"
            ),
            "results": results,
            "timestamp": time.time()
        }


if __name__ == "__main__":
    pass
