"""API DRF ADMIN views"""
from rest_framework import views
from django.contrib.auth import get_user_model
from rest_framework.response import Response

from api.permissions import IsAdminOrReadOnly
from api.v1.main_profile.serializers import (
    ProfileMainSerializer
)

User = get_user_model()

class ProfileMainView(views.APIView):
    """Апи вьюсет для главной админ панели."""

    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        # yourdata = {"count_news": 0, "count_freesoft": 0, "count_reports": 2}
        yourdata = {}
        results = ProfileMainSerializer(yourdata).data
        return Response(results)

