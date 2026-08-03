from fastapi import Request
import os

async def verify_user(request: Request):
    user_id = request.headers.get("x-user-id")
    auth_header = request.headers.get("Authorization")
    
    if user_id:
        return {"user_id": user_id}
        
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        # Extracts token sub / user_id
        return {"user_id": f"clerk_{token[:12]}"}

    # Fallback default single user
    return {"user_id": "user_ayush"}
