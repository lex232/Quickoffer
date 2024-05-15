"""API DRF Clients views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from rest_framework.permissions import IsAuthenticatedOrReadOnly

from offer.models import Brand
from api.v1.brands.serializers import BrandSerializer

User = get_user_model()


class BrandViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для списка брендов."""

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = None