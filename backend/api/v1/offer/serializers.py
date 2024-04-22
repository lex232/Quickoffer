"""API DRF serializers OFFERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import (
    OfferForCustomer,
    OfferItems,
    Item
)
# from utils.base64 import Base64ImageField

User = get_user_model()

#######################################################
# API Для КП
#######################################################


class OfferSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели КП"""

    class Meta:
        model = OfferForCustomer
        fields = '__all__'


class ItemOfferCreateSerializer(serializers.ModelSerializer):
    """Товар, его количество и другие характеристики для
    создания коммерческого предложения."""

    id = serializers.IntegerField()

    class Meta:
        model = OfferItems
        fields = (
            'id',
            'position',
            'item_price_retail',
            'item_price_purchase',
            'amount'
        )


class OfferPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для создания коммерческого предложения."""

    items = ItemOfferCreateSerializer(many=True)

    class Meta:
        model = OfferForCustomer
        fields = (
            'items_for_offer', 'name_offer', 'name_client', 'status_type'
        )

    def processing_items(self, offer, items):
        """Сохранение связанной модели Товар-КП
        для каждой позиции отдельно в цикле"""

        for item in items:
            current_item = Item.objects.get(pk=item['id'])
            current_quantity = item['quantity']
            OfferItems.objects.create(
                offer=offer,
                item=current_item,
                amount=current_quantity
            )

    def validate(self, data):
        """Проверка на одинаковые товары
        На количество товара"""

        item_list = []
        items_get = data.get('items_for_offer')
        for item in items_get:
            if item['id'] in item_list:
                raise serializers.ValidationError(
                    {
                        'Ошибка': 'Такой товар или услуга уже были'
                    }
                )
            if int(item['quantity']) < 1:
                raise serializers.ValidationError(
                    {
                        'Ошибка': 'Количество не может быть меньше 1'
                    }
                )
            item_list.append(item['id'])
        return data

    def create(self, validated_data):
        """Создание коммерческого предложения"""

        author = self.context.get('request').user
        items_valid = validated_data.pop('items_for_offer')

        offer = OfferForCustomer.objects.create(
            **validated_data,
            author=author
        )
        self.processing_items(offer, items_valid)
        return offer

    def to_representation(self, instance):
        """После создания отдаем корректный сериализатор
        коммерческого предложения"""

        return OfferSerializer(instance, context=self.context).data
