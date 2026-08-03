# MediaVerse REST API Documentation

All endpoints follow a unified response JSON wrapper:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {}
}
```

## Endpoints Summary

### Media
- `GET /media/search?q={query}&type={movie|tv|anime|manga}`: Unified search across TMDb and AniList.

### Watchlist
- `GET /watchlist`: Retrieve user's watchlist.
- `POST /watchlist`: Add a new title.
- `PATCH /watchlist/{id}`: Update watch status, progress, rating, or notes.
- `DELETE /watchlist/{id}`: Remove item from watchlist.

### Admin Observability
- `GET /admin/health`: System observability, latency, and cache hit metrics.
