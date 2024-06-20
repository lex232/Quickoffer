from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import (
    Item,
    ItemUser,
    Group,
    OfferForCustomer,
    OfferItems,
    Client,
    Profile,
    Brand
)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'inn',
        'address_reg'
    )


# @admin.register(Brand)
# class ClientAdmin(admin.ModelAdmin):
#     list_display = (
#         'title',
#         'description'
#     )


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'title',
        'description',
        'brand',
        'price_retail',
        'private_type',
        'item_type',
    )


@admin.register(ItemUser)
class ItemUserAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'author',
        'title',
        'description',
        # 'group',
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
        'status_type',
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


# @admin.register(Group)
# class GroupAdmin(admin.ModelAdmin):
#     list_display = (
#         'id',
#         'title',
#         'slug',
#         'description'
#     )

class GroupAdmin(MPTTModelAdmin):
    prepopulated_fields = {
        "slug": ("title",)
    }


admin.site.register(Group, GroupAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Интерфейс админ-зоны модели пользователя."""

    list_display = ('pk', 'user', 'ogrn', 'inn')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Интерфейс админ-зоны модели пользователя."""

    list_display = ('pk', 'title', 'description', 'image')