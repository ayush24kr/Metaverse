import httpx
from typing import List, Dict, Any

MANGADEX_BASE_URL = "https://api.mangadex.org"

class MangaDexService:
    @staticmethod
    async def search(query: str) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(
                    f"{MANGADEX_BASE_URL}/manga",
                    params={"title": query, "limit": 10, "includes[]": ["cover_art"]}
                )
                if res.status_code != 200:
                    return []
                data = res.json().get("data", [])
                
                normalized = []
                for item in data:
                    attrs = item.get("attributes", {})
                    title_dict = attrs.get("title", {})
                    title = title_dict.get("en") or title_dict.get("ja") or (next(iter(title_dict.values())) if title_dict else "Unknown")
                    
                    cover_filename = None
                    for rel in item.get("relationships", []):
                        if rel.get("type") == "cover_art" and rel.get("attributes"):
                            cover_filename = rel["attributes"].get("fileName")
                    
                    manga_id = item.get("id")
                    poster = f"https://uploads.mangadex.org/covers/{manga_id}/{cover_filename}" if cover_filename else None
                    desc_dict = attrs.get("description", {})
                    description = desc_dict.get("en") or (next(iter(desc_dict.values())) if desc_dict else "")
                    year = attrs.get("year")
                    
                    normalized.append({
                        "id": manga_id,
                        "source": "mangadex",
                        "externalId": manga_id,
                        "type": "manga",
                        "title": title,
                        "description": description,
                        "posterPath": poster,
                        "releaseYear": year,
                        "rating": 8.5,
                        "popularity": 90.0,
                        "genres": []
                    })
                return normalized
        except Exception as e:
            print("MangaDex API search error:", e)
            return []
