"""API DRF serializers ITEMS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Item, ItemUser, Group
from api.v1.groups.serializers import GroupSerializer
from api.v1.brands.serializers import BrandSerializer
from utils.base64 import Base64ImageField

User = get_user_model()


class ItemSingleSerializer(serializers.ModelSerializer):
    """Сериалайзер для единичной  модели товара"""

    group = GroupSerializer(read_only=True, many=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Item
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели товара"""

    brand = serializers.SlugRelatedField(
        read_only=True,
        slug_field='title'
    )

    group = GroupSerializer(read_only=True, many=True)

    class Meta:
        model = Item
        fields = '__all__'


class ItemPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для создания модели товара
    (пользовательского)"""

    image = Base64ImageField(required=False)

    class Meta:
        model = ItemUser
        fields = (
            'title',
            'brand',
            'description',
            'group',
            'price_retail',
            'image',
            'quantity_type',
            'item_type',
        )

    def create(self, validated_data):
        """Создание товара пользователя"""

        author = self.context.get('request').user
        group_data = validated_data.pop('group', None)
        created_item = ItemUser.objects.create(
            **validated_data,
            private_type=True,
            author=author
        )
        if group_data:
            created_item.group.set(group_data)
        return created_item

    def update(self, instance, validated_data):
        """Обновление товара пользователя"""


        if check_group := validated_data.get('group'):
            maybe_group = validated_data.pop('group')
        if check_group:
            instance.group.clear()
            instance.group.set(maybe_group)
        if check_group == None:
            instance.group.clear()
        # Удаляем группу если с фронта пришел 0
        check_brand = validated_data.get('brand')
        if check_brand == None:
            instance.brand = None

        instance.save()
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """После создания отдаем корректный сериализатор
        созданного клиента"""

        return ItemSerializer(instance, context=self.context).data