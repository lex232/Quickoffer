"""API DRF NEWS views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from api.permissions import IsAdminOrReadOnly
from offer.models import (
    OfferForCustomer,
    Item
)
from api.v1.offer.serializers import (
    OfferSerializer,
    ItemSerializer
)

User = get_user_model()


class OfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий разделов."""

    queryset = OfferForCustomer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None


class ItemViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий разделов."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None
