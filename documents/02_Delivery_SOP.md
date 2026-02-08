# Standard Operating Procedure: Product Delivery

## Product 1: The Survey Stress Test (Rs 5,000)
**Goal:** Identification of flaws (Bias, Confusion, Fatigue).
1.  **Intake:** Client uploads PDF/Doc.
2.  **Normalization:** Convert Document to a simple numbered list of strings (Python script `parser.py`).
3.  **The "Critic" Run:**
    * Feed questions into the **"Critic Agent"** (gemini-2.0-flash).
    * *System Prompt:* "You are a PhD Survey Methodologist. Flag leading questions, double-barreled questions, and high cognitive load."
4.  **Human Review:** You read the AI output. Delete hallucinations. Add local context (e.g., "This question about winter coats is irrelevant in Mauritius").
5.  **Output:** Generate 2-Page PDF "Audit Report".

## Product 2: The Optimal Questionnaire (Rs 12,000)
**Goal:** Correction and Optimization.
1.  **Intake:** Receive the "Failed" or "Draft" survey.
2.  **Deconstruction:** Identify the *intent* of each question. (e.g., Client asked "Do you like food?" but meant "Are you price sensitive about groceries?").
3.  **The "Rewrite" Run:**
    * Feed into **"Editor Agent"**.
    * *Instruction:* "Rewrite these questions to be neutral, mutually exclusive, and collectively exhaustive (MECE)."
4.  **Formatting:** Structure the output into a professional Word Doc with "Skip Logic" instructions (e.g., "If Q3=No, Skip to Q5").
5.  **Delivery:** Word Doc + Logic Map.

## Product 3: The Synthetic Dry-Run (Rs 25,000)
**Goal:** Predictive Data Simulation ($n=100$).
1.  **Intake:** Client Survey + Target Demographics (e.g., "Youth, Urban").
2.  **Population Seeding (The IP):**
    * Run `census_seeder.py`.
    * *Input:* Target = "18-25, Urban".
    * *Output:* JSON list of 100 Agent Profiles drawn from the Census probability distribution.
3.  **The Simulation Loop:**
    * Run `runner_v2.py` (The Python script connected to Gemini 2.0 Flash).
    * *Action:* 100 Agents x 20 Questions = 2,000 unique API calls.
4.  **Data Treatment:**
    * Run `analyzer.py` to convert text answers into Sentiment Scores (1-10) and Rejection Categories.
5.  **Reporting:**
    * Generate Charts: "Predicted Dropout Rate," "Price Resistance Curve."
    * Write the "Executive Summary" (The Human Insight).
6.  **Delivery:** 10+ Page PDF Report + Raw CSV Data.