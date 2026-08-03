import httpx
from typing import List, Dict, Any, Optional

ANILIST_URL = "https://graphql.anilist.co"
JIKAN_BASE_URL = "https://api.jikan.moe/v4"

ANILIST_SEARCH_QUERY = """
query ($search: String, $type: MediaType) {
  Page (page: 1, perPage: 10) {
    media (search: $search, type: $type) {
      id
      type
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        large
      }
      bannerImage
      startDate {
        year
      }
      episodes
      chapters
      volumes
      status
      meanScore
      popularity
      genres
    }
  }
}
"""

ANILIST_DETAILS_QUERY = """
query ($id: Int) {
  Media (id: $id) {
    id
    type
    title {
      romaji
      english
      native
    }
    description
    coverImage {
      large
    }
    bannerImage
    startDate {
      year
    }
    episodes
    chapters
    status
    meanScore
    popularity
    genres
  }
}
"""

class AniListService:
    @staticmethod
    async def search(query: str, media_type: str = "ANIME") -> List[Dict[str, Any]]:
        media_enum = "ANIME" if media_type.upper() == "ANIME" else "MANGA"
        
        # 1. AniList GraphQL Search
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(
                    ANILIST_URL,
                    json={"query": ANILIST_SEARCH_QUERY, "variables": {"search": query, "type": media_enum}},
                    headers={"Content-Type": "application/json", "Accept": "application/json"}
                )
                if res.status_code == 200:
                    media_list = res.json().get("data", {}).get("Page", {}).get("media", [])
                    if media_list:
                        normalized = []
                        for item in media_list:
                            titles = item.get("title", {})
                            title = titles.get("english") or titles.get("romaji") or titles.get("native") or "Unknown"
                            poster = item.get("coverImage", {}).get("large")
                            normalized.append({
                                "id": str(item.get("id")),
                                "source": "anilist",
                                "externalId": str(item.get("id")),
                                "type": item.get("type", "").lower(),
                                "title": title,
                                "titleEnglish": titles.get("english"),
                                "titleRomaji": titles.get("romaji"),
                                "description": item.get("description"),
                                "posterPath": poster,
                                "bannerPath": item.get("bannerImage"),
                                "releaseYear": item.get("startDate", {}).get("year"),
                                "episodes": item.get("episodes"),
                                "chapters": item.get("chapters"),
                                "rating": float(item.get("meanScore", 0)) / 10.0 if item.get("meanScore") else None,
                                "popularity": float(item.get("popularity", 0.0)),
                                "genres": item.get("genres", [])
                            })
                        return normalized
        except Exception as e:
            print("AniList search error:", e)

        # 2. Fallback to Jikan v4 API
        try:
            endpoint = f"{JIKAN_BASE_URL}/{media_enum.lower()}?q={query}&limit=10"
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(endpoint)
                if res.status_code == 200:
                    items = res.json().get("data", [])
                    normalized = []
                    for item in items:
                        title = item.get("title_english") or item.get("title") or "Unknown"
                        images = item.get("images", {}).get("jpg", {})
                        poster = images.get("large_image_url") or images.get("image_url")
                        normalized.append({
                            "id": str(item.get("mal_id")),
                            "source": "jikan",
                            "externalId": str(item.get("mal_id")),
                            "type": media_enum.lower(),
                            "title": title,
                            "description": item.get("synopsis"),
                            "posterPath": poster,
                            "releaseYear": item.get("year"),
                            "episodes": item.get("episodes"),
                            "chapters": item.get("chapters"),
                            "rating": float(item.get("score", 0)) if item.get("score") else None,
                            "genres": [g.get("name") for g in item.get("genres", []) if g.get("name")]
                        })
                    return normalized
        except Exception as e:
            print("Jikan search error:", e)

        return []

    @staticmethod
    async def get_by_id(anilist_id: int) -> Optional[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(
                    ANILIST_URL,
                    json={"query": ANILIST_DETAILS_QUERY, "variables": {"id": anilist_id}},
                    headers={"Content-Type": "application/json", "Accept": "application/json"}
                )
                if res.status_code == 200:
                    item = res.json().get("data", {}).get("Media")
                    if item:
                        titles = item.get("title", {})
                        return {
                            "id": str(item.get("id")),
                            "source": "anilist",
                            "externalId": str(item.get("id")),
                            "type": item.get("type", "").lower(),
                            "title": titles.get("english") or titles.get("romaji") or titles.get("native") or "Unknown",
                            "description": item.get("description"),
                            "posterPath": item.get("coverImage", {}).get("large"),
                            "bannerPath": item.get("bannerImage"),
                            "releaseYear": item.get("startDate", {}).get("year"),
                            "episodes": item.get("episodes"),
                            "chapters": item.get("chapters"),
                            "rating": float(item.get("meanScore", 0)) / 10.0 if item.get("meanScore") else None,
                            "genres": item.get("genres", [])
                        }
        except Exception as e:
            print("AniList get_by_id error:", e)
        return None
