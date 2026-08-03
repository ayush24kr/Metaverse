import uuid
import hashlib
import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from core.response import UnifiedResponse
from core.db import db
from core.jwt import create_access_token
from core.auth import verify_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

class AuthRequest(BaseModel):
    username: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register", response_model=UnifiedResponse[dict])
async def register(req: AuthRequest):
    if not db.is_connected():
        raise HTTPException(status_code=500, detail="Database not connected")

    try:
        existing = await db.user.find_first(where={"username": req.username})
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")

        user_id = f"user_{uuid.uuid4().hex[:12]}"
        password_hash = hash_password(req.password)

        new_user = await db.user.create(
            data={
                "id": user_id,
                "username": req.username,
                "passwordHash": password_hash,
            }
        )

        token = create_access_token(user_id=new_user.id, username=new_user.username or req.username)
        return UnifiedResponse(
            success=True,
            message="User registered successfully",
            data={"token": token, "user": {"id": new_user.id, "username": new_user.username}}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Failed to register user")

@router.post("/login", response_model=UnifiedResponse[dict])
async def login(req: AuthRequest):
    if not db.is_connected():
        raise HTTPException(status_code=500, detail="Database not connected")

    try:
        user = await db.user.find_first(where={"username": req.username})
        if not user or not user.passwordHash:
            # Fallback for dev mode single user
            if req.username.lower() in ["ayush", "user_ayush"]:
                token = create_access_token(user_id="user_ayush", username="Ayush")
                return UnifiedResponse(
                    success=True,
                    message="Login successful",
                    data={"token": token, "user": {"id": "user_ayush", "username": "Ayush"}}
                )
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if user.passwordHash != hash_password(req.password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = create_access_token(user_id=user.id, username=user.username or req.username)
        return UnifiedResponse(
            success=True,
            message="Login successful",
            data={"token": token, "user": {"id": user.id, "username": user.username}}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Failed to log in")

@router.get("/me", response_model=UnifiedResponse[dict])
async def get_me(user: dict = Depends(verify_user)):
    return UnifiedResponse(
        success=True,
        message="Current user profile",
        data={"user": user}
    )
