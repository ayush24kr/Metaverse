import os
import subprocess
from prisma import Prisma

db = Prisma()

async def connect_db():
    try:
        await db.connect()
    except Exception as e:
        print("Prisma DB connection notice:", e)
        # Attempt auto-fetching Prisma binaries if missing on server
        try:
            print("Auto-fetching Prisma engine binaries...")
            subprocess.run(["python", "-m", "prisma", "py", "fetch"], check=True)
            await db.connect()
            print("Prisma DB re-connected successfully.")
        except Exception as err:
            print("Prisma auto-fetch failed:", err)

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()
