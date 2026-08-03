from fastapi import Request, HTTPException
import os

async def verify_user(request: Request):
    auth_header = request.headers.get("Authorization")
    env = os.getenv("ENV", "development")
    if not auth_header and env == "production":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"user_id": "mock_clerk_id"}
