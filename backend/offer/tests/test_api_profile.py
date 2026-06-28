"""Tests for profile and main page API endpoints."""
from rest_framework import status

from offer.models import Item
from offer.tests.base import BaseAPITest


class ProfileAPITests(BaseAPITest):
    def test_get_profile(self):
        self.user.profile.company_name = 'ООО Тест'
        self.user.profile.inn = '7707083893'
        self.user.profile.save()
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        profile_data = results[0]
        self.assertEqual(profile_data['company_name'], 'ООО Тест')
        self.assertEqual(profile_data['inn'], '7707083893')

    def test_update_profile(self):
        profile = self.user.profile
        response = self.client.patch(
            f'/api/profile/{profile.id}/',
            {'company_name': 'ООО Новая Компания'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profile.refresh_from_db()
        self.assertEqual(
            profile.company_name, 'ООО Новая Компания'
        )

    def test_profile_main_endpoint(self):
        self.user.profile.company_name = 'Моя Компания'
        self.user.profile.save()
        Item.objects.create(
            title='Test Item', price_retail=1000.0,
            private_type=False,
        )
        response = self.client.get('/api/profile-main/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MainPageAPITests(BaseAPITest):
    def test_main_page_public(self):
        self.client.credentials()
        response = self.client.get('/api/main-page/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count_items', response.data)
