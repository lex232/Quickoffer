"""API DRF Items views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from django_filters.rest_framework import DjangoFilterBackend

from api.permissions import IsAdminOrReadOnly
from offer.models import Item
from api.v1.items.serializers import (
    ItemSerializer
)
from api.filters import FilterForItems

User = get_user_model()


class ItemViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий товаров и услуг."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None


class ItemFinderViewSet(viewsets.ReadOnlyModelViewSet):
    """Поиск по товарам."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = FilterForItems
