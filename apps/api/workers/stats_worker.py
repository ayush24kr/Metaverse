import json
from core.redis import redis_client

ACTIVITY_QUEUE_KEY = "queue:activity"

class EventWorkerService:
    @staticmethod
    async def emit_activity(user_id: str, action_type: str, media_title: str, details: str = ""):
        event = {
            "userId": user_id,
            "type": action_type,
            "mediaTitle": media_title,
            "details": details
        }
        if redis_client.client:
            await redis_client.client.rpush(ACTIVITY_QUEUE_KEY, json.dumps(event))
