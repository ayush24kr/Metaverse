import os
import stat
import subprocess
from prisma import Prisma

db = Prisma()

async def connect_db():
    try:
        await db.connect()
    except Exception as e:
        print("Prisma DB connection notice:", e)
        try:
            print("Auto-fetching Prisma engine binaries...")
            subprocess.run(["python", "-m", "prisma", "py", "fetch"], check=True)
            
            # Ensure downloaded binaries in Linux cache have executable permissions (+x)
            cache_dir = os.path.expanduser("~/.cache/prisma-python/binaries")
            if os.path.exists(cache_dir):
                for root, _, files in os.walk(cache_dir):
                    for file in files:
                        filepath = os.path.join(root, file)
                        try:
                            st = os.stat(filepath)
                            os.chmod(filepath, st.st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)
                        except Exception:
                            pass
                            
            await db.connect()
            print("Prisma DB re-connected successfully.")
        except Exception as err:
            print("Prisma auto-fetch failed:", err)

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()
