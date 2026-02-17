import asyncio
import json
import re
from typing import Any, Dict, Optional, Union
from google import genai

async def generate_with_retry(
    client: genai.Client,
    model: str,
    contents: Any,
    config: Any = None,
    retries: int = 3,
    log_func: Optional[callable] = None
) -> Any:
    """
    Robust wrapper for Google GenAI generation with exponential backoff for 429 errors.
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
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                if attempt < retries - 1:
                    wait_time = (2 ** attempt) + 1
                    if log_func:
                        log_func(f"API Rate Limit (429). Retrying in {wait_time}s... (Attempt {attempt+1}/{retries})")
                    else:
                        print(f"API Rate Limit (429). Retrying in {wait_time}s... (Attempt {attempt+1}/{retries})")
                    await asyncio.sleep(wait_time)
                    continue
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
