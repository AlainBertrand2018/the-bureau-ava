import logging
import os
from datetime import datetime

# Define log format
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

def setup_logger(name: str):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Console Handler
    c_handler = logging.StreamHandler()
    c_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(c_handler)
    
    # File Handler (Optional for local debug, but good for "failproof" audit)
    try:
        f_handler = logging.FileHandler("bureau_system.log")
        f_handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(f_handler)
    except:
        pass # Fallback if file system is read-only
        
    return logger

# Global instance for quick access
bureau_logger = setup_logger("TheBureau")
