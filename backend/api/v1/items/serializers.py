"""API DRF serializers NEWS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Item

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class ItemSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели товара"""

    class Meta:
        model = Item
        fields = '__all__'