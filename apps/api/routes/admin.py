import time
from fastapi import APIRouter
from core.response import UnifiedResponse
from core.redis import redis_client
from core.db import db
from workers.stats_worker import ACTIVITY_QUEUE_KEY

router = APIRouter(prefix="/admin", tags=["Admin Observability"])

@router.get("/health", response_model=UnifiedResponse[dict])
async def admin_health():
    start_time = time.time()
    
    # Real DB Status
    db_connected = db.is_connected()
    
    # Real Redis Status & Queue Length
    redis_connected = redis_client.client is not None
    queue_len = 0
    if redis_connected:
        try:
            queue_len = await redis_client.client.llen(ACTIVITY_QUEUE_KEY)
        except Exception:
            queue_len = 0

    latency_ms = round((time.time() - start_time) * 1000, 2)

    return UnifiedResponse(
        success=True,
        message="System observability health metrics",
        data={
            "status": "healthy" if db_connected else "degraded",
            "database": "connected" if db_connected else "disconnected",
            "redis": "connected" if redis_connected else "disconnected",
            "queueLength": queue_len,
            "avgLatencyMs": latency_ms,
        }
    )
