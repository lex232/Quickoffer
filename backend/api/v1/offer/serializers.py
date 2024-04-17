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


class OfferSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели КП"""

    class Meta:
        model = OfferForCustomer
        fields = '__all__'
