import json
import logging
import asyncio
from core.redis import redis_client
from core.db import db

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
    async def update_user_stats(user_id: str):
        if not db.is_connected():
            return
        try:
            items = await db.usermedia.find_many(where={"userId": user_id}, include={"media": True})
            completed = len([i for i in items if i.status == "COMPLETED"])
            watching = len([i for i in items if i.status == "WATCHING"])
            ratings = [float(i.rating) for i in items if i.rating is not None]
            avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0
            
            total_duration_mins = sum((i.media.duration or 0) for i in items if i.media and i.status == "COMPLETED")
            total_hours = round(total_duration_mins / 60.0, 1) if total_duration_mins > 0 else round(completed * 2.5, 1)

            existing = await db.userstats.find_unique(where={"userId": user_id})
            if existing:
                await db.userstats.update(
                    where={"userId": user_id},
                    data={
                        "completed": completed,
                        "watching": watching,
                        "hours": total_hours,
                        "averageRating": avg_rating
                    }
                )
            else:
                await db.userstats.create(
                    data={
                        "userId": user_id,
                        "completed": completed,
                        "watching": watching,
                        "hours": total_hours,
                        "averageRating": avg_rating
                    }
                )
            logger.info(f"[Worker] Updated UserStats for user {user_id}: {completed} completed, {total_hours}h")
        except Exception as e:
            logger.warning(f"Failed to update UserStats for user {user_id}: {e}")

    @staticmethod
    async def process_activity_queue():
        """Background loop that pops activity events from Redis queue and updates durable UserStats."""
        logger.info("Starting Redis activity event worker consumer...")
        while True:
            try:
                if redis_client.client:
                    raw_event = await redis_client.client.lpop(ACTIVITY_QUEUE_KEY)
                    if raw_event:
                        event_data = json.loads(raw_event)
                        user_id = event_data.get("userId")
                        if user_id:
                            await EventWorkerService.update_user_stats(user_id)
                await asyncio.sleep(2)
            except asyncio.CancelledError:
                logger.info("Activity worker process shutting down...")
                break
            except Exception as e:
                logger.warning(f"Error in activity queue worker: {e}")
                await asyncio.sleep(5)
