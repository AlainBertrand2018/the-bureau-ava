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
    DEFAULT_MODEL: str = "gemini-3-flash"
    MAX_CONCURRENCY: int = 5
    
    # Environment
    ENV: str = os.getenv("NODE_ENV", "development")
    
    # API URLs (Internal)
    NEXT_PUBLIC_API_URL: str = os.getenv("NEXT_PUBLIC_API_URL", "http://127.0.0.1:8000")

    # Unit Economics (USD)
    PRICING_HERO_AUDIT: float = 5.0
    PRICING_ENTERPRISE_SIM: float = 50.0
    
    # Token Costs per 1M (Gemini 2.0 Flash approx)
    COST_PER_1M_INPUT: float = 0.10
    COST_PER_1M_OUTPUT: float = 0.40

    class Config:
        env_file = ".env"
        extra = 'ignore'

# Shared instance
settings = Settings()
