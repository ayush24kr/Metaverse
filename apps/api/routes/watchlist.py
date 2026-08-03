from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import uuid4
from datetime import datetime
from core.response import UnifiedResponse
from core.auth import verify_user
from core.db import db
from schemas.watchlist import WatchlistItemCreate, WatchlistItemUpdate, WatchlistItemDTO
from workers.stats_worker import EventWorkerService

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

IN_MEMORY_DB: List[dict] = []

async def ensure_user_exists(user_id: str):
    if db.is_connected():
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
            print("User creation notice:", e)

@router.get("", response_model=UnifiedResponse[List[WatchlistItemDTO]])
async def get_watchlist(user: dict = Depends(verify_user)):
    user_id = user["user_id"]
    if db.is_connected():
        try:
            await ensure_user_exists(user_id)
            items = await db.usermedia.find_many(
                where={"userId": user_id},
                include={"media": True},
                order={"createdAt": "desc"}
            )
            dtos = [
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
            return UnifiedResponse(success=True, message="Watchlist retrieved from PostgreSQL", data=dtos)
        except Exception as e:
            print("PostgreSQL fetch error, falling back:", e)

    user_items = [WatchlistItemDTO(**item) for item in IN_MEMORY_DB if item["userId"] == user_id]
    return UnifiedResponse(success=True, message="Watchlist retrieved", data=user_items)

@router.post("", response_model=UnifiedResponse[WatchlistItemDTO])
async def add_to_watchlist(item: WatchlistItemCreate, user: dict = Depends(verify_user)):
    user_id = user["user_id"]
    if db.is_connected():
        try:
            await ensure_user_exists(user_id)
            
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

            dto = WatchlistItemDTO(
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
            return UnifiedResponse(success=True, message="Item saved to PostgreSQL watchlist", data=dto)
        except Exception as e:
            print("PostgreSQL save error, falling back:", e)

    new_item = {
        "id": str(uuid4()),
        "userId": user_id,
        "mediaId": item.mediaId,
        "mediaTitle": item.title,
        "mediaPoster": item.posterPath,
        "mediaType": item.type,
        "status": item.status,
        "progress": item.progress,
        "rating": item.rating,
        "notes": item.notes,
        "createdAt": datetime.utcnow().isoformat()
    }
    IN_MEMORY_DB.append(new_item)
    return UnifiedResponse(success=True, message="Item added to watchlist", data=WatchlistItemDTO(**new_item))

@router.patch("/{item_id}", response_model=UnifiedResponse[WatchlistItemDTO])
async def update_watchlist_item(item_id: str, update_data: WatchlistItemUpdate, user: dict = Depends(verify_user)):
    user_id = user["user_id"]
    if db.is_connected():
        try:
            target = await db.usermedia.find_unique(
                where={"id": item_id},
                include={"media": True}
            )
            if target and target.userId == user_id:
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

                dto = WatchlistItemDTO(
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
                return UnifiedResponse(success=True, message="Watchlist updated in PostgreSQL", data=dto)
        except Exception as e:
            print("PostgreSQL update error, falling back:", e)

    target_mem = next((i for i in IN_MEMORY_DB if i["id"] == item_id and i["userId"] == user_id), None)
    if not target_mem:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    if update_data.status is not None:
        target_mem["status"] = update_data.status
    if update_data.progress is not None:
        target_mem["progress"] = update_data.progress
    if update_data.rating is not None:
        target_mem["rating"] = update_data.rating
    if update_data.notes is not None:
        target_mem["notes"] = update_data.notes

    return UnifiedResponse(success=True, message="Watchlist item updated", data=WatchlistItemDTO(**target_mem))

@router.delete("/{item_id}", response_model=UnifiedResponse[dict])
async def delete_watchlist_item(item_id: str, user: dict = Depends(verify_user)):
    user_id = user["user_id"]
    if db.is_connected():
        try:
            target = await db.usermedia.find_unique(where={"id": item_id})
            if target and target.userId == user_id:
                await db.usermedia.delete(where={"id": item_id})
                return UnifiedResponse(success=True, message="Item removed from PostgreSQL DB", data={"id": item_id})
        except Exception as e:
            print("PostgreSQL delete error, falling back:", e)

    global IN_MEMORY_DB
    IN_MEMORY_DB = [i for i in IN_MEMORY_DB if not (i["id"] == item_id and i["userId"] == user_id)]
    return UnifiedResponse(success=True, message="Item removed from watchlist", data={"id": item_id})
