"""QUICKOFFER APP URL Configuration
Настройки ссылок
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from api.urls import api_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += api_urlpatterns
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)