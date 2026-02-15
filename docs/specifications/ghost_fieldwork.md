# AVA Tool Specification: Ghost Fieldwork (Predictive Synthetic Engine)

## 01. Concept Overview
The **Ghost Fieldwork** engine is a high-fidelity simulation environment that generates a complete, structured dataset ($n=100$ to $n=2000$) before a survey enters the field. It allows researchers to validate their analytical models and "see the future" of their data.

---

## 02. Core Architecture

### A. Persona Population Engine
- **Calibration Source**: Census-weighted data (age, gender, district, income, education) mapped to Mauritian demographics.
- **Psychographic Layer**: Personas are assigned "Behavioral Seeds" (e.g., *Skeptical Conservative*, *Impulsive Tech-Adopter*, *Price-Sensitive Rationalist*).
- **Logical Consistency**: Personas maintain a "Cognitive State" through the session to ensure cross-question logic (e.g., a persona cannot forget its own income level mid-survey).

### B. The Simulation Loop (Async Processing)
- **Mass Deployment**: Parallel execution of diagnostic sessions via a dedicated worker (Celery/Redis).
- **Interference Injection**: Stochastic "Noise" (human error, fatigue, neutral-bias) injected at increasing levels as survey length increases.
- **Response Mapping**: Conversion of natural language reasoning into structured data types (Scale 1-10, Multiple Choice, Open-ended text).

---

## 03. User Workflow (The "Crystal Ball")

### Step 1: Lab Ingestion (The Brief)
The user provides the context and the instrument (questionnaire).
- **Inputs**: `.pdf`, `.docx`, or raw text.
- **Context**: Goal of the research.

### Step 2: Predictive Seeding (Hypothesis)
Users can optionally set "Reality Seeds" to test specific outcomes.
- *Example*: "Assume a 15% increase in negative sentiment among urban youth if price exceeds Rs 5,000."

### Step 3: High-Fidelity Execution
AVA deploys the $n$ personas. The UI shows a live "Deployment Map" of Mauritius, with dots lighting up as personas complete their "Ghost Interviews."

### Step 4: The Analysis Sandbox
- **Instant Viz**: Automatic generation of distribution charts.
- **Pivot Testing**: Cross-tabulation of any two variables (e.g., District vs. Intent to Buy).
- **CSV/SPSS Export**: Download of a "Cleaned" dataset ready for testing in external statistical software.

---

## 04. Technical Requirements (Backend)

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Generator** | OpenAI/Gemini (High-Ctxt) | Reasoning for individual persona responses. |
| **Worker Queue** | Celery + Redis | Managing high-concurrency simulation logs. |
| **Data Structuring** | Pydantic / Pandas | Compiling $n$ JSONs into a flat CSV/Dataframe. |
| **Statistical Validator** | SciPy / NumPy | Calculating standard error and "Noise-to-Signal" ratios. |

---

## 05. UI/UX Design Goals (Premium Agency Aesthetic)
- **Visual Motif**: Deep obsidian backgrounds, glassmorphism, and "Neural Glow" animations.
- **Key View**: A "Crystal Ball" summary that shows a probability score for the user's hypothesis.
- **Feedback Loop**: Visual "Fault Lines" showing where data becomes unstable due to poor question design.

---

## 06. Strategic Value (The "Why")
- **Risk Mitigation**: Ensures the research design *can actually answer* the business question.
- **Template Readiness**: Allows data teams to build reporting dashboards using the "Ghost Data" weeks before the real data arrives.
- **Boutique Edge**: Positions The Bureau as a technology-first agency, not just a service provider.

---

## 07. Scientific Mandate
All **Ghost Fieldwork** reports must include the **AVA Methodology Statement** (Ref: `docs/scientific_foundations.md`), citing the use of **Agent-Based Modeling (ABM)** and **Stochastic Variance** to validate the simulated dataset's reliability.
