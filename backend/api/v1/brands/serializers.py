"""API DRF serializers CLIENTS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Brand
from utils.base64 import Base64ImageField

User = get_user_model()


class BrandSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели брендов"""

    image = Base64ImageField(read_only=True)

    class Meta:
        model = Brand
        fields = '__all__'


class BrandNameIdSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели брендов
    Отдает только ID и Тайтл"""

    class Meta:
        model = Brand
        fields = ('id','title',)

