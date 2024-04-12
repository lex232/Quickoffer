"""API DRF Clients views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from api.permissions import IsAdminOrReadOnly
from offer.models import Client
from api.v1.clients.serializers import (
    ClientSerializer,
    ClientPostSerializer
)

User = get_user_model()


class ClientOfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для категорий клиентов."""

    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = (IsAdminOrReadOnly,)
    # pagination_class = None

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action == 'list' or self.action == 'retrieve':
            return ClientSerializer
        return ClientPostSerializer
