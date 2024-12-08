"""API DRF Clients views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from offer.models import Brand, Item
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
    def onlynamesid(self, request):
        """Бренды только с айди и названием"""

        if request.method == 'GET':

            serializer = BrandNameIdSerializer(self.queryset, many=True)
            return Response(serializer.data)

    @action(detail=True,
            methods=['get'],
            pagination_class=None,
            permission_classes=(AllowAny,))
    def brand_on_category(self, request,  **kwargs):
        """Бренды, которые есть у товаров в категории"""

        if request.method == 'GET':

            category_id = kwargs['pk']
            # Ищем товары по интересующей категории
            offer_item_group_queryset = Item.objects.filter(group=category_id)
            # Ищем уникальные id брендов в товарах
            brands = set(offer_item_group_queryset.values_list('brand', flat=True).distinct())
            # Извлекаем бренды по id
            finally_brands = Brand.objects.filter(pk__in=brands)
            serializer = BrandNameIdSerializer(finally_brands, many=True)
            return Response(serializer.data)