"""API DRF USERS VIEWS"""
from rest_framework import mixins, viewsets, status
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from api.v1.users.serializers import (
    UserGetSerializer,
    UserPostSerializer,
    UserGetSerializerAll,
    ProfilePostSerializer,
    ProfileGetSerializer
)
from offer.models import Profile
from api.permissions import IsAuthorAdminOrReadOnly

User = get_user_model()


class ProfileViewSet(viewsets.ModelViewSet):
    """Работа с расширенной моделью пользователя"""

    queryset = Profile.objects.all()
    serializer_class = ProfileGetSerializer
    permission_classes = (IsAuthenticated, )

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action == 'list' or self.action == 'retrieve':
            return ProfileGetSerializer
        elif self.action == 'partial_update':
            return ProfilePostSerializer
        return ProfilePostSerializer


class UserViewSet(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    """Получаем пользователей, регистрируем пользователя
    Получаем информацию о текущем пользователе, если он авторизован"""

    queryset = User.objects.all()
    # pagination_class = None
    permission_classes = (AllowAny,)

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action == 'list' or self.action == 'retrieve':
            return UserGetSerializerAll
        elif self.action == 'post':
            return UserPostSerializer
        return UserGetSerializer

    @action(detail=True,
            methods=['get', 'delete', 'patch'],
            pagination_class=None,
            permission_classes=(IsAdminUser,))
    def current(self, request,  **kwargs):
        """Получаем информацию о конкретном пользователе
        На этом эндпоинте доступно удаление юзера"""

        if request.method == 'GET':

            user_id = get_object_or_404(User, id=kwargs['pk'])
            serializer = UserGetSerializerAll(user_id)
            return Response(serializer.data)

        if request.method == 'DELETE':

            user_id = get_object_or_404(User, id=kwargs['pk'])
            user_id.delete()
            return Response('Успешно удалено', status=status.HTTP_200_OK)

        if request.method == 'PATCH':

            user_id = get_object_or_404(User, id=kwargs['pk'])
            serializer = UserPostSerializer(user_id, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response('Успешно обновлено', status=status.HTTP_201_CREATED)
            return Response('Ошибочные параметры', status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False,
            methods=['get'],
            pagination_class=None,
            permission_classes=(IsAuthenticated,))
    def me(self, request):
        """Получаем информацию о текущем пользователе(только
        для аутентифицированных пользователей)"""

        serializer = UserGetSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False,
            methods=['get'],
            pagination_class=None,
            permission_classes=(IsAuthenticated,))
    def meall(self, request):
        """Получаем информацию о текущем пользователе(только
        для аутентифицированных пользователей) в полном формате"""

        serializer = UserGetSerializerAll(request.user, context={'request': request})
        return Response(serializer.data)
