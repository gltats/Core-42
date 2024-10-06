# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import User

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if len(username) < 5 or len(username) > 30:
            raise ValidationError("Username must be between 5 and 30 characters.")
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 8 or len(password1) > 32:
            raise ValidationError("Password must be between 8 and 32 characters.")
        return password1