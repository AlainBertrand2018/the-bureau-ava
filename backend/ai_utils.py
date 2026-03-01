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
            
            # Use exponential backoff for rate limits or overloaded servers
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "503" in err_str or "SERVICE_UNAVAILABLE" in err_str:
                if attempt < retries - 1:
                    base_wait = (2 ** (attempt + 1))
                    jitter = random.uniform(0, 1.0)
                    wait_time = base_wait + jitter
                    
                    msg = f"AI API Overloaded/Quota Exceeded. Retrying in {wait_time:.2f}s... (Attempt {attempt+1}/{retries})"
                    if log_func:
                        log_func(msg)
                    bureau_logger.warning(f"AI_RETRY: {msg} | Detail: {err_str[:100]}")
                        
                    await asyncio.sleep(wait_time)
                    continue
            
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
    Flattens single-element lists if a dictionary is expected.
    """
    cleaned = clean_json_text(text)
    data = None
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: try to find the first { ... } or [ ... ]
        try:
            match = re.search(r'(\{.*\}|\[.*\])', text, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
        except:
            data = None
            
    # PROJECT-WIDE FIX: If we expected an object (default is a dict or None) but got a list, take the first element.
    if data is not None and isinstance(data, list) and (default is None or isinstance(default, dict)):
        if len(data) > 0:
            data = data[0]
        else:
            data = {} if default is None else default
    
    if data is not None:
        return data
        
    return default if default is not None else {}
