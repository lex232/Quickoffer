"""API DRF Clients views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from offer.models import Client
from api.v1.clients.serializers import (
    ClientSerializer,
    ClientPostSerializer
)
from api.filters import FilterForClients

User = get_user_model()


class ClientOfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий клиентов."""

    serializer_class = ClientSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, )
    filterset_fields = ['company_type']

    def get_queryset(self):
        """Показываем только клиентов авторизованного пользователя"""

        user = self.request.user
        queryset = Client.objects.filter(author=user)
        return queryset

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action == 'list' or self.action == 'retrieve':
            return ClientSerializer
        return ClientPostSerializer


class ClientFinderViewSet(viewsets.ReadOnlyModelViewSet):
    """Поиск по клиентам."""

    # queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None
    filter_backends = (DjangoFilterBackend, )
    filterset_class = FilterForClients

    def get_queryset(self):
        """Показываем только клиентов авторизованного пользователя"""

        user = self.request.user
        queryset = Client.objects.filter(author=user)
        return queryset
