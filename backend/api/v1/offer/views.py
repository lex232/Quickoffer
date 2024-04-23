"""API DRF OFFERS views"""
from rest_framework import viewsets
from django.contrib.auth import get_user_model

from api.permissions import IsAdminOrReadOnly
from offer.models import (
    OfferForCustomer
)
from api.v1.offer.serializers import (
    OfferSerializer,
    OfferPostSerializer,
    OfferFullSerializer
)

User = get_user_model()


class OfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для коммерческих предложений."""

    queryset = OfferForCustomer.objects.all()
    serializer_class = OfferSerializer
    permission_classes = (IsAdminOrReadOnly,)
    # pagination_class = None

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action in 'list':
            return OfferSerializer
        elif self.action in 'retrieve':
            return  OfferFullSerializer
        return OfferPostSerializer
