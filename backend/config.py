import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Core API Keys
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # Database Configuration
    DATABASE_MODE: str = os.getenv("DATABASE_MODE", "SQLITE") # Options: SQLITE, FIRESTORE (Future)
    DATABASE_PATH: str = "the_bureau.db"
    
    # Global AI Settings
    DEFAULT_MODEL: str = "gemini-flash-latest"
    MAX_CONCURRENCY: int = 5
    
    # Environment
    ENV: str = os.getenv("NODE_ENV", "development")
    
    # API URLs (Internal)
    NEXT_PUBLIC_API_URL: str = os.getenv("NEXT_PUBLIC_API_URL", "http://127.0.0.1:8000")

    # Unit Economics & Consultancy-Grade Pricing (USD)
    PRICING_SENTINEL: float = 0.0
    PRICING_GENESIS: float = 299.00
    PRICING_LAB: float = 499.00
    PRICING_INTERPRETER: float = 399.00
    
    # Legacy/Default Pricing (Fallbacks)
    PRICING_HERO_AUDIT: float = 5.0
    PRICING_ENTERPRISE_SIM: float = 50.0
    
    # Credit System: 1 Credit = €0.0006
    CREDIT_VALUE: float = 0.0006
    
    # Token Costs per 1M (Gemini 1.5 Flash Basis + 30% Safety Buffer)
    COST_PER_1M_INPUT: float = 0.10
    COST_PER_1M_OUTPUT: float = 0.40

    class Config:
        env_file = ".env"
        extra = 'ignore'

# Shared instance
settings = Settings()
