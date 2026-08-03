# MediaVerse System Architecture

```text
               User Interface (Browser / Mobile / PWA)
                                │
                        Next.js 14 App Router
                        (React, Tailwind, Clerk)
                                │
                      Unified REST API Client
                                │
                        FastAPI Service Layer
                   (Python, Async Uvicorn Worker)
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
 PostgreSQL (Primary DB)    Redis (24h TTL)    Event Queue (Activity)
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                                │
                     External Metadata Layer
                      (TMDb API & AniList GraphQL)
```

## Core Design Principles
1. **Event-Driven Architecture**: User actions emit events to an asynchronous Redis queue for decoupled worker execution.
2. **Metadata Abstraction**: Frontend interacts only with `MediaDTO`, shielding it from third-party vendor variations.
3. **Observability**: Metrics tracked per request including latency, hit rates, and error frequencies.
