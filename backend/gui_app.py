import streamlit as st
import pandas as pd
import json
import os
import time
from io import BytesIO
from simulation_engine import MarketSimulator
import analyze_results
import plotly.express as px

# --- Elite Design System & Page Configuration ---
st.set_page_config(
    page_title="SOB | Intelligence Terminal",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Custom High-End Styling (Glassmorphism + Dark Mode)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@300;500;700&display=swap');

    :root {
        --glass-bg: rgba(255, 255, 255, 0.03);
        --glass-border: rgba(255, 255, 255, 0.1);
        --accent-glow: 0 0 20px rgba(37, 99, 235, 0.2);
    }

    .stApp {
        background: radial-gradient(circle at top right, #1e293b, #0f172a);
        color: #f8fafc;
        font-family: 'Inter', sans-serif;
    }

    h1, h2, h3, .stSubheader {
        font-family: 'Outfit', sans-serif !important;
        letter-spacing: -0.02em;
    }

    .glass-card {
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        margin-bottom: 2rem;
    }

    .stButton>button {
        background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 600 !important;
        padding: 0.75rem 2rem !important;
        transition: all 0.3s ease !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: var(--accent-glow);
    }

    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.4);
    }

    .persona-card {
        background: rgba(255, 255, 255, 0.05);
        border-left: 4px solid #3b82f6;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
    }

    code { color: #818cf8 !important; }
    
    .status-pulse {
        width: 12px;
        height: 12px;
        background: #22c55e;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
        box-shadow: 0 0 10px #22c55e;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        70% { transform: scale(1.1); opacity: 0; }
        100% { transform: scale(0.95); opacity: 0; }
    }
    
    /* Elegant Inputs */
    .stTextInput>div>div>input, .stTextArea>div>div>textarea {
        background-color: rgba(255, 255, 255, 0.05) !important;
        color: white !important;
        border: 1px solid var(--glass-border) !important;
    }
</style>
""", unsafe_allow_html=True)

# --- Initialization ---
if 'step' not in st.session_state: st.session_state.step = "brief"
if 'questions' not in st.session_state: st.session_state.questions = []
if 'personas' not in st.session_state: st.session_state.personas = []
if 'survey_context' not in st.session_state: st.session_state.survey_context = ""
if 'num_personas' not in st.session_state: st.session_state.num_personas = 5
if 'api_key' not in st.session_state: st.session_state.api_key = os.getenv("GOOGLE_API_KEY", "")

def main():
    # --- Top Navigation / Header ---
    col_logo, col_nav = st.columns([1, 1])
    with col_logo:
        st.markdown("<h2 style='margin:0;'>SOB <span style='color:#3b82f6;'>INTELLIGENCE</span></h2>", unsafe_allow_html=True)
    with col_nav:
        st.markdown(f"<div style='text-align:right; font-size:0.8rem; color:#94a3b8; padding-top:10px;'>TERMINAL V2.0 // AGENTIC SIMULATION ALIVE</div>", unsafe_allow_html=True)
    
    st.divider()

    # Sidebar (Hidden by default for cleanliness)
    with st.sidebar:
        st.header("Terminal Config")
        st.session_state.api_key = st.text_input("G-Core API Key", type="password", value=st.session_state.api_key)
        model_choice = st.selectbox("LLM Core", ["gemini-flash-latest", "gemini-3-flash"])
        if st.button("Reset Terminal"):
            st.session_state.step = "brief"
            st.session_state.questions = []
            st.session_state.personas = []
            st.rerun()

    # --- PROGRESSIVE WORKFLOW ---
    
    # PHASE 1: THE BRIEF
    if st.session_state.step == "brief":
        st.markdown("""
        <div style='text-align:center; padding: 3rem 0;'>
            <h1 style='font-size:3.5rem; margin-bottom:1rem;'>Strategy Start Here.</h1>
            <p style='font-size:1.2rem; color:#94a3b8;'>Define your market context. Let the AI architect your synthetic village.</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.subheader("1 // Intelligence Context")
        ctx = st.text_area("What are we simulating?", 
                         placeholder="Describe your product, pricing, and target goal...",
                         value=st.session_state.survey_context, height=150)
        st.session_state.survey_context = ctx
        
        col1, col2 = st.columns([2, 1])
        with col2:
            st.session_state.num_personas = st.slider("Population Volume", 3, 20, 5)
        
        st.divider()
        st.subheader("2 // Strategic Inquiry")
        
        # Question Lab
        if st.button("🪄 ARCHITECT QUESTIONS WITH AI"):
            if not st.session_state.api_key: st.error("API Key Required")
            elif not ctx: st.warning("Define context first")
            else:
                with st.spinner("AI analyzing market dynamics..."):
                    sim = MarketSimulator(api_key=st.session_state.api_key, model_name="gemini-flash-latest")
                    suggested = sim.generate_questions(ctx, count=5)
                    st.session_state.questions = suggested['questions']
                    st.session_state.rationale = suggested['rationale']
                    for i, q in enumerate(st.session_state.questions):
                        st.session_state[f"q_input_{i}"] = q
                    st.rerun()

        # Dynamic Inputs
        q_cols = st.columns(2)
        new_qs = []
        for i in range(10):
            col_idx = 0 if i < 5 else 1
            with q_cols[col_idx]:
                if f"q_input_{i}" not in st.session_state:
                    st.session_state[f"q_input_{i}"] = st.session_state.questions[i] if i < len(st.session_state.questions) else ""
                val = st.text_input(f"Inquiry {i+1}", key=f"q_input_{i}", placeholder="Enter question...")
                if val.strip(): new_qs.append(val)
        st.session_state.questions = new_qs
        
        if st.button("PROCEED TO POPULATION GENERATION", use_container_width=True):
            if st.session_state.questions:
                st.session_state.step = "village"
                st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    # PHASE 2: THE VILLAGE
    elif st.session_state.step == "village":
        st.markdown("<h2 style='text-align:center;'>Synthesizing Diverse Agents...</h2>", unsafe_allow_html=True)
        
        if not st.session_state.personas:
            with st.spinner("Casting identities..."):
                sim = MarketSimulator(api_key=st.session_state.api_key, model_name="gemini-flash-latest")
                st.session_state.personas = sim.generate_personas(st.session_state.num_personas, st.session_state.survey_context)
        
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        cols = st.columns(3)
        for i, p in enumerate(st.session_state.personas):
            with cols[i % 3]:
                st.markdown(f"""
                <div class="persona-card">
                    <div style='font-size:0.7rem; color:#3b82f6; font-weight:700;'>AGENT 0{i+1}</div>
                    <div style='font-size:1.2rem; font-weight:600;'>{p['name']}</div>
                    <div style='font-size:0.85rem; color:#94a3b8;'>{p['age']}y // {p['location']}</div>
                    <div style='margin-top:10px; font-size:0.8rem; font-style:italic;'>"{p['traits']}"</div>
                </div>
                """, unsafe_allow_html=True)
        
        st.divider()
        c1, c2 = st.columns(2)
        with c1: 
            if st.button("⬅️ REVISE BRIEF"):
                st.session_state.step = "brief"
                st.rerun()
        with c2:
            if st.button("⚡ INITIALIZE SIMULATION ENGINE"):
                st.session_state.step = "engine"
                st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    # PHASE 3: THE ENGINE
    elif st.session_state.step == "engine":
        st.markdown('<div class="glass-card" style="text-align:center; padding: 5rem;">', unsafe_allow_html=True)
        st.markdown("<div class='status-pulse'></div> <span style='font-size:1.5rem;'>ENGAGING SYNTHETIC VOICES...</span>", unsafe_allow_html=True)
        
        progress_bar = st.progress(0)
        status = st.empty()
        
        sim = MarketSimulator(api_key=st.session_state.api_key, model_name="gemini-flash-latest")
        
        results = []
        total = len(st.session_state.personas) * len(st.session_state.questions)
        current = 0
        
        for p in st.session_state.personas:
            row = {"Agent": p.get('name'), "Demographic": f"{p.get('age')}/{p.get('location')}"}
            for q in st.session_state.questions:
                status.markdown(f"<p style='color:#94a3b8;'>Agent <b>{p['name']}</b> is considering: <i>{q[:50]}...</i></p>", unsafe_allow_html=True)
                answer = sim.get_response(p, q)
                row[q] = answer
                current += 1
                progress_bar.progress(current / total)
                time.sleep(0.3)
            results.append(row)
        
        with st.spinner("AI Analysis Orchestration..."):
            df = pd.DataFrame(results)
            # Final Enhanced Analysis
            df = analyze_results.perform_analysis_bridge(df, sim.client, "gemini-flash-latest", st.session_state.survey_context)
            summary = analyze_results.generate_executive_summary(sim.client, "gemini-flash-latest", df, st.session_state.survey_context)
            
            st.session_state.simulation_results = df
            st.session_state.executive_summary = summary
            st.session_state.step = "boardroom"
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    # PHASE 4: THE BOARDROOM
    elif st.session_state.step == "boardroom":
        st.markdown("<h1 style='text-align:center; font-size:3rem;'>Market Intelligence Report</h1>", unsafe_allow_html=True)
        
        df = st.session_state.simulation_results
        
        # Executive Summary Section
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.write("### 💎 STRATEGIC EXECUTIVE SUMMARY")
        st.markdown(st.session_state.executive_summary)
        st.markdown('</div>', unsafe_allow_html=True)
        
        col_left, col_right = st.columns([3, 2])
        
        with col_left:
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.write("### 📊 INTEREST INTENSITY MATRIX")
            fig = analyze_results.generate_premium_chart(df)
            if fig: st.plotly_chart(fig, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)
            
        with col_right:
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)
            st.write("### 🧾 SENTIMENT SYNTHESIS")
            if 'Q2_Verdict' in df.columns:
                verdicts = df['Q2_Verdict'].value_counts()
                fig_pie = px.pie(values=verdicts.values, names=verdicts.index, hole=.4, template='plotly_dark')
                st.plotly_chart(fig_pie, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        # Full Data Drilldown
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.write("### 🔍 RAW INTELLIGENCE FEED")
        st.dataframe(df, use_container_width=True)
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("DOWNLOAD EXCEL AUDIT", csv, "SOB_Intelligence_Report.csv", "text/csv")
        st.markdown('</div>', unsafe_allow_html=True)
        
        if st.button("NEW RESEARCH MANDATE", use_container_width=True):
            st.session_state.step = "brief"
            st.session_state.questions = []
            st.session_state.personas = []
            st.rerun()

if __name__ == "__main__":
    main()
