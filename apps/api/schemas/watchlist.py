from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class WatchlistItemCreate(BaseModel):
    mediaId: str
    source: str
    externalId: str
    type: str
    title: str
    posterPath: Optional[str] = None
    status: str = "WATCHING"
    progress: int = 0
    rating: Optional[float] = None
    notes: Optional[str] = None

class WatchlistItemUpdate(BaseModel):
    status: Optional[str] = None
    progress: Optional[int] = None
    rating: Optional[float] = None
    notes: Optional[str] = None

class WatchlistItemDTO(BaseModel):
    id: str
    userId: str
    mediaId: str
    mediaTitle: str
    mediaPoster: Optional[str] = None
    mediaType: str
    status: str
    progress: int
    rating: Optional[float] = None
    notes: Optional[str] = None
    createdAt: str
