# Market Research Simulation Engine

A portable Python-based engine to simulate survey responses from diverse synthetic personas using Google Gemini.

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key:**
   - Copy `.env.example` to `.env`.
   - Add your [Google AI Studio API Key](https://aistudio.google.com/app/apikey) to the `.env` file.

## Usage

### 🚀 GUI Mode (Recommended)
To launch the modern, OS-agnostic graphical interface:
```bash
streamlit run gui_app.py
```
This opens a dashboard in your browser where you can:
*   Input your API key securely.
*   Upload custom Personas and Questions.
*   Track simulation progress in real-time.
*   Preview and download the final CSV results.

### 💻 CLI Mode
Run the simulation directly from the terminal:
```bash
python simulation_engine.py
```
Results will be saved to `data/survey_results.csv`.

## Core Components

- `simulation_engine.py`: The main logic for persona adoption and API interaction.
- `data/`: Directory for input JSONs and output CSVs.
- `requirements.txt`: Python package dependencies (Pandas, Google Generative AI, etc.).
