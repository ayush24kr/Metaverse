from prisma import Prisma

db = Prisma()

async def connect_db():
    try:
        await db.connect()
    except Exception as e:
        print("Prisma DB connection notice:", e)

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()
