"""urls.py уровня приложения api"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from api.v1.users.views import (
    UserViewSet,
    ProfileViewSet
)
from api.v1.main_page.views import (
    MainPageView
)
from api.v1.items.views import (
    ItemViewSet,
    ItemFinderViewSet,
    ItemUserViewSet
)
from api.v1.offer.views import (
    OfferViewSet
)
from api.v1.clients.views import (
    ClientOfferViewSet,
    ClientFinderViewSet
)
from api.v1.groups.views import (
    GroupItemsOfferViewSet,
    GroupOnCreateViewSet
)
from api.v1.brands.views import BrandViewSet
from api.v1.main_profile.views import ProfileMainView

router_offer = DefaultRouter()

# Роутер КП
router_offer.register(
    'offers',
    OfferViewSet,
    basename='offers'
)

# Роутер списка брендов
router_offer.register(
    'brands',
    BrandViewSet,
    basename='brands'
)

# Роутер группы товаров без услуг
router_offer.register(
    'groupsitems',
    GroupItemsOfferViewSet,
    basename='groupsitems'
)

# Роутер группы товаров при создании товара
router_offer.register(
    'groupsoncreate',
    GroupOnCreateViewSet,
    basename='groupsoncreate'
)

# Роутер клиентов
router_offer.register(
    'clients',
    ClientOfferViewSet,
    basename='clients'
)

# Роутер клиентов для поиска
router_offer.register(
    'clientsfinder',
    ClientFinderViewSet,
    basename='clientsfinder'
)

# Роутер товаров
router_offer.register(
    'items',
    ItemViewSet,
    basename='items'
)

# Роутер товаров пользовательский
router_offer.register(
    'itemsuser',
    ItemUserViewSet,
    basename='itemsuser'
)

# Роутер товаров для поиска
router_offer.register(
    'itemsfinder',
    ItemFinderViewSet,
    basename='itemsfinder'
)

# Роутер пользователей
router_offer.register(
    'users',
    UserViewSet,
    basename='users'
)

# Роутер расширенного профиля
router_offer.register(
    'profile',
    ProfileViewSet,
    basename='profile'
)


api_urlpatterns = [
    # Роутер инфорации главной админ страницы
    path('api/profile-main', ProfileMainView.as_view(), name="profile-main"),
    path('api/main-page', MainPageView.as_view(), name="main-page"),
    path('api/', include(router_offer.urls)),
    path('api/auth/', include('djoser.urls.authtoken')),
    # API СХЕМА
    # path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name="docs"),
    # path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name="redoc"),
]