"""filters.py уровня приложения api"""
from django_filters.rest_framework import FilterSet, filters

from offer.models import Client, Item


class FilterForClients(FilterSet):
    """Поиск по клиентам по вхождению в начало названия"""

    client = filters.CharFilter(field_name='title', lookup_expr='startswith')

    class Meta:
        model = Client
        fields = ('client',)


class FilterForItems(FilterSet):
    """Поиск по товарам-услугам по вхождению в начало названия"""

    item = filters.CharFilter(field_name='title', lookup_expr='startswith')

    class Meta:
        model = Item
        fields = ('item',)
