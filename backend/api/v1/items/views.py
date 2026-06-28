"""API DRF Items views"""
from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from api.permissions import IsAdminOrReadOnly
from offer.models import Item, ItemUser
from api.v1.items.serializers import (
    ItemSerializer,
    ItemPostSerializer,
    ItemSingleSerializer
)
from api.filters import FilterForItems
from api.pagination import ItemsLimitPagination

User = get_user_model()


class ItemDetailView(RetrieveAPIView):
    """Получение одного публичного товара по ID"""
    queryset = Item.objects.filter(private_type=False)
    serializer_class = ItemSingleSerializer
    permission_classes = (AllowAny,)
    lookup_field = 'slug'


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

    queryset = Item.objects.filter(private_type=False)
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    pagination_class = ItemsLimitPagination
    filterset_fields = ['group']
    ordering_fields = ['price_retail']

    def get_queryset(self):
        """Выделяем бренды, переданные в запросе"""

        queryset_general_items = Item.objects.filter(private_type=False)
        if 'brand' in self.request.GET:
            ids = self.request.GET.get('brand')
            if not ids:
                queryset_general_items = queryset_general_items.none()
            else:
                try:
                    ids = list(map(int, ids.split(',')))
                    queryset_general_items = queryset_general_items.filter(brand__in=ids)
                except ValueError:
                    pass
        return queryset_general_items


class ItemViewSetAuth(viewsets.ModelViewSet):
    """Апи вьюсет для категорий товаров и услуг с авторизацией"""

    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    pagination_class = ItemsLimitPagination
    filterset_fields = ['group']
    ordering_fields = ['price_retail']

    def get_queryset(self):
        """Выделяем бренды, переданные в запросе"""

        queryset_general_items = Item.objects.filter(private_type=False)
        if 'brand' in self.request.GET:
            ids = self.request.GET.get('brand')
            if not ids:
                queryset_general_items = queryset_general_items.none()
            else:
                try:
                    ids = list(map(int, ids.split(',')))
                    queryset_general_items = queryset_general_items.filter(brand__in=ids)
                except ValueError:
                    pass
        return queryset_general_items


class ItemFinderViewSet(viewsets.ReadOnlyModelViewSet):
    """Поиск по товарам."""

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = FilterForItems
