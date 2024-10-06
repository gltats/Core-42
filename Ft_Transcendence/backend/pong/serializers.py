from rest_framework import serializers
from .models import Player, Ball, GameState

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class BallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ball
        fields = '__all__'

class GameStateSerializer(serializers.ModelSerializer):
    player_left = PlayerSerializer()
    player_right = PlayerSerializer()
    ball = BallSerializer()

    class Meta:
        model = GameState
        fields = '__all__'
