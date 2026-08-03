import os
import json
from typing import Optional, Any
from upstash_redis.asyncio import Redis

UPSTASH_REDIS_REST_URL = os.getenv("UPSTASH_REDIS_REST_URL", "")
UPSTASH_REDIS_REST_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")

class RedisClient:
    def __init__(self):
        self.client: Optional[Redis] = None

    async def connect(self):
        if UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN:
            self.client = Redis(url=UPSTASH_REDIS_REST_URL, token=UPSTASH_REDIS_REST_TOKEN)
        else:
            self.client = None

    async def disconnect(self):
        # upstash_redis REST client doesn't hold an active socket connection
        pass

    async def get_json(self, key: str) -> Optional[Any]:
        if not self.client:
            return None
        try:
            data = await self.client.get(key)
            if data is None:
                return None
            return json.loads(data) if isinstance(data, str) else data
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    async def set_json(self, key: str, value: Any, ttl: int = 86400) -> bool:
        if not self.client:
            return False
        try:
            await self.client.set(key, json.dumps(value), ex=ttl)
            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False

redis_client = RedisClient()
