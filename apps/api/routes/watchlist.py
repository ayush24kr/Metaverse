from fastapi import APIRouter, Depends, HTTPException
from typing import List
import logging
from core.response import UnifiedResponse
from core.auth import verify_user
from schemas.watchlist import WatchlistItemCreate, WatchlistItemUpdate, WatchlistItemDTO
from services.watchlist_service import WatchlistService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("", response_model=UnifiedResponse[List[WatchlistItemDTO]])
async def get_watchlist(user: dict = Depends(verify_user)):
    try:
        user_id = user["user_id"]
        dtos = await WatchlistService.get_user_watchlist(user_id)
        return UnifiedResponse(success=True, message="Watchlist retrieved", data=dtos)
    except Exception as e:
        logger.error(f"Error fetching watchlist: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch watchlist")

@router.post("", response_model=UnifiedResponse[WatchlistItemDTO])
async def add_to_watchlist(item: WatchlistItemCreate, user: dict = Depends(verify_user)):
    try:
        user_id = user["user_id"]
        dto = await WatchlistService.add_item(user_id, item)
        return UnifiedResponse(success=True, message="Item added to watchlist", data=dto)
    except Exception as e:
        logger.error(f"Error adding to watchlist: {e}")
        raise HTTPException(status_code=500, detail="Failed to add item to watchlist")

@router.patch("/{item_id}", response_model=UnifiedResponse[WatchlistItemDTO])
async def update_watchlist_item(item_id: str, update_data: WatchlistItemUpdate, user: dict = Depends(verify_user)):
    try:
        user_id = user["user_id"]
        dto = await WatchlistService.update_item(user_id, item_id, update_data)
        return UnifiedResponse(success=True, message="Watchlist item updated", data=dto)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating watchlist item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update watchlist item")

@router.delete("/{item_id}", response_model=UnifiedResponse[dict])
async def delete_watchlist_item(item_id: str, user: dict = Depends(verify_user)):
    try:
        user_id = user["user_id"]
        result = await WatchlistService.delete_item(user_id, item_id)
        return UnifiedResponse(success=True, message="Item removed from watchlist", data=result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting watchlist item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete watchlist item")
