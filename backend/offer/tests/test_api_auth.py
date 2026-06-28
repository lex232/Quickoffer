"""Tests for auth API endpoints."""
from django.contrib.auth.models import User
from rest_framework import status

from offer.tests.base import BaseAPITest


class AuthAPITests(BaseAPITest):
    def test_login_returns_token(self):
        self.client.credentials()
        response = self.client.post('/api/auth/token/login/', {
            'username': 'apiuser',
            'password': self.password,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('auth_token', response.data)

    def test_me_endpoint(self):
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'apiuser')

    def test_meall_endpoint_returns_profile(self):
        response = self.client.get('/api/users/meall/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('profile', response.data)

    def test_unauthenticated_access_denied(self):
        self.client.credentials()
        response = self.client.get('/api/clients/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_registration(self):
        self.client.credentials()
        response = self.client.post('/api/users/', {
            'username': 'newuser',
            'email': 'new@test.com',
            'password': 'StrongPass123!',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_registration_weak_password(self):
        self.client.credentials()
        response = self.client.post('/api/users/', {
            'username': 'weakuser',
            'email': 'weak@test.com',
            'password': '123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
