from fastapi import APIRouter, Depends, HTTPException
import logging
from core.response import UnifiedResponse
from core.auth import verify_user
from core.db import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.get("", response_model=UnifiedResponse[dict])
async def get_user_stats(user: dict = Depends(verify_user)):
    try:
        if db.is_connected():
            items = await db.usermedia.find_many(
                where={"userId": user["user_id"]},
                include={"media": True}
            )
            
            watching = [i for i in items if i.status == "WATCHING"]
            completed = [i for i in items if i.status == "COMPLETED"]
            dropped = [i for i in items if i.status == "DROPPED"]
            plan_to_watch = [i for i in items if i.status == "PLAN_TO_WATCH"]

            total_hours = len(completed) * 2.5 + len(watching) * 1.2
            
            ratings = [float(i.rating) for i in items if i.rating is not None]
            avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0

            return UnifiedResponse(
                success=True,
                message="User statistics calculated from database",
                data={
                    "watching": len(watching),
                    "completed": len(completed),
                    "dropped": len(dropped),
                    "planToWatch": len(plan_to_watch),
                    "totalHours": round(total_hours, 1),
                    "averageRating": avg_rating,
                    "totalTracked": len(items),
                    "streakDays": 1 if items else 0
                }
            )
    except Exception as e:
        logger.error(f"Stats calculation error: {e}")

    return UnifiedResponse(
        success=True,
        message="Default user statistics",
        data={
            "watching": 0,
            "completed": 0,
            "dropped": 0,
            "planToWatch": 0,
            "totalHours": 0.0,
            "averageRating": 0.0,
            "totalTracked": 0,
            "streakDays": 0
        }
    )

@router.get("/detailed", response_model=UnifiedResponse[dict])
async def get_detailed_user_stats(user: dict = Depends(verify_user)):
    user_id = user["user_id"]
    try:
        if db.is_connected():
            items = await db.usermedia.find_many(
                where={"userId": user_id},
                include={"media": True}
            )
            activities = await db.activity.find_many(
                where={"userId": user_id},
                order={"createdAt": "desc"},
                take=100
            )

            # Status distribution
            status_dist: dict[str, int] = {}
            # Type distribution
            type_dist: dict[str, int] = {}
            # Rating distribution
            rating_dist: dict[str, int] = {"0-2": 0, "2-4": 0, "4-6": 0, "6-8": 0, "8-10": 0}
            
            ratings: list[float] = []
            total_duration_mins = 0

            for item in items:
                # Status
                status_dist[item.status] = status_dist.get(item.status, 0) + 1
                
                # Type
                media_type = (item.media.type if item.media else "movie").upper()
                type_dist[media_type] = type_dist.get(media_type, 0) + 1
                
                # Rating
                if item.rating is not None:
                    val = float(item.rating)
                    ratings.append(val)
                    if val <= 2:
                        rating_dist["0-2"] += 1
                    elif val <= 4:
                        rating_dist["2-4"] += 1
                    elif val <= 6:
                        rating_dist["4-6"] += 1
                    elif val <= 8:
                        rating_dist["6-8"] += 1
                    else:
                        rating_dist["8-10"] += 1

                # Duration
                if item.media and item.media.duration:
                    total_duration_mins += item.media.duration

            completed_count = status_dist.get("COMPLETED", 0)
            total_count = len(items)
            completion_rate = round((completed_count / total_count * 100), 1) if total_count > 0 else 0.0
            avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0
            total_hours = round(total_duration_mins / 60.0, 1) if total_duration_mins > 0 else round(completed_count * 2.5, 1)

            # Monthly timeline from activities
            monthly_map: dict[str, int] = {}
            for act in activities:
                month_key = act.createdAt.strftime("%b %Y")
                monthly_map[month_key] = monthly_map.get(month_key, 0) + 1

            monthly_activity = [{"month": k, "events": v} for k, v in list(monthly_map.items())[:6]]

            return UnifiedResponse(
                success=True,
                message="Detailed analytics computed from PostgreSQL",
                data={
                    "statusDistribution": status_dist,
                    "typeDistribution": type_dist,
                    "ratingDistribution": rating_dist,
                    "monthlyActivity": monthly_activity,
                    "completionRate": completion_rate,
                    "averageRating": avg_rating,
                    "totalHours": total_hours,
                    "totalTracked": total_count,
                    "completedCount": completed_count,
                    "streakDays": min(len(activities), 7)
                }
            )
    except Exception as e:
        logger.error(f"Detailed stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate detailed stats")

    return UnifiedResponse(
        success=True,
        message="Empty detailed statistics",
        data={
            "statusDistribution": {},
            "typeDistribution": {},
            "ratingDistribution": {},
            "monthlyActivity": [],
            "completionRate": 0.0,
            "averageRating": 0.0,
            "totalHours": 0.0,
            "totalTracked": 0,
            "completedCount": 0,
            "streakDays": 0
        }
    )
