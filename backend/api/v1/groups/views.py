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
    """Апи вьюсет для категорий разделов."""

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAdminOrReadOnly,)
    pagination_class = None
