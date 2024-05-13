"""API DRF GROUPS views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from api.permissions import IsAdminOrReadOnly
from offer.models import Group
from api.v1.groups.serializers import (
    GroupSerializer
)

User = get_user_model()


class GroupOfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий разделов.
    Только товары!"""

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None

    def get_queryset(self):
        """Показываем только клиентов авторизованного пользователя"""

        queryset = Group.objects.filter(cat_type='product')
        return queryset
