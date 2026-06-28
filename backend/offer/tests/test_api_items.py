"""Tests for items API endpoints."""
from django.contrib.auth.models import User
from rest_framework import status

from offer.models import Brand, Group, Item, ItemUser
from offer.tests.base import BaseAPITest


class ItemAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.brand = Brand.objects.create(title='Hikvision')
        self.group = Group.objects.create(
            title='Камеры', slug='cameras',
            description='', cat_type='product'
        )
        self.item = Item.objects.create(
            title='Камера DS-2CD2T47G2-L',
            price_retail=8500.0,
            brand=self.brand,
            private_type=False,
        )

    def test_list_public_items(self):
        Item.objects.create(
            title='Приватный товар', price_retail=100.0,
            private_type=True
        )
        response = self.client.get('/api/items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [i['title'] for i in response.data['results']]
        self.assertIn('Камера DS-2CD2T47G2-L', titles)
        self.assertNotIn('Приватный товар', titles)

    def test_item_detail_by_slug(self):
        response = self.client.get(
            f'/api/itemdetail/{self.item.slug}/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.item.title)

    def test_find_items(self):
        response = self.client.get(
            '/api/itemsfinder/?item=Камера'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_item_filter_by_brand(self):
        brand2 = Brand.objects.create(title='Dahua')
        Item.objects.create(
            title='Dahua Camera', price_retail=7000.0,
            brand=brand2, private_type=False
        )
        response = self.client.get(
            f'/api/items/?brand={self.brand.id}'
        )
        titles = [i['title'] for i in response.data['results']]
        self.assertIn('Камера DS-2CD2T47G2-L', titles)
        self.assertNotIn('Dahua Camera', titles)

    def test_item_filter_empty_brand_returns_none(self):
        response = self.client.get('/api/items/?brand=')
        self.assertEqual(len(response.data['results']), 0)


class ItemUserAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.group = Group.objects.create(
            title='Камеры', slug='cameras',
            description='', cat_type='product'
        )

    def test_create_user_item(self):
        response = self.client.post('/api/itemsuser/', {
            'title': 'Мой товар',
            'price_retail': 2500.0,
            'item_type': 'product',
            'quantity_type': 'pc',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'Мой товар')

    def test_list_user_items_only_own(self):
        other_user = User.objects.create_user(
            username='other', password='testpass123'
        )
        ItemUser.objects.create(
            title='My Item', price_retail=100.0,
            author=self.user
        )
        ItemUser.objects.create(
            title='Other Item', price_retail=200.0,
            author=other_user
        )
        response = self.client.get('/api/itemsuser/')
        results = response.data['results']
        titles = [i['title'] for i in results]
        self.assertIn('My Item', titles)
        self.assertNotIn('Other Item', titles)

    def test_update_user_item(self):
        item = ItemUser.objects.create(
            title='Old Title', price_retail=1000.0,
            author=self.user
        )
        response = self.client.patch(
            f'/api/itemsuser/{item.id}/',
            {'title': 'New Title', 'price_retail': 2000.0}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.title, 'New Title')

    def test_delete_user_item(self):
        item = ItemUser.objects.create(
            title='To Delete', price_retail=500.0,
            author=self.user
        )
        response = self.client.delete(f'/api/itemsuser/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
