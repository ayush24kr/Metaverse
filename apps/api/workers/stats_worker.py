import json
import logging
import asyncio
from core.redis import redis_client

logger = logging.getLogger(__name__)
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
            try:
                await redis_client.client.rpush(ACTIVITY_QUEUE_KEY, json.dumps(event))
            except Exception as e:
                logger.warning(f"Failed to push activity event to Redis: {e}")

    @staticmethod
    async def process_activity_queue():
        """Background loop that pops activity events from Redis queue and logs/processes them."""
        logger.info("Starting Redis activity event worker process...")
        while True:
            try:
                if redis_client.client:
                    raw_event = await redis_client.client.lpop(ACTIVITY_QUEUE_KEY)
                    if raw_event:
                        event_data = json.loads(raw_event)
                        logger.info(f"[Worker] Processed event: {event_data.get('type')} for media '{event_data.get('mediaTitle')}'")
                await asyncio.sleep(2)
            except asyncio.CancelledError:
                logger.info("Activity worker process shutting down...")
                break
            except Exception as e:
                logger.warning(f"Error in activity queue worker: {e}")
                await asyncio.sleep(5)
