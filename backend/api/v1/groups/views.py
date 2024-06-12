"""API DRF GROUPS views"""
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from api.permissions import IsAdminOrReadOnly
from offer.models import Group
from api.v1.groups.serializers import (
    GroupSerializer
)

User = get_user_model()


class GroupItemsOfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий разделов.
    Только товары (для раздела каталог на главной)!"""

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None

    def get_queryset(self):
        """Показываем только группы с типом = продукт"""

        queryset = Group.objects.filter(cat_type='product')
        return queryset


class GroupOnCreateViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий разделов.
    Только товары и услуги без родительских категорий"""

    serializer_class = GroupSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        """Показываем только группы с свойством
        дерева level != 0"""

        queryset = Group.objects.exclude(level=0)
        return queryset