from django.contrib import admin

from .models import (
    Item,
    ItemUser,
    Group,
    OfferForCustomer,
    OfferItems,
    Client
)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'inn',
        'address_reg'
    )


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'description',
        'group',
        'price_retail',
        'private_type',
    )


@admin.register(ItemUser)
class ItemUserAdmin(admin.ModelAdmin):
    list_display = (
        'author',
        'title',
        'description',
        'group',
        'price_retail',
        'private_type',
    )


@admin.register(OfferForCustomer)
class OfferForCustomerAdmin(admin.ModelAdmin):
    list_display = (
        'name_offer',
        'author',
        'name_client',
        'id',
        'created',
        'status_type'
    )


@admin.register(OfferItems)
class OfferItemsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'offer',
        'position',
        'item',
        'amount',
        'item_price_retail',
        'item_price_purchase'
    )


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'slug',
        'description'
    )
