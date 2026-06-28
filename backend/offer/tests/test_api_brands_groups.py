"""Tests for brands and groups API endpoints."""
from rest_framework import status

from offer.models import Brand, Group
from offer.tests.base import BaseAPITest


class BrandAPITests(BaseAPITest):
    def test_list_brands(self):
        Brand.objects.create(title='Hikvision')
        Brand.objects.create(title='Dahua')
        response = self.client.get('/api/brands/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_onlynamesid(self):
        Brand.objects.create(title='Hikvision')
        response = self.client.get('/api/brands/onlynamesid/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], 'Hikvision')
        self.assertIn('id', response.data[0])


class GroupAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.group_product = Group.objects.create(
            title='Камеры', slug='cameras',
            description='', cat_type='product'
        )
        self.group_service = Group.objects.create(
            title='Монтаж', slug='installation',
            description='', cat_type='service'
        )

    def test_groupsitems_only_products(self):
        response = self.client.get('/api/groupsitems/')
        titles = [g['title'] for g in response.data]
        self.assertIn('Камеры', titles)
        self.assertNotIn('Монтаж', titles)

    def test_groupservices_only_services(self):
        response = self.client.get('/api/groupservices/')
        titles = [g['title'] for g in response.data]
        self.assertIn('Монтаж', titles)
        self.assertNotIn('Камеры', titles)

    def test_groupsoncreate_excludes_root(self):
        response = self.client.get('/api/groupsoncreate/')
        for g in response.data:
            self.assertNotEqual(g['title'], 'Камеры')
