"""API DRF serializers ITEMS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Client, OfferForCustomer

User = get_user_model()

#######################################################
# API Для админ-панели разное
#######################################################


class ProfileMainSerializer(serializers.Serializer):
    """Сериалайзер для главного экрана админ-панели"""

    count_clients = serializers.SerializerMethodField()
    count_offers = serializers.SerializerMethodField()

    def get_count_clients(self, obj):
        """Подсчитывает количество клиентов пользователя"""

        return Client.objects.count()

    def get_count_offers(self, obj):
        """Подсчитывает количество КП пользователя"""

        return OfferForCustomer.objects.count()
