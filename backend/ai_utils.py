import asyncio
import json
import re
from typing import Any, Dict, Optional, Union
from google import genai
import random
from logger import bureau_logger

async def generate_with_retry(
    client: genai.Client,
    model: str,
    contents: Any,
    config: Any = None,
    retries: int = 5,
    log_func: Optional[callable] = None
) -> Any:
    """
    Robust wrapper for Google GenAI generation with exponential backoff and jitter.
    """
    for attempt in range(retries):
        try:
            return await client.aio.models.generate_content(
                model=model,
                contents=contents,
                config=config
            )
        except Exception as e:
            err_str = str(e).upper()
            # 429 = Rate Limit, 500/503 = Server Overloaded
            if any(code in err_str for code in ["429", "RESOURCE_EXHAUSTED", "503", "SERVICE_UNAVAILABLE"]):
                if attempt < retries - 1:
                    # Exponential backoff: 2, 4, 8, 16... + jitter
                    base_wait = (2 ** (attempt + 1))
                    jitter = random.uniform(0, 1.0)
                    wait_time = base_wait + jitter
                    
                    msg = f"AI API Overloaded ({err_str[:20]}...). Retrying in {wait_time:.2f}s... (Attempt {attempt+1}/{retries})"
                    if log_func:
                        log_func(msg)
                    bureau_logger.warning(f"AI_RETRY: {msg}")
                        
                    await asyncio.sleep(wait_time)
                    continue
            
            # Log specific error before raising
            if log_func:
                log_func(f"AI FATAL ERROR: {str(e)}")
            bureau_logger.error(f"AI_FATAL: {str(e)}")
            raise e
    return None

def clean_json_text(text: str) -> str:
    """
    Strips markdown code blocks and whitespace from a string to prepare it for json.loads.
    """
    text = text.strip()
    # Remove markdown code blocks
    if text.startswith("```"):
        # Remove first line (e.g. ```json)
        text = text.split("\n", 1)[1] if "\n" in text else ""
        # Remove last line if it's ```
        if text.endswith("```"):
            text = text[:-3]
    return text.strip()

def safe_parse_json(text: str, default: Any = None) -> Any:
    """
    Robustly attempts to parse JSON, including regex fallback for embedded objects.
    """
    cleaned = clean_json_text(text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: try to find the first { ... } or [ ... ]
        try:
            match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
            if match:
                return json.loads(match.group(0))
        except:
            pass
    return default if default is not None else {}
