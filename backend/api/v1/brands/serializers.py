"""API DRF serializers CLIENTS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Brand
from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class BrandSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов"""

    image = Base64ImageField(read_only=True)
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )

    class Meta:
        model = Brand
        fields = '__all__'