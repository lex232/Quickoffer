"""API DRF serializers USERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

from offer.models import Profile
from utils.base64 import Base64ImageField

User = get_user_model()


#######################################################
# API Для пользователей
#######################################################


class UserPostSerializer(serializers.ModelSerializer):
    """Сериалайзер для  создание нового пользователя."""

    class Meta:
        model = User
        fields = ('email', 'username',
                  'first_name',
                  'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserGetSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели User на чтение"""

    class Meta:
        model = User
        fields = ('email', 'id', 'username', 'first_name', 'last_name')


class ProfileGetSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели Profile на чтение"""

    image = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_image(self, obj):
        """Находим url картинки"""

        img_link = self.context['request'].build_absolute_uri('/media/' + str(obj.image))
        return img_link



class ProfilePostSerializer(serializers.ModelSerializer):
    """Сериалайзер для модели Profile на запись"""

    image = Base64ImageField(required=False)

    class Meta:
        model = Profile
        fields = '__all__'


class UserGetSerializerAll(serializers.ModelSerializer):
    """Сериалайзер для модели User на чтение"""

    profile = ProfileGetSerializer()

    class Meta:
        model = User
        fields = ('email', 'id', 'username', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'last_login', 'date_joined', 'profile')
