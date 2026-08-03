import logging
from typing import List, Optional
from fastapi import HTTPException
from core.db import db
from schemas.watchlist import WatchlistItemCreate, WatchlistItemUpdate, WatchlistItemDTO
from workers.stats_worker import EventWorkerService

logger = logging.getLogger(__name__)

class WatchlistService:
    @staticmethod
    async def ensure_user_exists(user_id: str):
        if not db.is_connected():
            return
        try:
            existing = await db.user.find_unique(where={"id": user_id})
            if not existing:
                await db.user.create(
                    data={
                        "id": user_id,
                        "clerkId": user_id,
                        "username": "Ayush",
                    }
                )
        except Exception as e:
            logger.warning(f"User creation warning: {e}")

    @staticmethod
    async def get_user_watchlist(user_id: str) -> List[WatchlistItemDTO]:
        await WatchlistService.ensure_user_exists(user_id)
        items = await db.usermedia.find_many(
            where={"userId": user_id},
            include={"media": True},
            order={"createdAt": "desc"}
        )
        return [
            WatchlistItemDTO(
                id=item.id,
                userId=item.userId,
                mediaId=item.mediaId,
                mediaTitle=item.media.title if item.media else "Unknown Title",
                mediaPoster=item.media.posterPath if item.media else None,
                mediaType=item.media.type if item.media else "movie",
                status=item.status,
                progress=item.progress,
                rating=float(item.rating) if item.rating else None,
                notes=item.notes,
                createdAt=item.createdAt.isoformat()
            )
            for item in items
        ]

    @staticmethod
    async def add_item(user_id: str, item: WatchlistItemCreate) -> WatchlistItemDTO:
        await WatchlistService.ensure_user_exists(user_id)
        
        media_record = await db.media.find_first(
            where={"source": item.source, "externalId": item.externalId}
        )
        if not media_record:
            media_record = await db.media.create(
                data={
                    "source": item.source,
                    "externalId": item.externalId,
                    "type": item.type,
                    "title": item.title,
                    "posterPath": item.posterPath,
                    "rating": item.rating,
                }
            )

        user_media = await db.usermedia.find_first(
            where={"userId": user_id, "mediaId": media_record.id}
        )
        if not user_media:
            user_media = await db.usermedia.create(
                data={
                    "userId": user_id,
                    "mediaId": media_record.id,
                    "status": item.status,
                    "progress": item.progress,
                    "rating": item.rating,
                    "notes": item.notes,
                }
            )

        await db.activity.create(
            data={
                "userId": user_id,
                "type": "ADDED_TO_WATCHLIST",
                "mediaId": media_record.id,
                "details": f"Added {item.title} to watchlist as {item.status}"
            }
        )

        await EventWorkerService.emit_activity(
            user_id=user_id,
            action_type="ADDED_TO_WATCHLIST",
            media_title=item.title
        )

        return WatchlistItemDTO(
            id=user_media.id,
            userId=user_id,
            mediaId=media_record.id,
            mediaTitle=media_record.title,
            mediaPoster=media_record.posterPath,
            mediaType=media_record.type,
            status=user_media.status,
            progress=user_media.progress,
            rating=float(user_media.rating) if user_media.rating else None,
            notes=user_media.notes,
            createdAt=user_media.createdAt.isoformat()
        )

    @staticmethod
    async def update_item(user_id: str, item_id: str, update_data: WatchlistItemUpdate) -> WatchlistItemDTO:
        target = await db.usermedia.find_unique(
            where={"id": item_id},
            include={"media": True}
        )
        if not target or target.userId != user_id:
            raise HTTPException(status_code=404, detail="Watchlist item not found")

        data_to_update = {}
        if update_data.status is not None:
            data_to_update["status"] = update_data.status
        if update_data.progress is not None:
            data_to_update["progress"] = update_data.progress
        if update_data.rating is not None:
            data_to_update["rating"] = update_data.rating
        if update_data.notes is not None:
            data_to_update["notes"] = update_data.notes

        updated = await db.usermedia.update(
            where={"id": item_id},
            data=data_to_update,
            include={"media": True}
        )

        await db.activity.create(
            data={
                "userId": user_id,
                "type": "COMPLETED" if updated.status == "COMPLETED" else "STARTED",
                "mediaId": updated.mediaId,
                "details": f"Updated progress to {updated.progress}"
            }
        )

        return WatchlistItemDTO(
            id=updated.id,
            userId=updated.userId,
            mediaId=updated.mediaId,
            mediaTitle=updated.media.title if updated.media else "Unknown Title",
            mediaPoster=updated.media.posterPath if updated.media else None,
            mediaType=updated.media.type if updated.media else "movie",
            status=updated.status,
            progress=updated.progress,
            rating=float(updated.rating) if updated.rating else None,
            notes=updated.notes,
            createdAt=updated.createdAt.isoformat()
        )

    @staticmethod
    async def delete_item(user_id: str, item_id: str):
        target = await db.usermedia.find_unique(where={"id": item_id})
        if not target or target.userId != user_id:
            raise HTTPException(status_code=404, detail="Watchlist item not found")

        await db.usermedia.delete(where={"id": item_id})
        return {"id": item_id}
