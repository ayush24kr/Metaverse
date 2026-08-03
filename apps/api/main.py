import os
from dotenv import load_dotenv

# Load .env variables from workspace root
load_dotenv(dotenv_path="../../.env")
load_dotenv(dotenv_path="../.env")
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes.media import router as media_router
from routes.watchlist import router as watchlist_router
from routes.activity import router as activity_router
from routes.stats import router as stats_router
from routes.admin import router as admin_router
from core.redis import redis_client
from core.db import connect_db, disconnect_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_client.connect()
    await connect_db()
    yield
    await disconnect_db()
    await redis_client.disconnect()

app = FastAPI(
    title="MediaVerse API",
    description="Backend API for MediaVerse",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media_router)
app.include_router(watchlist_router)
app.include_router(activity_router)
app.include_router(stats_router)
app.include_router(admin_router)

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {"success": True, "message": "API is healthy", "data": {}, "meta": {}}
