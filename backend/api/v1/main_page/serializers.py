"""API DRF serializers MainPage"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import (
    Client,
    OfferForCustomer,
    Item
)

User = get_user_model()


class MainPageSerializer(serializers.Serializer):
    """Сериалайзер для главной страницы"""

    count_clients = serializers.SerializerMethodField()
    count_offers = serializers.SerializerMethodField()
    count_items = serializers.SerializerMethodField()

    def get_count_clients(self, obj):
        """Подсчитывает количество пользователей всего"""

        return User.objects.all().count()

    def get_count_offers(self, obj):
        """Подсчитывает количество КП всего"""

        return OfferForCustomer.objects.all().count()

    def get_count_items(self, obj):
        """Подсчитывает количество Товаров всего в базе"""

        return Item.objects.all().count()