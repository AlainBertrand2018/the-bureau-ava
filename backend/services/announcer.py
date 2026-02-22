import httpx
import asyncio
from logger import bureau_logger
import os

class AnnouncerService:
    """
    Active Signal Injection Service for The Bureau.
    Handles IndexNow, Sitemap Pings, and forced real-time ingestion.
    """
    
    def __init__(self):
        self.base_url = "https://ava.launchableai.online"
        self.sitemap_url = f"{self.base_url}/sitemap.xml"
        self.indexnow_key = os.getenv("INDEXNOW_KEY", "bureau-sovereign-key") # Compliant with a-z, A-Z, 0-9, -
        
    async def ping_indexnow(self, urls: list):
        """Notifies Bing and others via IndexNow protocol."""
        # IndexNow endpoint (Bing/Yandex cluster)
        endpoint = "https://api.indexnow.org/IndexNow"
        payload = {
            "host": "ava.launchableai.online",
            "key": self.indexnow_key,
            "keyLocation": f"{self.base_url}/{self.indexnow_key}.txt", # Standard key verification
            "urlList": urls
        }
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(endpoint, json=payload, timeout=10.0)
                if resp.status_code in [200, 202, 204]:
                    bureau_logger.info(f"INDEXNOW_PUSH_SUCCESS: {len(urls)} URLs pushed [{resp.status_code}].")
                    return True
                else:
                    bureau_logger.error(f"INDEXNOW_PUSH_FAILED: {resp.status_code} - {resp.text}")
                    return False
        except Exception as e:
            bureau_logger.error(f"INDEXNOW_ERROR: {str(e)}")
            return False

    async def ping_sitemaps(self):
        """Forces Google and Bing to re-fetch the sitemap."""
        targets = [
            f"https://www.google.com/ping?sitemap={self.sitemap_url}",
            f"https://www.bing.com/ping?sitemap={self.sitemap_url}"
        ]
        
        async with httpx.AsyncClient() as client:
            tasks = [client.get(url) for url in targets]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            for i, res in enumerate(results):
                if isinstance(res, Exception):
                    bureau_logger.error(f"SITEMAP_PING_FAILED: {targets[i]} - {str(res)}")
                else:
                    bureau_logger.info(f"SITEMAP_PING_SUCCESS: {targets[i]} [{res.status_code}]")
        
        return True

    async def push_all_signals(self, important_urls: list = None):
        """Full Push Sequence: IndexNow + Sitemaps."""
        if not important_urls:
            important_urls = [self.base_url, f"{self.base_url}/about", f"{self.base_url}/landing"]
            
        bureau_logger.info("INITIATING_ACTIVE_SIGNAL_INJECTION_SEQUENCE")
        
        # Parallel execution for speed
        await asyncio.gather(
            self.ping_indexnow(important_urls),
            self.ping_sitemaps()
        )
        
        bureau_logger.info("SIGNAL_INJECTION_SEQUENCE_COMPLETED")
        return {"status": "PUSH_SENT", "count": len(important_urls)}

announcer = AnnouncerService()
