# Antigravity / AI IDE Prompt List

## Prompt 1: Project Scaffolding (Next.js 16 + Python)
"Create a new Next.js 16 project using the App Router and Turbopack.
Simultaneously, set up a `/backend` folder containing a Python FastAPI application.
I need a robust method for the Next.js frontend to talk to the Python backend.
Configure `concurrently` or a similar tool in `package.json` to run both the Next.js dev server (port 3000) and the FastAPI server (port 8000) with a single command: `npm run dev`.
Ensure the Next.js `next.config.js` is set up to rewrite API calls from `/api/py/*` to `http://127.0.0.1:8000/*` so I can call the Python script seamlessly."

## Prompt 2: The Landing Page (UI/UX)
"Using Tailwind CSS and Framer Motion, design a Landing Page based on the 'Glass Box' aesthetic.
Create a 'Hero Section' with a split view:
- Left: A clean, static survey form component.
- Right: A scrolling list of 'Agent Comments' that fades in and out, simulating live AI thinking.
Use a glassmorphism effect (backdrop-blur) for the navigation bar.
The primary color should be a deep, trustworthy Data Science Blue, with accents of 'Alert Orange' for the CTA."

## Prompt 3: The "Runner" Integration (The Core Feature)
"In the Python FastAPI backend, create an endpoint `POST /simulate`.
This endpoint should accept a JSON body containing: `{ 'demographics': dict, 'questions': list }`.
Inside this endpoint, integrate the `google-genai` library (Gemini 2.0 Flash).
Write a function that iterates through the questions and the demographics, sending a request to Gemini for each combination.
The function must return a structured JSON response of the agents' answers.
Ensure this endpoint is asynchronous (`async def`) so it doesn't block the server."

## Prompt 4: The Charts Component (Visualization)
"Create a React Client Component called `SimulationResults.tsx`.
Use `recharts` or `chart.js`.
This component should take a prop `data` (the JSON output from the Python backend).
Render a Bar Chart showing 'Sentiment Score' by 'Agent Persona'.
Add a text summary section below the chart that highlights the 'Top 3 Objections' extracted from the data."

## Prompt 5: Server Actions for File Upload
"Create a Next.js Server Action `uploadSurvey`.
This action should handle a file upload (PDF or Docx), save it to a temporary local directory, and then trigger a Python script (via an internal API call to localhost:8000) to parse the text.
Ensure proper error handling: if the file is not a document, return a 'Invalid File Type' error to the frontend."