"""filters.py уровня приложения api"""
from django_filters.rest_framework import FilterSet, filters

from offer.models import Client, Item, OfferForCustomer


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


class FilterForOffers(FilterSet):
    """Фильтр КП по статусу, диапазону дат и клиенту"""

    date_from = filters.DateFilter(field_name='created', lookup_expr='date__gte')
    date_to = filters.DateFilter(field_name='created', lookup_expr='date__lte')
    client = filters.NumberFilter(field_name='name_client_id')

    class Meta:
        model = OfferForCustomer
        fields = ('status_type', 'date_from', 'date_to', 'client')
