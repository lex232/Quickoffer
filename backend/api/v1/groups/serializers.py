"""API DRF serializers GROUPS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Group

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class GroupSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели группы."""

    class Meta:
        model = Group
        fields = '__all__'
