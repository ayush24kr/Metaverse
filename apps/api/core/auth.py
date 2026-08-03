from fastapi import Request, HTTPException
from core.jwt import decode_access_token

async def verify_user(request: Request):
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.removeprefix("Bearer ").strip()
        try:
            payload = decode_access_token(token)
            return {"user_id": payload["user_id"], "username": payload["username"]}
        except ValueError as e:
            raise HTTPException(status_code=401, detail=str(e))
            
    # X-User-ID header fallback or default single user binding
    user_id = request.headers.get("x-user-id", "user_ayush")
    return {"user_id": user_id, "username": "Ayush"}
