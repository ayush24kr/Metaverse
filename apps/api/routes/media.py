from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from core.response import UnifiedResponse
from schemas.media import SearchResponseDTO, MediaDTO
from services.metadata import MetadataService

router = APIRouter(prefix="/media", tags=["Media"])

@router.get("/search", response_model=UnifiedResponse[SearchResponseDTO])
async def search_media(
    q: str = Query(..., min_length=1, description="Search query"),
    type: Optional[str] = Query(None, description="Media filter: movie, tv, anime, manga")
):
    try:
        items = await MetadataService.search_media(q, type)
        return UnifiedResponse(
            success=True,
            message="Media search successful",
            data=SearchResponseDTO(items=items, total=len(items), page=1)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
