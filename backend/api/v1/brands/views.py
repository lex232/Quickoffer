"""API DRF Clients views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from offer.models import Brand
from api.v1.brands.serializers import BrandSerializer, BrandNameIdSerializer

User = get_user_model()


class BrandViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для списка брендов."""

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = None

    @action(detail=False,
            methods=['get'],
            pagination_class=None,
            permission_classes=(AllowAny,))
    def onlynamesid(self, request,  **kwargs):
        """Бренды только с айди и названием"""

        if request.method == 'GET':

            serializer = BrandNameIdSerializer(self.queryset, many=True)
            return Response(serializer.data)