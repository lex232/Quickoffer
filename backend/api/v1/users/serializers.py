"""API DRF serializers USERS"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions as dajngo_exceptions

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

    def validate(self, obj):
        try:
            validate_password(obj['password'])
        except dajngo_exceptions.ValidationError as e:
            raise serializers.ValidationError(
                {'password': list(e.messages)}
            )
        return super().validate(obj)

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
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
