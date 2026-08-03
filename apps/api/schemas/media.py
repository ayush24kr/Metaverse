from pydantic import BaseModel
from typing import Optional, List

class MediaDTO(BaseModel):
    id: str
    source: str          # "tmdb", "anilist"
    externalId: str
    type: str            # "movie", "tv", "anime", "manga", "manhwa"
    title: str
    titleEnglish: Optional[str] = None
    titleRomaji: Optional[str] = None
    titleNative: Optional[str] = None
    description: Optional[str] = None
    posterPath: Optional[str] = None
    bannerPath: Optional[str] = None
    coverPath: Optional[str] = None
    releaseYear: Optional[int] = None
    duration: Optional[int] = None
    episodes: Optional[int] = None
    chapters: Optional[int] = None
    volumes: Optional[int] = None
    status: Optional[str] = None
    popularity: Optional[float] = None
    rating: Optional[float] = None
    genres: List[str] = []
    studios: List[str] = []

class SearchResponseDTO(BaseModel):
    items: List[MediaDTO]
    total: int
    page: int
