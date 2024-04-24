"""API DRF serializers USERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Profile

User = get_user_model()


#######################################################
# API Для пользователей
#######################################################


class UserPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для  создание нового пользователя."""

    class Meta:
        model = User
        fields = ('id', 'email', 'username',
                  'first_name', 'last_name',
                  'password')


class UserGetSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели User на чтение"""

    class Meta:
        model = User
        fields = ('email', 'id', 'username', 'first_name', 'last_name')


class ProfileGetSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели Profile на чтение"""

    class Meta:
        model = Profile
        fields = ('avatar', 'ogrn', 'inn')


class UserGetSerializerAll(serializers.ModelSerializer):
    """Сериалайзер для модели User на чтение"""

    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('email', 'id', 'username', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'last_login', 'date_joined', 'profile')

    def get_profile(self, obj):
        # data = obj.profile.subdivision
        data = ProfileGetSerializer(obj.profile).data
        return data