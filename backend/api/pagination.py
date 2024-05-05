"""Пагинация уровня приложения"""
from rest_framework.pagination import PageNumberPagination


class ItemsLimitPagination(PageNumberPagination):
    """Выводит кол-во записей равные параметру лимита
    или 9 записей"""

    page_size_query_param = 'limit'
    page_size = 9
