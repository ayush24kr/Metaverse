import asyncio
from typing import List, Optional
from schemas.media import MediaDTO
from services.tmdb import TMDBService
from services.anilist import AniListService
from services.mangadex import MangaDexService
from core.redis import redis_client

class MetadataService:
    @staticmethod
    async def search_media(query: str, media_type: Optional[str] = None) -> List[MediaDTO]:
        if not query or len(query.strip()) == 0:
            return []

        cache_key = f"search_v6:{media_type or 'all'}:{query.lower().strip()}"
        cached = await redis_client.get_json(cache_key)
        if cached:
            return [MediaDTO(**item) for item in cached]

        results = []
        target_type = (media_type or "all").lower()

        # We execute sequentially to prevent DNS resolution ConnectTimeout
        # and socket exhaustion on local Windows development environments.
        
        # 1. TMDb / iTunes for Movies & TV
        if target_type in ["movie", "all"]:
            try:
                res = await TMDBService.search(query, "movie")
                results.extend(res)
            except Exception as e:
                print("Error fetching movies:", e)
                
        if target_type in ["tv", "all"]:
            try:
                res = await TMDBService.search(query, "tv")
                results.extend(res)
            except Exception as e:
                print("Error fetching TV:", e)

        # 2. AniList for Anime & Manga
        if target_type in ["anime", "all"]:
            try:
                res = await AniListService.search(query, "ANIME")
                results.extend(res)
            except Exception as e:
                print("Error fetching anime:", e)
                
        if target_type in ["manga", "manhwa", "manhua", "all"]:
            try:
                res = await AniListService.search(query, "MANGA")
                results.extend(res)
            except Exception as e:
                print("Error fetching manga (AniList):", e)

        # 3. MangaDex for Manga/Manhwa
        if target_type in ["manga", "manhwa", "manhua", "all"]:
            try:
                res = await MangaDexService.search(query)
                results.extend(res)
            except Exception as e:
                print("Error fetching manga (MangaDex):", e)

        # Deduplicate results by type and title
        seen = set()
        unique_results = []
        for r in results:
            key = f"{r.get('type')}-{r.get('title', '').lower()}"
            if key not in seen:
                seen.add(key)
                unique_results.append(r)

        media_dtos = [MediaDTO(**item) for item in unique_results]
        
        if media_dtos:
            await redis_client.set_json(cache_key, [dto.model_dump() for dto in media_dtos], ttl=86400)
            
        return media_dtos
