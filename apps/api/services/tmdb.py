import os
import httpx
from typing import List, Dict, Any

TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
ITUNES_BASE_URL = "https://itunes.apple.com/search"

class TMDBService:
    @staticmethod
    async def search(query: str, media_type: str = "movie") -> List[Dict[str, Any]]:
        api_key = TMDB_API_KEY
        endpoint = f"{TMDB_BASE_URL}/search/{media_type}"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    endpoint,
                    params={
                        "api_key": api_key,
                        "query": query,
                        "include_adult": False,
                        "language": "en-US",
                        "page": 1
                    }
                )
                if res.status_code == 200:
                    results = res.json().get("results", [])
                    results = sorted(
                        results, 
                        key=lambda x: (x.get("popularity") or 0.0, x.get("vote_count") or 0), 
                        reverse=True
                    )
                    
                    normalized = []
                    for item in results[:15]:
                        title = item.get("title") or item.get("name")
                        if not title:
                            continue
                        poster = f"https://image.tmdb.org/t/p/w500{item.get('poster_path')}" if item.get('poster_path') else None
                        backdrop = f"https://image.tmdb.org/t/p/original{item.get('backdrop_path')}" if item.get('backdrop_path') else None
                        rel_date = item.get("release_date") or item.get("first_air_date")
                        year = int(rel_date[:4]) if rel_date and len(rel_date) >= 4 else None
                        
                        normalized.append({
                            "id": str(item.get("id")),
                            "source": "tmdb",
                            "externalId": str(item.get("id")),
                            "type": media_type,
                            "title": title,
                            "description": item.get("overview"),
                            "posterPath": poster,
                            "bannerPath": backdrop,
                            "releaseYear": year,
                            "rating": float(item.get("vote_average") or 0.0),
                            "popularity": float(item.get("popularity") or 0.0),
                            "genres": []
                        })
                    return normalized
        except (httpx.ConnectError, httpx.ConnectTimeout):
            # Suppress noisy connect errors when TMDb is blocked by ISP or DNS fails
            pass
        except Exception as e:
            print(f"TMDb API query error: {repr(e)}")

        # Fallback to iTunes Search API if TMDb fails
        entity = "movie" if media_type == "movie" else "tvShow"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(ITUNES_BASE_URL, params={"term": query, "entity": entity, "limit": 15})
                if res.status_code == 200:
                    items = res.json().get("results", [])
                    normalized = []
                    for item in items:
                        title = item.get("trackName") or item.get("artistName") or item.get("collectionName")
                        if not title:
                            continue
                        artwork = item.get("artworkUrl100")
                        poster = artwork.replace("100x100bb", "600x600bb") if artwork else None
                        rel_date = item.get("releaseDate")
                        year = int(rel_date[:4]) if rel_date and len(rel_date) >= 4 else None
                        genre = item.get("primaryGenreName")
                        
                        normalized.append({
                            "id": str(item.get("trackId") or item.get("collectionId")),
                            "source": "itunes",
                            "externalId": str(item.get("trackId") or item.get("collectionId")),
                            "type": media_type,
                            "title": title,
                            "description": item.get("longDescription") or item.get("shortDescription"),
                            "posterPath": poster,
                            "releaseYear": year,
                            "rating": 8.0,
                            "popularity": 85.0,
                            "genres": [genre] if genre else []
                        })
                    return normalized
        except Exception:
            pass

        return []
