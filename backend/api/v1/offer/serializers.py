"""API DRF serializers OFFERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import (
    OfferForCustomer,
    OfferItems,
    Item,
    Client
)
# from utils.base64 import Base64ImageField
from api.v1.clients.serializers import ClientSerializer

User = get_user_model()

#######################################################
# API Для КП
#######################################################


class OfferSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели КП - сокращенное"""

    class Meta:
        model = OfferForCustomer
        fields = '__all__'


class OfferItemRelateSerializer(serializers.ModelSerializer):
    """Раскрываем товары при запросе полного КП."""

    item = serializers.SlugRelatedField(
        read_only=True,
        slug_field='title'
    )

    description = serializers.ReadOnlyField(source='item.description')
    image = serializers.SerializerMethodField()

    class Meta:
        model = OfferItems
        fields = (
            'id',
            'item',
            'position',
            'amount',
            'item_price_retail',
            'description',
            'image',
        )

    def get_image(self, obj):
        """Находим url картинки"""

        img_link = self.context['request'].build_absolute_uri('/media/' + str(obj.item.image))
        return img_link


class OfferFullSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели КП - полное"""

    # name_client = serializers.SlugRelatedField(
    #     read_only=True,
    #     slug_field='title'
    # )

    name_client = ClientSerializer()

    items_for_offer = OfferItemRelateSerializer(
        many=True,
        source='selected_offer'
    )

    class Meta:
        model = OfferForCustomer
        fields = ('name_offer', 'created', 'status_type', 'name_client', 'items_for_offer')


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

    items_for_offer = ItemOfferCreateSerializer(many=True)

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
            current_quantity = item['amount']
            current_price_retail = item['item_price_retail']
            current_price_purchase = item['item_price_purchase']
            OfferItems.objects.create(
                offer=offer,
                item=current_item,
                amount=current_quantity,
                item_price_retail=current_price_retail,
                item_price_purchase=current_price_purchase
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
            if int(item['amount']) < 1:
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
