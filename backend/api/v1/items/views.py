"""API DRF Items views"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend

from api.permissions import IsAdminOrReadOnly
from offer.models import Item, ItemUser
from api.v1.items.serializers import (
    ItemSerializer,
    ItemPostSerializer
)
from api.filters import FilterForItems
from api.pagination import ItemsLimitPagination

User = get_user_model()


class ItemUserViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для создания товаров и услуг пользователя"""

    queryset = ItemUser.objects.all()
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['item_type']

    def get_queryset(self):
        """Показываем только товары авторизованного пользователя"""

        user = self.request.user
        queryset = ItemUser.objects.filter(author=user)
        return queryset

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action == 'list' or self.action == 'retrieve':
            return ItemSerializer
        # elif self.action == 'update':
        #
        return ItemPostSerializer


class ItemViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий товаров и услуг."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    filter_backends = (DjangoFilterBackend,)
    pagination_class = ItemsLimitPagination
    filterset_fields = ['group']


class ItemFinderViewSet(viewsets.ReadOnlyModelViewSet):
    """Поиск по товарам."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = FilterForItems
