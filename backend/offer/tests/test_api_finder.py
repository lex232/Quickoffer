"""Tests for items finder (search) API endpoint."""
from django.contrib.auth.models import User
from rest_framework import status

from offer.models import Brand, Item, ItemUser
from offer.tests.base import BaseAPITest


class ItemFinderUnauthTests(BaseAPITest):
    """Поиск без авторизации — только публичные товары."""

    def setUp(self):
        super().setUp()
        self.client.credentials()
        self.public = Item.objects.create(
            title='Камера DS-2CD2147G2-L',
            price_retail=8500.0,
            private_type=False,
        )
        self.private_other = Item.objects.create(
            title='Камера DH-IPC-HFW1439T1P-A-IL',
            price_retail=5000.0,
            private_type=True,
        )

    def test_unauth_sees_only_public(self):
        response = self.client.get('/api/itemsfinder/?item=Камера')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [i['title'] for i in response.data]
        self.assertIn('Камера DS-2CD2147G2-L', titles)
        self.assertNotIn('Камера DH-IPC-HFW1439T1P-A-IL', titles)

    def test_unauth_no_user_items(self):
        user2 = User.objects.create_user(
            username='other', password='testpass123'
        )
        ItemUser.objects.create(
            title='Мой приватный товар',
            price_retail=100.0,
            private_type=True,
            author=user2,
        )
        response = self.client.get('/api/itemsfinder/?item=Мой')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_unauth_no_deleted_items(self):
        Item.objects.create(
            title='Удалённая камера',
            price_retail=3000.0,
            private_type=False,
            is_deleted=True,
        )
        response = self.client.get('/api/itemsfinder/?item=Удалённая')
        self.assertEqual(len(response.data), 0)


class ItemFinderAuthTests(BaseAPITest):
    """Поиск с авторизацией — публичные + свои приватные."""

    def setUp(self):
        super().setUp()
        self.other_user = User.objects.create_user(
            username='other', password='testpass123'
        )
        self.public = Item.objects.create(
            title='Камера DS-2CD2147G2-L',
            price_retail=8500.0,
            private_type=False,
        )
        self.my_item = ItemUser.objects.create(
            title='Мой приватный товар',
            price_retail=2500.0,
            private_type=True,
            author=self.user,
        )
        self.other_item = ItemUser.objects.create(
            title='Чужой приватный товар',
            price_retail=3000.0,
            private_type=True,
            author=self.other_user,
        )

    def test_auth_sees_public_items(self):
        response = self.client.get('/api/itemsfinder/?item=Камера')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [i['title'] for i in response.data]
        self.assertIn('Камера DS-2CD2147G2-L', titles)

    def test_auth_sees_own_private_items(self):
        response = self.client.get('/api/itemsfinder/?item=Мой')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [i['title'] for i in response.data]
        self.assertIn('Мой приватный товар', titles)

    def test_auth_does_not_see_other_private_items(self):
        response = self.client.get('/api/itemsfinder/?item=Чужой')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_auth_combined_results(self):
        """Публичные + свои приватные в одном запросе."""
        response = self.client.get('/api/itemsfinder/?item=')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [i['title'] for i in response.data]
        self.assertIn('Камера DS-2CD2147G2-L', titles)
        self.assertIn('Мой приватный товар', titles)
        self.assertNotIn('Чужой приватный товар', titles)

    def test_auth_no_deleted_items(self):
        ItemUser.objects.create(
            title='Мой удалённый товар',
            price_retail=100.0,
            private_type=True,
            is_deleted=True,
            author=self.user,
        )
        response = self.client.get('/api/itemsfinder/?item=Мой удалённый')
        titles = [i['title'] for i in response.data]
        self.assertNotIn('Мой удалённый товар', titles)

    def test_search_contains(self):
        """Поиск по вхождению в название (contains)."""
        Item.objects.create(
            title='Кабель UTP Cat5e',
            price_retail=200.0,
            private_type=False,
        )
        response = self.client.get('/api/itemsfinder/?item=UTP')
        titles = [i['title'] for i in response.data]
        self.assertIn('Кабель UTP Cat5e', titles)
        self.assertNotIn('Камера DS-2CD2147G2-L', titles)

    def test_no_duplicates(self):
        """Один товар не дублируется в выдаче."""
        response = self.client.get('/api/itemsfinder/?item=Камера')
        titles = [i['title'] for i in response.data]
        self.assertEqual(titles.count('Камера DS-2CD2147G2-L'), 1)

    def test_empty_query_returns_all(self):
        response = self.client.get('/api/itemsfinder/?item=')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)
