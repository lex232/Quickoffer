"""API DRF serializers NEWS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Client
from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class ClientSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов"""

    image = Base64ImageField(read_only=True)
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )

    class Meta:
        model = Client
        fields = '__all__'


class ClientPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели клиентов, метод POST"""

    image = Base64ImageField(required=False)

    class Meta:
        model = Client
        fields = (
            'title',
            'ogrn',
            'inn',
            'kpp',
            'address_reg',
            'address_post',
            'bill_num',
            'bill_corr_num',
            'bank_name',
            'image'
        )

    def create(self, validated_data):
        """Создание клиента"""

        author = self.context.get('request').user
        client = Client.objects.create(**validated_data, author=author)
        return client

    def to_representation(self, instance):
        """После создания отдаем корректный сериализатор
        созданного клиента"""

        return ClientSerializer(instance, context=self.context).data
