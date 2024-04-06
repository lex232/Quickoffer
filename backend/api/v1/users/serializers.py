"""API DRF serializers USERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

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


class UserGetSerializerAll(serializers.ModelSerializer):
    """Сериалайзер для модели User на чтение"""

    class Meta:
        model = User
        fields = ('email', 'id', 'username', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'last_login', 'date_joined')
