from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/pong/game/(?P<game_state_id>\w+)/$', consumers.PongConsumer.as_asgi()),
]