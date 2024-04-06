"""permissions.py уровня приложения api"""
from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """Проверка на Админ или чтение для всех"""
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or (
            request.user.is_authenticated and (
                request.user.is_staff or request.user.is_superuser
            )
        )


class IsAuthorAdminOrReadOnly(permissions.BasePermission):
    """Проверка на Автора, Админа или чтение для всех"""
    def has_object_permission(self, request, view, obj):
        return (request.method in permissions.SAFE_METHODS
                or request.user.is_staff
                or obj.author == request.user)

    def has_permission(self, request, view):
        return (request.method in permissions.SAFE_METHODS
                or request.user.is_authenticated)


class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    """test"""
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return (
            request.method in permissions.SAFE_METHODS
            or obj.author == request.user
            or request.user.is_staff
        )
