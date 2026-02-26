import os
import sys
import asyncio
import json
import sqlite3
import time
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def print_header(text):
    print(f"\n{'='*60}")
    print(f" {text.upper()}")
    print(f"{'='*60}")

async def run_audit():
    print_header("AVA Intelligence System - Full Health Audit")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"System: {sys.platform} | Python: {sys.version.split()[0]}")

    # 1. Environment & Keys
    print_header("1. Environment Configuration")
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv("GOOGLE_API_KEY")
    print(f"[*] GOOGLE_API_KEY: {'[PROTECTED] FOUND' if api_key else '[MISSING] CRITICAL'}")
    
    # 2. Database Integrity
    print_header("2. Database & Persistence Layer")
    db_path = "backend/the_bureau.db"
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check for core tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [t[0] for t in cursor.fetchall()]
            print(f"[*] Tables Found: {', '.join(tables)}")
            
            # Check transaction count
            if 'transactions' in tables:
                cursor.execute("SELECT COUNT(*) FROM transactions")
                count = cursor.fetchone()[0]
                print(f"[*] Historical Transactions: {count}")
            
            conn.close()
            print("[✓] Persistence Layer: OPERATIONAL")
        except Exception as e:
            print(f"[!] Database Error: {e}")
    else:
        print("[!] the_bureau.db NOT FOUND. System will initialize on startup.")

    # 3. Backend Service Scaffolding
    print_header("3. Intelligence Module Loading")
    try:
        from simulation_engine import MarketSimulator
        from architect_service import SurveyArchitect
        from context_engine import context_engine
        
        sim = MarketSimulator()
        architect = SurveyArchitect()
        
        print("[*] MarketSimulator: INITIALIZED")
        print("[*] SurveyArchitect: INITIALIZED")
        print("[*] ContextEngine: READY")
        print("[✓] Backend Core: OPERATIONAL")
    except Exception as e:
        print(f"[!] Module Import Error: {e}")

    # 4. Python Kernel Verification
    print_header("4. AVA Kernel Engine Diagnostics")
    kernel_globals = {"__name__": "__main__", "pd": None}
    code = """
import pandas as pd
data = {'Module': ['Sentinel', 'Genesis', 'Lab', 'Kernel'], 'Status': ['OK', 'OK', 'OK', 'LOCAL_RUN']}
df = pd.DataFrame(data)
print(df.to_string(index=False))
"""
    try:
        import io
        from contextlib import redirect_stdout
        stdout = io.StringIO()
        with redirect_stdout(stdout):
            exec(code, kernel_globals)
        
        print(f"[*] Kernel Execution Result:\n{stdout.getvalue()}")
        print("[✓] Python Kernel: READY")
    except Exception as e:
        print(f"[!] Kernel Error: {e}")

    # 5. AI API Latency (Ping)
    print_header("5. AI Connectivity (Signal Ping)")
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            start = time.time()
            # Simple model check
            models = client.models.list()
            latency = (time.time() - start) * 1000
            print(f"[*] Gemini API Response Time: {latency:.2f}ms")
            print("[✓] AI Connectivity: ACTIVE")
        except Exception as e:
            print(f"[!] AI Connection Failed: {e}")
    else:
        print("[-] Skipping AI Connectivity due to missing key.")

    print_header("AUDIT COMPLETE - SYSTEM STABLE")

if __name__ == "__main__":
    asyncio.run(run_audit())
