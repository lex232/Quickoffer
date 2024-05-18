"""API DRF serializers ITEMS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import (
    Client,
    OfferForCustomer,
    ItemUser
)

User = get_user_model()


class ProfileMainSerializer(serializers.Serializer):
    """Сериалайзер для главного экрана админ-панели"""

    count_clients = serializers.SerializerMethodField()
    count_offers = serializers.SerializerMethodField()
    count_items = serializers.SerializerMethodField()

    def get_count_clients(self, obj):
        """Подсчитывает количество клиентов пользователя"""

        current_user = self.context['current_user']
        return Client.objects.filter(author=current_user).count()

    def get_count_offers(self, obj):
        """Подсчитывает количество КП пользователя"""

        current_user = self.context['current_user']
        return OfferForCustomer.objects.filter(author=current_user).count()

    def get_count_items(self, obj):
        """Подсчитывает количество Товаров, созданных пользователем"""

        current_user = self.context['current_user']
        return ItemUser.objects.filter(author=current_user).count()