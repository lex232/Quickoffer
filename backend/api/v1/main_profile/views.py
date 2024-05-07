"""API DRF ADMIN views"""
from rest_framework import views
from django.contrib.auth import get_user_model
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated
from api.v1.main_profile.serializers import (
    ProfileMainSerializer
)

User = get_user_model()

class ProfileMainView(views.APIView):
    """Апи вьюсет для главной админ панели."""

    permission_classes = [IsAuthenticated]

    def get(self, request):

        current_user = self.request.user
        results = ProfileMainSerializer({}, context={'current_user': current_user}).data
        return Response(results)

