from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, MONGODB_DB_NAME

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    # Create indexes
    await db.regions.create_index("code", unique=True)
    await db.monthly_updates.create_index([("region_id", 1), ("month", 1)], unique=True)
    await db.pre_sales.create_index([("region_id", 1), ("month", 1)])
    await db.action_plans.create_index([("region_id", 1), ("month", 1)])
    await db.open_roles.create_index([("region_id", 1), ("month", 1)])
    await db.upcoming_releases.create_index([("region_id", 1), ("month", 1)])
    await db.new_hires.create_index([("region_id", 1), ("month", 1)])
    await db.bench_resources.create_index([("region_id", 1), ("month", 1)])
    await db.challenges.create_index([("region_id", 1), ("month", 1)])
    print(f"Connected to MongoDB: {MONGODB_DB_NAME}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")


def get_db():
    return db
