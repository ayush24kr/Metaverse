# MediaVerse Database Schema

Database Engine: **PostgreSQL 15**
ORM: **Prisma**

## Primary Models

### `User`
Tracks authenticated user identity synced from Clerk, preferences, and timezone settings.

### `Media`
Normalized metadata cache for movies, TV shows, anime, and manga. Includes fields like `slug`, `searchKeywords`, `posterPath`, `releaseYear`, and ratings.

### `UserMedia`
Represents user watchlist entries. Contains `status` (WATCHING, COMPLETED, etc.), `progress` (episodes/chapters), `rating` (0.0 to 10.0), `favorite`, and `notes`.

### `Activity`
Event source of truth. Every status change, progress increment, or rating update generates an `Activity` record.
