"""API DRF OFFERS views - generate docs"""
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from offer.models import OfferForCustomer
from api.filters import FilterForOffers
from api.v1.offer.serializers import (
    OfferSerializer,
    OfferPostSerializer,
    OfferFullSerializer,
    ChangeOfferStatusSerializer,
)
from offer.services import (
    generate_offer_doc,
    generate_contract_items_doc,
    generate_contract_service_doc,
    generate_torg12,
    generate_bill_work,
    generate_bill_items,
)
from offer.services.base import make_docx_response


class OfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для коммерческих предложений."""

    serializer_class = OfferSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = FilterForOffers

    def get_queryset(self):
        """Показываем только КП авторизованного пользователя"""
        user = self.request.user
        return OfferForCustomer.objects.filter(author=user)

    def get_serializer_class(self):
        """Определяем сериалайзер в зависимости от запроса"""
        if self.action in 'list':
            return OfferSerializer
        elif self.action in 'retrieve':
            return OfferFullSerializer
        return OfferPostSerializer

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_bill_work(self, request, **kwargs):
        doc_io = generate_bill_work(kwargs['pk'])
        return make_docx_response(doc_io, "generated_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_bill_items(self, request, **kwargs):
        doc_io = generate_bill_items(kwargs['pk'])
        return make_docx_response(doc_io, "offer_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_doc(self, request, **kwargs):
        doc_io = generate_offer_doc(kwargs['pk'])
        return make_docx_response(doc_io, "generated_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_doc_with_description(self, request, **kwargs):
        doc_io = generate_offer_doc(kwargs['pk'], True)
        return make_docx_response(doc_io, "generated_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_contract_items(self, request, **kwargs):
        doc_io = generate_contract_items_doc(kwargs['pk'])
        return make_docx_response(doc_io, "contract_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_contract_service(self, request, **kwargs):
        doc_io = generate_contract_service_doc(kwargs['pk'])
        return make_docx_response(doc_io, "contract_doc")

    @action(detail=True, methods=['get'], permission_classes=(AllowAny,))
    def download_torg12(self, request, **kwargs):
        doc_io = generate_torg12(kwargs['pk'])
        return make_docx_response(doc_io, "contract_doc")

    @action(detail=True, methods=['patch'], permission_classes=(IsAuthenticated,))
    def change_status(self, request, **kwargs):
        """Смена статуса КП."""
        offer = self.get_object()
        serializer = ChangeOfferStatusSerializer(
            offer,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OfferSerializer(offer).data)
