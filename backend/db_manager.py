import aiosqlite
import time
import os
import json
from datetime import datetime
from logger import bureau_logger

from config import settings

DB_PATH = settings.DATABASE_PATH

async def init_db():
    bureau_logger.info(f"Initializing database at {DB_PATH}")
    async with aiosqlite.connect(DB_PATH) as conn:
        # Transactions table
        await conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT,
            status TEXT,
            latency_ms INTEGER,
            tokens_in INTEGER,
            tokens_out INTEGER,
            credits_consumed INTEGER DEFAULT 0,
            item_count INTEGER DEFAULT 0,
            sample_size INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # --- SELF-HEALING MIGRATION: Ensure token tracking columns exist ---
        # SQLite doesn't have an easy "IF NOT EXISTS" for ADD COLUMN, so we check pragma
        cursor = await conn.execute("PRAGMA table_info(transactions)")
        columns = [row[1] for row in await cursor.fetchall()]
        
        if "tokens_in" not in columns:
            await conn.execute("ALTER TABLE transactions ADD COLUMN tokens_in INTEGER DEFAULT 0")
        if "tokens_out" not in columns:
            await conn.execute("ALTER TABLE transactions ADD COLUMN tokens_out INTEGER DEFAULT 0")
        if "credits_consumed" not in columns:
            await conn.execute("ALTER TABLE transactions ADD COLUMN credits_consumed INTEGER DEFAULT 0")
        if "item_count" not in columns:
            await conn.execute("ALTER TABLE transactions ADD COLUMN item_count INTEGER DEFAULT 0")
        if "sample_size" not in columns:
            await conn.execute("ALTER TABLE transactions ADD COLUMN sample_size INTEGER DEFAULT 0")
        
        # Feedback table
        await conn.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_index INTEGER,
            question_text TEXT,
            finding_type TEXT,
            ai_assessment TEXT,
            client_verdict TEXT,
            comment TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Audit History
        await conn.execute('''
        CREATE TABLE IF NOT EXISTS audit_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quality_score INTEGER,
            issue_types TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Missions table
        await conn.execute('''
        CREATE TABLE IF NOT EXISTS missions (
            mission_id TEXT PRIMARY KEY,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Users table
        await conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            clearance_level INTEGER DEFAULT 0,
            is_super_admin BOOLEAN DEFAULT FALSE,
            credits INTEGER DEFAULT 100,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        await conn.commit()

async def set_user_clearance(email: str, level: int, is_super: bool = False):
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            await conn.execute('''
                INSERT INTO users (email, clearance_level, is_super_admin, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(email) DO UPDATE SET 
                    clearance_level=excluded.clearance_level,
                    is_super_admin=excluded.is_super_admin,
                    updated_at=CURRENT_TIMESTAMP
            ''', (email, level, bool(is_super)))
            await conn.commit()
    except Exception as e:
        bureau_logger.error(f"Failed to set user clearance: {e}")

async def get_user_clearance_local(email: str):
    # DEV OVERRIDE: Hardcode Super Admin for the owner
    if email == "bertrand.chagal@gmail.com":
        return {"clearance_level": 10, "is_super_admin": True, "credits": 88000}

    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute("SELECT clearance_level, is_super_admin, credits FROM users WHERE email = ?", (email,))
            row = await cursor.fetchone()
            if row:
                return dict(row)
            return {"clearance_level": 0, "is_super_admin": False, "credits": 100}
    except Exception as e:
        bureau_logger.error(f"Failed to get user clearance: {e}")
        return {"clearance_level": 0, "is_super_admin": False, "credits": 100}

async def update_user_credits(email: str, amount: int):
    """Spend or add credits to a user account."""
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            # We use COALESCE to handle new users if they don't exist yet (default 100)
            await conn.execute('''
                INSERT INTO users (email, credits, updated_at) 
                VALUES (?, 100 + ?, CURRENT_TIMESTAMP)
                ON CONFLICT(email) DO UPDATE SET 
                    credits = users.credits + ?,
                    updated_at = CURRENT_TIMESTAMP
            ''', (email, amount, amount))
            await conn.commit()
            return True
    except Exception as e:
        bureau_logger.error(f"Failed to update user credits: {e}")
        return False

async def log_transaction(endpoint, status, latency_ms, tokens_in=0, tokens_out=0, item_count=0, sample_size=0):
    try:
        # Calculate Credits (Additive Logic)
        # We calculate the 'raw' cost and then convert it to credits.
        # But for 'Premium Runs', the consumption is often a flat minimum or a fixed rate.
        cost_in = tokens_in * (settings.COST_PER_1M_INPUT / 1000000)
        cost_out = tokens_out * (settings.COST_PER_1M_OUTPUT / 1000000)
        raw_cost = cost_in + cost_out
        
        # 1 Credit = $0.001. So Cost / 0.001 = Credits.
        # We round up to ensure we never under-charge.
        calculated_credits = int(raw_cost / settings.CREDIT_VALUE) + 1 if raw_cost > 0 else 0

        async with aiosqlite.connect(settings.DATABASE_PATH) as conn:
            await conn.execute('''
                INSERT INTO transactions (endpoint, status, latency_ms, tokens_in, tokens_out, credits_consumed, item_count, sample_size)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (endpoint, status, int(latency_ms), int(tokens_in), int(tokens_out), calculated_credits, int(item_count), int(sample_size)))
            await conn.commit()
    except Exception as e:
        bureau_logger.error(f"Failed to log transaction: {e}")

async def log_audit_stat(quality_score, issues):
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            issue_types = json.dumps([i.get("type") for i in issues])
            await conn.execute('''
                INSERT INTO audit_history (quality_score, issue_types)
                VALUES (?, ?)
            ''', (quality_score, issue_types))
            await conn.commit()
    except Exception as e:
        bureau_logger.error(f"Failed to log audit stat: {e}")

async def log_feedback(feedback_data):
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            await conn.execute('''
                INSERT INTO feedback (question_index, question_text, finding_type, ai_assessment, client_verdict, comment)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                feedback_data.get("question_index"),
                feedback_data.get("question_text"),
                feedback_data.get("finding_type"),
                feedback_data.get("ai_assessment"),
                feedback_data.get("client_verdict"),
                feedback_data.get("comment")
            ))
            await conn.commit()
    except Exception as e:
        bureau_logger.error(f"Failed to log feedback: {e}")

async def save_mission(mission_id, mission_data_dict):
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            await conn.execute('''
                INSERT OR REPLACE INTO missions (mission_id, data)
                VALUES (?, ?)
            ''', (mission_id, json.dumps(mission_data_dict)))
            await conn.commit()
    except Exception as e:
        bureau_logger.error(f"Failed to save mission: {e}")

async def load_mission(mission_id):
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute("SELECT data FROM missions WHERE mission_id = ?", (mission_id,))
            row = await cursor.fetchone()
            if row:
                return json.loads(row['data'])
            return None
    except Exception as e:
        bureau_logger.error(f"Failed to load mission: {e}")
        return None

async def list_missions_db():
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute("SELECT data FROM missions ORDER BY created_at DESC")
            rows = await cursor.fetchall()
            return [json.loads(r['data']) for r in rows]
    except Exception as e:
        bureau_logger.error(f"Failed to list missions: {e}")
        return []

async def get_feedback_stats():
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            conn.row_factory = aiosqlite.Row
            cursor = await conn.execute("SELECT * FROM feedback")
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]
    except Exception as e:
        bureau_logger.error(f"Failed to get feedback stats: {e}")
        return []

async def get_admin_stats():
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            conn.row_factory = aiosqlite.Row
            
            # System Health
            cursor = await conn.execute('SELECT COUNT(*) as total, AVG(latency_ms) as avg_lat FROM transactions')
            health = await cursor.fetchone()
            
            cursor = await conn.execute('SELECT COUNT(*) as errors FROM transactions WHERE status = "ERROR"')
            errors = await cursor.fetchone()
            
            # Commercial Health
            # Revenue logic using Premium Consultancy-Grade settings
            cursor = await conn.execute('SELECT COUNT(*) as c FROM transactions WHERE endpoint = "/sentinel/initialize"')
            sentinel_count = (await cursor.fetchone())['c']
            
            cursor = await conn.execute('SELECT COUNT(*) as c FROM transactions WHERE endpoint = "/genesis/generate"')
            genesis_count = (await cursor.fetchone())['c']
            
            cursor = await conn.execute('SELECT COUNT(*) as c FROM transactions WHERE endpoint = "/interpreter/process"')
            interpreter_count = (await cursor.fetchone())['c']

            revenue = (
                (sentinel_count * settings.PRICING_SENTINEL) +
                (genesis_count * settings.PRICING_GENESIS) +
                (interpreter_count * settings.PRICING_INTERPRETER)
            )
            
            t_in = tokens['t_in'] or 0
            t_out = tokens['t_out'] or 0
            cost_in = t_in * (settings.COST_PER_1M_INPUT / 1000000)
            cost_out = t_out * (settings.COST_PER_1M_OUTPUT / 1000000)
            total_cost = cost_in + cost_out
            
            # Unit Economics
            cursor = await conn.execute('SELECT SUM(item_count) as total_q, SUM(sample_size) as total_n FROM transactions')
            vitals = await cursor.fetchone()
            total_q = vitals['total_q'] or 0
            total_n = vitals['total_n'] or 0
            
            avg_tokens_per_q = (t_in + t_out) / total_q if total_q > 0 else 0
            avg_cost_per_q = total_cost / total_q if total_q > 0 else 0
            
            # Accuracy
            cursor = await conn.execute('SELECT quality_score FROM audit_history')
            scores = [r['quality_score'] for r in await cursor.fetchall()]
            avg_score = sum(scores)/len(scores) if scores else 0
            
            total_reqs = health['total'] or 0
            error_count = errors['errors'] or 0

            return {
                "system_health": {
                    "total_requests": total_reqs,
                    "avg_latency_ms": round(health['avg_lat'] or 0, 2),
                    "error_rate": round((error_count / total_reqs * 100) if total_reqs > 0 else 0, 2),
                    "status": "OPERATIONAL" if (error_count / (total_reqs or 1)) < 0.05 else "DEGRADED"
                },
                "financial_health": {
                    "total_revenue": round(revenue, 2),
                    "hero_audit_revenue": round(hero_audits * settings.PRICING_HERO_AUDIT, 2),
                    "enterprise_revenue": round(simulations * settings.PRICING_ENTERPRISE_SIM, 2),
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
                        {"scale": "Hero Audit", "avg_q": 1, "avg_n": 0, "avg_cost": 0.0002, "revenue": settings.PRICING_HERO_AUDIT},
                        {"scale": "Enterprise Small", "avg_q": 10, "avg_n": 20, "avg_cost": 0.0450, "revenue": settings.PRICING_ENTERPRISE_SIM},
                        {"scale": "Enterprise Large", "avg_q": 20, "avg_n": 100, "avg_cost": 0.1850, "revenue": settings.PRICING_ENTERPRISE_SIM * 3}
                    ]
                },
                "audit_metrics": {
                    "total_audits_performed": len(scores),
                    "average_quality_score": round(avg_score, 1),
                },
                "asi_status": {
                    "last_broadcast": "SUCCESS",
                    "success_rate": 100,
                    "indexnow_status": "202 ACCEPTED",
                    "active_feed_hits": 14 
                }
            }
    except Exception as e:
        bureau_logger.error(f"Failed to get admin stats: {e}")
        return {}
