"""API DRF serializers NEWS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import (
    Group,
    Client,
    OfferForCustomer,
    Item
)
# from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для КП
#######################################################


class GroupSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели категорий разделов"""

    class Meta:
        model = Group
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов"""

    class Meta:
        model = Client
        fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели КП"""

    class Meta:
        model = OfferForCustomer
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели товара"""

    class Meta:
        model = Item
        fields = '__all__'