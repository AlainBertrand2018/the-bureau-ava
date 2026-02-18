import sqlite3
import time
import os
import json
from datetime import datetime
from logger import bureau_logger

from config import settings

DB_PATH = settings.DATABASE_PATH

def init_db():
    bureau_logger.info(f"Initializing database at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Transactions table for Audit & Health
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT,
        status TEXT,
        latency_ms INTEGER,
        tokens_in INTEGER,
        tokens_out INTEGER,
        item_count INTEGER DEFAULT 0,  -- Number of questions/items
        sample_size INTEGER DEFAULT 0, -- n count (respondents)
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Check if columns exist (for migration)
    cursor.execute("PRAGMA table_info(transactions)")
    columns = [row[1] for row in cursor.fetchall()]
    if 'item_count' not in columns:
        cursor.execute('ALTER TABLE transactions ADD COLUMN item_count INTEGER DEFAULT 0')
    if 'sample_size' not in columns:
        cursor.execute('ALTER TABLE transactions ADD COLUMN sample_size INTEGER DEFAULT 0')

    # Feedback table (moved from in-memory)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        finding_type TEXT,
        client_verdict TEXT,
        comment TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Audit History for Stats
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quality_score INTEGER,
        issue_types TEXT, -- JSON array of detected issues
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()

def log_transaction(endpoint, status, latency_ms, tokens_in=0, tokens_out=0, item_count=0, sample_size=0):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO transactions (endpoint, status, latency_ms, tokens_in, tokens_out, item_count, sample_size)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (endpoint, status, int(latency_ms), int(tokens_in), int(tokens_out), int(item_count), int(sample_size)))
    conn.commit()
    conn.close()

def log_audit_stat(quality_score, issues):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    issue_types = json.dumps([i.get("type") for i in issues])
    cursor.execute('''
        INSERT INTO audit_history (quality_score, issue_types)
        VALUES (?, ?)
    ''', (quality_score, issue_types))
    conn.commit()
    conn.close()

def get_admin_stats():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # System Health
    cursor.execute('SELECT COUNT(*) as total, AVG(latency_ms) as avg_lat FROM transactions')
    health = cursor.fetchone()
    
    cursor.execute('SELECT COUNT(*) as errors FROM transactions WHERE status = "ERROR"')
    errors = cursor.fetchone()
    
    # Commercial Health: Mix of Hero Audits ($5) and Enterprise Simulations ($50)
    cursor.execute('SELECT COUNT(*) as hero_count FROM transactions WHERE endpoint = "/quick_audit"')
    hero_audits = cursor.fetchone()['hero_count']
    
    cursor.execute('SELECT COUNT(*) as sim_count FROM transactions WHERE endpoint = "/simulate"')
    simulations = cursor.fetchone()['sim_count']
    
    cursor.execute('SELECT SUM(tokens_in) as t_in, SUM(tokens_out) as t_out FROM transactions')
    tokens = cursor.fetchone()
    
    # Revenue logic
    revenue = (hero_audits * 5.0) + (simulations * 50.0)
    
    # Pricing: $0.10/1M in, $0.40/1M out
    t_in = tokens['t_in'] or 0
    t_out = tokens['t_out'] or 0
    cost_in = t_in * 0.0000001
    cost_out = t_out * 0.0000004
    total_cost = cost_in + cost_out
    
    # --- Unit Economics calculations ---
    cursor.execute('SELECT SUM(item_count) as total_q, SUM(sample_size) as total_n FROM transactions')
    vitals = cursor.fetchone()
    total_q = vitals['total_q'] or 0
    total_n = vitals['total_n'] or 0
    
    avg_tokens_per_q = (t_in + t_out) / total_q if total_q > 0 else 0
    avg_cost_per_q = total_cost / total_q if total_q > 0 else 0
    
    # Stats: Accuracy
    cursor.execute('SELECT quality_score FROM audit_history')
    scores = [r['quality_score'] for r in cursor.fetchall()]
    avg_score = sum(scores)/len(scores) if scores else 0
    
    conn.close()
    
    return {
        "system_health": {
            "total_requests": health['total'],
            "avg_latency_ms": round(health['avg_lat'] or 0, 2),
            "error_rate": round((errors['errors'] / health['total'] * 100) if health['total'] > 0 else 0, 2),
            "status": "OPERATIONAL" if (errors['errors'] / (health['total'] or 1)) < 0.05 else "DEGRADED"
        },
        "financial_health": {
            "total_revenue": round(revenue, 2),
            "hero_audit_revenue": round(hero_audits * 5.0, 2),
            "enterprise_revenue": round(simulations * 50.0, 2),
            "total_token_cost": round(total_cost, 4),
            "net_profit": round(revenue - total_cost, 2),
            "roi_ratio": round(revenue / total_cost, 2) if total_cost > 0 else 0,
            "simulations_count": simulations,
            "hero_audits_count": hero_audits,
            "currency": "USD"
        },
        "unit_economics": {
            "total_questions_processed": total_q,
            "avg_tokens_per_question": round(avg_tokens_per_q, 1),
            "avg_cost_per_question": round(avg_cost_per_q, 4),
            "revenue_per_question": round(revenue / total_q, 2) if total_q > 0 else 0,
            "profit_margin": round(((revenue - total_cost) / revenue * 100), 2) if revenue > 0 else 0,
            "comparative_metrics": [
                {"scale": "Hero Audit", "avg_q": 1, "avg_n": 0, "avg_cost": 0.0002, "revenue": 5.0},
                {"scale": "Enterprise Small", "avg_q": 10, "avg_n": 20, "avg_cost": 0.0450, "revenue": 50.0},
                {"scale": "Enterprise Large", "avg_q": 20, "avg_n": 100, "avg_cost": 0.1850, "revenue": 150.0}
            ]
        },
        "audit_metrics": {
            "total_audits_performed": len(scores),
            "average_quality_score": round(avg_score, 1),
        }
    }

init_db()
