import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import re
import json
from google.genai import types

def extract_score(text):
    if pd.isna(text): return None
    text_str = str(text).lower()
    word_map = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }
    digit_match = re.search(r'\b([1-9]|10)\b', text_str)
    if digit_match:
        return int(digit_match.group(1))
    for word, val in word_map.items():
        if word in text_str:
            return val
    return None

def analyze_sentiment_ai(client, model_name, text, context):
    """Uses AI to provide a nuanced sentiment verdict."""
    if pd.isna(text) or len(str(text)) < 2: return "N/A"
    
    prompt = (
        f"Analyze this survey response within the context of: '{context}'\n\n"
        f"RESPONSE: '{text}'\n\n"
        f"Is the respondent 'Interested', 'Skeptical', or 'Rejecting'?\n"
        f"Return ONLY a JSON object with two keys: 'verdict' and 'reason'."
    )
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
                temperature=0.3
            )
        )
        data = json.loads(response.text)
        return data.get('verdict', 'Skeptical'), data.get('reason', '')
    except:
        return "Skeptical", "Analysis failed."

def generate_executive_summary(client, model_name, df, context):
    """Generates a high-level strategic summary of the findings."""
    data_summary = df.to_json(orient='records')
    prompt = (
        f"As a market research expert, analyze these simulation results for: '{context}'\n\n"
        f"DATA: {data_summary}\n\n"
        f"Provide a high-level Executive Summary including:\n"
        f"1. Core Finding (The 'Headline')\n"
        f"2. Demographic Winner (Who loved it?)\n"
        f"3. Main Friction Point (Why did people reject it?)\n"
        f"4. Strategic Recommendation.\n"
        f"Keep it professional, concise, and impactful."
    )
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(temperature=0.7)
        )
        return response.text
    except Exception as e:
        return f"Summary generation unavailable: {e}"

def perform_analysis_bridge(df, client, model_name, context):
    """Bridge function to run full AI-augmented analysis."""
    # Find question columns
    metadata_cols = ['Agent', 'Demographic', 'PersonaID', 'Name', 'Age', 'Occupation']
    survey_cols = [c for c in df.columns if c not in metadata_cols and not c.endswith('_Score') and not c.endswith('_Verdict')]
    
    if len(survey_cols) >= 1:
        df['Q1_Score'] = df[survey_cols[0]].apply(extract_score)
        
    if len(survey_cols) >= 2:
        # Second-Pass AI Analysis for sentiment
        results = df[survey_cols[1]].apply(lambda x: analyze_sentiment_ai(client, model_name, x, context))
        df['Q2_Verdict'] = [r[0] for r in results]
        df['Q2_Reason'] = [r[1] for r in results]
    
    return df

def generate_premium_chart(df):
    if 'Q1_Score' not in df.columns or 'Agent' not in df.columns:
        return None
    
    plot_df = df.dropna(subset=['Q1_Score'])
    if plot_df.empty: return None

    fig = px.bar(
        plot_df, 
        x='Agent', 
        y='Q1_Score',
        color='Q1_Score',
        color_continuous_scale='Viridis',
        labels={'Q1_Score': 'Intensity Score', 'Agent': 'Market Persona'},
        template='plotly_dark'
    )
    
    fig.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='white'),
        margin=dict(l=20, r=20, t=40, b=20),
        height=400
    )
    
    return fig