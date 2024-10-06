# routing.py
from django.urls import re_path
from .consumers import OnlineStatusConsumer

websocket_urlpatterns = [
   re_path(r'ws/online-status/(?P<user_id>\d+)/$', OnlineStatusConsumer.as_asgi()),
]