# utils/redis_utils.py

import redis
from datetime import timedelta

# Initialize Redis client
redis_client = redis.StrictRedis(host='redis', port=6379, db=0)

# Constants
ONLINE_TIMEOUT = timedelta(minutes=5)  # User is considered offline after 5 minutes of inactivity

def mark_user_online(user_id):
    """Mark a user as online by setting a Redis key with a timeout."""
    redis_client.setex(f"user_online_{user_id}", ONLINE_TIMEOUT, "1")

def is_user_online(user_id):
    """Check if a user is online by checking the existence of their Redis key."""
    return redis_client.get(f"user_online_{user_id}") is not None

def mark_user_offline(user_id):
    """Mark a user as offline by deleting their Redis key."""
    redis_client.delete(f"user_online_{user_id}")
