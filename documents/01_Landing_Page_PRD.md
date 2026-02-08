# Product Requirements Document (PRD): The Bureau Landing Page

## 1. Project Overview
**Name:** The Survey Optimization Bureau ("The Bureau")
**Tagline:** "Predict Survey Failures Before You Launch."
**Tech Stack:** Next.js 16 (App Router), React Server Components, Tailwind CSS, Framer Motion (for subtle animations), Lucide React (Icons).
**Vibe:** "The Glass Box." Transparent, scientific, minimalist, authoritative. Think "Swiss Design meets Data Science." Not a flashy SaaS, but a high-end consultancy interface.

## 2. Core Layout & Navigation
* **Header:** Sticky glassmorphism effect. Logo (Top Left). Navigation: "Methodology", "Services", "Pricing". CTA Button: "Drop Your Survey" (Primary Color: Deep Orange/Red).
* **Footer:** "Built with Synthetic Data." Links to: Methodology Whitepaper, Privacy Policy (Mauritius Data Protection Act), LinkedIn.

## 3. Page Sections (Vertical Scroll)

### Section A: Hero (The Hook)
* **Headline:** "Don't Guess. Test."
* **Subhead:** "We simulate 100 Synthetic Mauritians to stress-test your market research before you spend real budget."
* **Visual:** A split screen. Left side: A static PDF survey. Right side: A dynamic stream of "Agent Thoughts" scrolling rapidly (e.g., "Too expensive," "I don't understand this," "I love this").
* **Primary CTA:** "Get a Free Instant Audit" (File Upload Input).

### Section B: The "How It Works" (The Toggle)
* **Component:** An Interactive Switch: [Plain English] <-> [Technical Specs].
* **State 1 (Plain):** "1. You upload. 2. We create virtual people. 3. They answer. 4. You get a report."
* **State 2 (Technical):** "1. Ingestion via OCR. 2. IPF Demographic Reconstruction ($n=100$). 3. Persona Injection via Gemini 2.0 Flash. 4. Sentiment Analysis Output."
* **Visual:** A flowchart connecting "Census Data" -> "Python Engine" -> "Your Report".

### Section C: The Credibility (The Methodology)
* **Headline:** "Grounded in the 2022 Census. Not Hallucinations."
* **Content:** A grid of 3 cards.
    1.  **Statistical Rigor:** "Weighted against Vol II of the Housing Census."
    2.  **Psychographic Injection:** "Agents have budgets, biases, and bad days."
    3.  **Privacy by Design:** "Zero PII. Running on Confidential Computing."

### Section D: The Services (Pricing)
* **Card 1: Stress Test (Rs 5,000).** "The Red Pen Audit." For quick sanity checks.
* **Card 2: Synthetic Dry-Run (Rs 25,000).** "The Full Simulation." 100 Agents, Charts, Dropout Analysis.
* **Card 3: Optimal Design (Rs 12,000).** "The Rewrite." We fix your bad questions.

## 4. Technical Constraints (Next.js 16)
* **Server Actions:** All file uploads must use Next.js Server Actions for security.
* **Fonts:** `Inter` or `Geist Sans` for readability.
* **SEO:** JSON-LD Schema for "ProfessionalService".
* **Performance:** 100/100 Core Web Vitals. Use `next/image` for all diagrams.