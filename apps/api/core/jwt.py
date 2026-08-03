import os
import time
import jwt
from typing import Dict, Any

JWT_SECRET = os.getenv("JWT_SECRET", "mediaverse_super_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = 86400 * 7  # 7 days

def create_access_token(user_id: str, username: str) -> str:
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": int(time.time()) + JWT_EXPIRY_SECONDS
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception as e:
        raise ValueError(f"Invalid or expired token: {e}")
