"""Base test classes for offer app tests."""
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token


class BaseAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'testpassword123'
        self.user = User.objects.create_user(
            username='apiuser', email='api@test.com',
            password=self.password
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
