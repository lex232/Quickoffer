"""API DRF serializers NEWS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Client
from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class ClientSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов"""

    class Meta:
        model = Client
        fields = '__all__'


class ClientPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов, метод POST"""

    image = Base64ImageField(read_only=True)
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )

    class Meta:
        model = Client
        fields = '__all__'