"""API DRF serializers ITEMS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Item, ItemUser, Group
from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для пользовательских клиентов
#######################################################


class ItemSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели товара"""

    brand = serializers.SlugRelatedField(
        read_only=True,
        slug_field='title'
    )

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
        print('VALIDATED', validated_data)
        #  'group': [<Group: Регистраторы IP цифровые 2Mpix>],
        if check_group := validated_data.get('group'):
            maybe_group = validated_data.pop('group')
        print('AFTER VALIDATED', validated_data)
        # Тут как то удалить из списка group и поймать как в загрузке демо
        created_item = ItemUser.objects.create(
            **validated_data,
            private_type=True,
            author=author
        )
        if check_group:
            created_item.group.set(maybe_group)
        # temp_model.group.set(dict_for_record.get('group'))
        return created_item

    def to_representation(self, instance):
        """После создания отдаем корректный сериализатор
        созданного клиента"""

        return ItemSerializer(instance, context=self.context).data