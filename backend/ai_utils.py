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

def extract_country(context: str) -> str:
    """Extract country name from context string if present."""
    # Common patterns: "in India", "for Nigeria", "India market"
    country_patterns = [
        r'\bin\s+(India|Nigeria|South Africa|Kenya|Mauritius|United States|United Kingdom|France|Germany|Brazil|China|Japan|Australia|Canada|Ghana|Egypt|Morocco|Indonesia|Philippines|Vietnam|Thailand|Malaysia|Singapore|UAE|Saudi Arabia|Mexico|Colombia|Argentina|Turkey|Poland|Italy|Spain|Netherlands|Sweden|Norway|Denmark|Switzerland|Austria|Belgium|Portugal|Greece|Czech Republic|Romania|Hungary|Pakistan|Bangladesh|Sri Lanka|Nepal|Myanmar|Tanzania|Uganda|Ethiopia|Senegal|Ivory Coast|Cameroon|DRC|Rwanda|Zimbabwe|Mozambique|Madagascar|Zambia|Botswana|Namibia|Angola|Tunisia|Algeria|Libya|Sudan|Somalia|Jordan|Lebanon|Iraq|Iran|Israel|Palestine|Qatar|Kuwait|Bahrain|Oman|Yemen|Afghanistan|Uzbekistan|Kazakhstan|Mongolia|Taiwan|South Korea|North Korea|Hong Kong|New Zealand|Fiji|Papua New Guinea|Jamaica|Trinidad|Haiti|Cuba|Dominican Republic|Costa Rica|Panama|Ecuador|Peru|Chile|Uruguay|Paraguay|Bolivia|Venezuela)\b',
        r'\bfor\s+(\w+)\s+(?:market|consumers|audience|professionals)',
    ]
    for pattern in country_patterns:
        match = re.search(pattern, context, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return ""  # No default here, let the caller decide fallback

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
