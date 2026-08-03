from fastapi import Request

async def verify_user(request: Request):
    user_id = request.headers.get("x-user-id")
    if user_id:
        return {"user_id": user_id}
    # Direct backend user binding to PostgreSQL database
    return {"user_id": "user_ayush"}
