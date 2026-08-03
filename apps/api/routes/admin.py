import time
from fastapi import APIRouter
from core.response import UnifiedResponse
from core.redis import redis_client
from core.db import db
from workers.stats_worker import ACTIVITY_QUEUE_KEY

router = APIRouter(prefix="/admin", tags=["Admin Observability"])

APP_START_TIME = time.time()

@router.get("/health", response_model=UnifiedResponse[dict])
async def admin_health():
    start_time = time.time()
    
    # Real DB Status & Counts
    db_connected = db.is_connected()
    total_users = 0
    total_media = 0
    total_activities = 0
    if db_connected:
        try:
            total_users = await db.user.count()
            total_media = await db.media.count()
            total_activities = await db.activity.count()
        except Exception:
            pass

    # Real Redis Status & Queue Length
    redis_connected = redis_client.client is not None
    queue_len = 0
    if redis_connected:
        try:
            queue_len = await redis_client.client.llen(ACTIVITY_QUEUE_KEY)
        except Exception:
            queue_len = 0

    latency_ms = round((time.time() - start_time) * 1000, 2)
    uptime_seconds = round(time.time() - APP_START_TIME, 1)

    return UnifiedResponse(
        success=True,
        message="System observability health metrics",
        data={
            "status": "healthy" if db_connected else "degraded",
            "database": "connected" if db_connected else "disconnected",
            "redis": "connected" if redis_connected else "disconnected",
            "queueLength": queue_len,
            "totalUsers": total_users,
            "totalMediaTracked": total_media,
            "totalActivityLogged": total_activities,
            "latencyMs": latency_ms,
            "uptimeSeconds": uptime_seconds,
        }
    )
