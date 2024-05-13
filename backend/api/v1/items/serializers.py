"""API DRF serializers ITEMS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Item

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class ItemSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели товара"""

    brand = serializers.SlugRelatedField(
        read_only=True,
        slug_field='title'
    )

    class Meta:
        model = Item
        fields = '__all__'