# AVA — Survey Quality Auditor

AVA is a premium full-stack AI application designed by **The Bureau** to audit, stress-test, and optimize survey questionnaires. It uses synthetic diagnostic personas powered by Gemini 2.0 Flash to detect bias, ambiguity, and structural flaws before you deploy to the field.

## Project Structure

- **/frontend**: Next.js 16 application (App Router) with integration for Sanity Studio (CMS).
- **/backend**: FastAPI (Python) service handling simulation logic, LLM coordination, and diagnostic audits.
- **/documents**: Project documentation and design assets.

## Tech Stack

- **Frontend**: Next.js, Framer Motion, Tailwind CSS, Lucide React, Sanity.io.
- **Backend**: FastAPI, Google GenAI SDK, Pandas.
- **AI**: Gemini 2.0 Flash (Diagnostic Respondants & Structural Audit).

## Getting Started

### 1. Environment Configuration

Create a `.env.local` in `frontend/` and a `.env` in `backend/`:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
GOOGLE_API_KEY="your_google_ai_studio_key"
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
```

**Backend (.env):**
```env
GOOGLE_API_KEY="your_google_ai_studio_key"
```

### 2. Installation & Development

From the root directory:

```bash
# Install root dependencies
npm install

# Run the full stack (Frontend, Backend, and Sanity Studio)
npm run dev
```

The workspace will launch:
- **Main Frontend**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3333](http://localhost:3333)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Deployment

### Frontend (Vercel)
- Set the root directory to `frontend`.
- Add all `NEXT_PUBLIC_*` environment variables to your Vercel project settings.
- Ensure the `NEXT_PUBLIC_API_URL` points to your deployed backend.

### Backend
- Deploy the `backend/` directory to a service supporting FastAPI (e.g., Render, Railway, or AWS).
- Update the Frontend environment variable to match the production backend URL.

---
© 2026 The Bureau. Confidential.
