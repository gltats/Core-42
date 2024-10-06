from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Permission
from django.core.exceptions import ValidationError
from django.conf import settings
import pyotp
# Create your models here.

def default_birthdate():
    return timezone.now().date()

def validate_file_size(value):
    filesize = value.size

    if filesize > 512000:  # 512 KB
        raise ValidationError("The maximum file size that can be uploaded is 512KB")
    else:
        return value

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', validators=[validate_file_size], blank=True, null=True)
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name="player_set")
    friends = models.ManyToManyField("self", symmetrical=False, blank=True)
    login_flag = models.BooleanField(default=False)
    blocked_users = models.ManyToManyField("self", blank=True, symmetrical=False, related_name='blocked_by_set')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    tfa_secret = models.CharField(max_length=64, blank=True, null=True)
    tfa_enabled = models.BooleanField(default=False)
    is_42 = models.BooleanField(default=False)

    def is_part_of_chat_room(self, room_name):
        return self.chat_rooms.filter(name=room_name).exists()
    
    def __str__(self):
        return self.username
    
    def block_user(self, user_to_block):
        if user_to_block in self.blocked_users.all():
            return  # User is already blocked

        # Add to blocked users
        self.blocked_users.add(user_to_block)

        # Remove from friends list
        self.friends.remove(user_to_block)
        user_to_block.friends.remove(self)

    def unblock_user(self, user_to_unblock):
        if user_to_unblock not in self.blocked_users.all():
            return  # User is not blocked

        # Remove from blocked users
        self.blocked_users.remove(user_to_unblock)

    def generate_tfa_secret(self):
        self.tfa_secret = pyotp.random_base32()
        self.save()
        return self.tfa_secret

    def get_tfa_uri(self):
        if not self.tfa_secret:
            return None
        return pyotp.TOTP(self.tfa_secret).provisioning_uri(name=self.username, issuer_name='YourApp')

    def verify_tfa_code(self, code):
        if not self.tfa_secret:
            return False
        return pyotp.TOTP(self.tfa_secret).verify(code)

    def disable_tfa(self):
        self.tfa_secret = None
        self.tfa_enabled = False
        self.save()

class Match(models.Model):
    winner_username = models.CharField(max_length=150, default='')
    loser_username = models.CharField(max_length=150, default='')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.winner_username} vs {self.loser_username} on {self.date}"


class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_friend_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_friend_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} (Accepted: {self.is_accepted}, Rejected: {self.is_rejected})"
    
    def accept(self):
        self.to_user.friends.add(self.from_user)
        self.from_user.friends.add(self.to_user)
        self.delete()

    def decline(self):
        self.delete()