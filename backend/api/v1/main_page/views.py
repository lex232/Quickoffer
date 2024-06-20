"""API DRF MainPage views"""
from rest_framework import views
from django.contrib.auth import get_user_model
from rest_framework.response import Response

from rest_framework.permissions import AllowAny
from api.v1.main_page.serializers import (
    MainPageSerializer
)

User = get_user_model()

class MainPageView(views.APIView):
    """Апи вьюсет для главной страницы."""

    permission_classes = [AllowAny]

    def get(self, request):
        results = MainPageSerializer({}).data
        return Response(results)

