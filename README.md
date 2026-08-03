# MediaVerse 🎬📚

[![CI](https://github.com/mediaverse/mediaverse/actions/workflows/ci.yml/badge.svg)](https://github.com/mediaverse/mediaverse/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)

**MediaVerse** is a production-grade full-stack entertainment tracking platform for Movies, TV Shows, Anime, Manga, Manhwa, and Web Series. Built with a scalable **Next.js 14 + FastAPI** architecture, PostgreSQL, Redis caching, event-driven background processing, and complete observability.

---

## 🌟 Architecture & Tech Stack

```text
               User Interface (Browser / Mobile / PWA)
                                │
                        Next.js 14 App Router
                        (React, Tailwind, Clerk)
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

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Clerk Auth
- **Backend**: FastAPI (Python), Pytest, Pydantic v2
- **Database & Cache**: PostgreSQL, Prisma ORM, Redis (24h TTL)
- **DevOps & CI/CD**: Docker, Docker Compose, GitHub Actions

---

## 🚀 Quick Local Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/your-username/mediaverse.git
   cd mediaverse
   npm install
   ```

2. **Start Infrastructure (PostgreSQL & Redis)**
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

3. **Start FastAPI Backend**
   ```bash
   cd apps/api
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Start Next.js Frontend**
   ```bash
   npm run dev --workspace=apps/web
   ```

Visit `http://localhost:3000` for Web Dashboard and `http://localhost:8000/docs` for FastAPI Swagger Docs.

---

## 📚 Documentation
- [Architecture Overview](docs/Architecture.md)
- [Database Schema](docs/Database.md)
- [API Specification](docs/API.md)
- [Architecture Decision Records (ADRs)](docs/adr/0001-architecture-stack.md)
