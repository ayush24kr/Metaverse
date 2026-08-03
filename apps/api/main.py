import os
import asyncio
import logging
from dotenv import load_dotenv

# Load .env variables from workspace root
load_dotenv(dotenv_path="../../.env")
load_dotenv(dotenv_path="../.env")
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from routes.media import router as media_router
from routes.watchlist import router as watchlist_router
from routes.activity import router as activity_router
from routes.stats import router as stats_router
from routes.admin import router as admin_router
from routes.auth import router as auth_router
from core.redis import redis_client
from core.db import connect_db, disconnect_db
from workers.stats_worker import EventWorkerService

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await redis_client.connect()
    await connect_db()
    worker_task = asyncio.create_task(EventWorkerService.process_activity_queue())
    yield
    # Shutdown
    worker_task.cancel()
    try:
        await worker_task
    except asyncio.CancelledError:
        pass
    await disconnect_db()
    await redis_client.disconnect()

app = FastAPI(
    title="MediaVerse API",
    description="Backend API for MediaVerse",
    version="1.0.0",
    lifespan=lifespan
)

# Configured CORS Origins
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
if not allowed_origins:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred",
            "data": None,
            "meta": {}
        }
    )

app.include_router(auth_router)
app.include_router(media_router)
app.include_router(watchlist_router)
app.include_router(activity_router)
app.include_router(stats_router)
app.include_router(admin_router)

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {"success": True, "message": "API is healthy", "data": {}, "meta": {}}
