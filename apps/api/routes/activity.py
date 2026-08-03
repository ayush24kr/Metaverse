from fastapi import APIRouter, Depends, HTTPException
from typing import List
import logging
from core.response import UnifiedResponse
from core.auth import verify_user
from core.db import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/activity", tags=["Activity"])

@router.get("", response_model=UnifiedResponse[List[dict]])
async def get_activities(user: dict = Depends(verify_user)):
    try:
        if db.is_connected():
            activities = await db.activity.find_many(
                where={"userId": user["user_id"]},
                order={"createdAt": "desc"},
                take=20,
                include={"media": True}
            )
            data = [
                {
                    "id": a.id,
                    "type": a.type,
                    "mediaTitle": a.media.title if a.media else "Unknown Title",
                    "mediaPoster": a.media.posterPath if a.media else None,
                    "details": a.details,
                    "createdAt": a.createdAt.isoformat()
                }
                for a in activities
            ]
            return UnifiedResponse(success=True, message="Activity log retrieved", data=data)
        return UnifiedResponse(success=True, message="Database not connected", data=[])
    except Exception as e:
        logger.error(f"Activity fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch activity log")
