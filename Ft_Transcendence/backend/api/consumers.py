# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from backend.utils.redis_utils import redis_client
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

from backend.utils.redis_utils import mark_user_online, mark_user_offline

User = get_user_model()

class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.accept()

        # Mark the user as online immediately upon connection
        await sync_to_async(mark_user_online)(self.user_id)

        # Subscribe to the Redis channel for this user
        await self.channel_layer.group_add(
            f"user_{self.user_id}",
            self.channel_name
        )

    async def disconnect(self, close_code):
        # Unsubscribe from Redis channel
        await sync_to_async(mark_user_offline)(self.user_id)

        # Unsubscribe from the Redis channel
        await self.channel_layer.group_discard(
            f"user_{self.user_id}",
            self.channel_name
        )
        
    async def online_status(self, event):
        # Handle a status update event
        await self.send(text_data=json.dumps(event))