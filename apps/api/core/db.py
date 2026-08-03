import os
import stat
import subprocess
from prisma import Prisma

db = Prisma()

def locate_and_set_query_engine():
    search_dirs = [
        os.path.expanduser("~/.cache/prisma-python/binaries"),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..")),
    ]
    for search_dir in search_dirs:
        if os.path.exists(search_dir):
            for root, _, files in os.walk(search_dir):
                for file in files:
                    if "query-engine" in file:
                        filepath = os.path.join(root, file)
                        try:
                            st = os.stat(filepath)
                            os.chmod(filepath, st.st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)
                        except Exception:
                            pass
                        os.environ["PRISMA_QUERY_ENGINE_BINARY"] = filepath
                        print(f"Set PRISMA_QUERY_ENGINE_BINARY to: {filepath}")
                        return

async def connect_db():
    locate_and_set_query_engine()
    try:
        await db.connect()
    except Exception as e:
        print("Prisma DB connection notice:", e)
        try:
            print("Auto-fetching Prisma engine binaries...")
            subprocess.run(["python", "-m", "prisma", "py", "fetch"], check=True)
            locate_and_set_query_engine()
            await db.connect()
            print("Prisma DB re-connected successfully.")
        except Exception as err:
            print("Prisma auto-fetch failed:", err)

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()
