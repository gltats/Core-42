from rest_framework import serializers
from .models import User, Match, FriendRequest
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from backend.utils.redis_utils import is_user_online


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'friends', 'avatar', 'blocked_users',
                  'wins', 'losses',
                  ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class FriendSerializer(serializers.ModelSerializer):
    is_online = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'is_online']

    def get_is_online(self, obj):
        """Check if the friend is currently online."""
        return is_user_online(obj.id)

class BlockedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username']

class UserDataSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'id', 'login_flag', 'avatar', 'wins', 'losses', 'is_42', 'tfa_enabled']

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_avatar(self, obj) -> str:
        request = self.context.get('request')
        avatar_url = obj.avatar.url if obj.avatar else None
        return request.build_absolute_uri(avatar_url) if avatar_url else None

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not check_password(value, user.password):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

class AvatarUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['avatar']

    def validate_avatar(self, value):
        max_size_kb = 512  # Maximum size in KB
        if value.size > max_size_kb * 1024:
            raise serializers.ValidationError(f"The maximum file size that can be uploaded is {max_size_kb} KB.")

        allowed_types = ['image/jpeg', 'image/png']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only JPEG and PNG files are allowed.")

        return value

    def update_avatar(request):
        user = request.user
        serializer = AvatarUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Avatar updated successfully.', 'avatar_url': user.avatar.url}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MatchSerializer(serializers.ModelSerializer):
    winner = serializers.StringRelatedField()
    loser = serializers.StringRelatedField()

    class Meta:
        model = Match
        fields = ['winner', 'loser', 'date']

class FriendRequestSerializer(serializers.ModelSerializer):
    from_user = serializers.StringRelatedField()
    to_user = serializers.StringRelatedField()
    from_username = serializers.CharField(source='from_user.username', read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'from_user', 'to_user', 'created_at', 'is_accepted', 'is_rejected', 'from_username',]

class TFAEnableDisableSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, required=False)

    def validate(self, data):
        user = self.context['request'].user

        if user.tfa_enabled:
            if not data.get('code'):
                raise serializers.ValidationError('2FA code is required to disable 2FA.')
            if not user.verify_tfa_code(data['code']):
                raise serializers.ValidationError('Invalid 2FA code.')
        return data