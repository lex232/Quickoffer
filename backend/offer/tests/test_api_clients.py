"""Tests for clients API endpoints."""
from django.contrib.auth.models import User
from rest_framework import status

from offer.models import Client
from offer.tests.base import BaseAPITest


class ClientAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.client_data = {
            'title': 'ООО Ромашка',
            'company_type': 'ooo',
            'inn': '7707083893',
        }

    def test_create_client(self):
        response = self.client.post('/api/clients/', self.client_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'ООО Ромашка')

    def test_list_clients(self):
        Client.objects.create(title='Client A', author=self.user)
        Client.objects.create(title='Client B', author=self.user)
        response = self.client.get('/api/clients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertEqual(len(results), 2)

    def test_list_clients_only_own(self):
        other_user = User.objects.create_user(
            username='other', password='testpass123'
        )
        Client.objects.create(title='My Client', author=self.user)
        Client.objects.create(title='Other Client', author=other_user)
        response = self.client.get('/api/clients/')
        results = response.data['results']
        titles = [c['title'] for c in results]
        self.assertIn('My Client', titles)
        self.assertNotIn('Other Client', titles)

    def test_update_client(self):
        client = Client.objects.create(
            title='Old Name', author=self.user
        )
        response = self.client.patch(
            f'/api/clients/{client.id}/',
            {'title': 'New Name'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        client.refresh_from_db()
        self.assertEqual(client.title, 'New Name')

    def test_delete_client(self):
        client = Client.objects.create(
            title='To Delete', author=self.user
        )
        response = self.client.delete(f'/api/clients/{client.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Client.objects.count(), 0)

    def test_find_client(self):
        Client.objects.create(
            title='ООО Поиск', author=self.user
        )
        response = self.client.get(
            '/api/clientsfinder/?client=ООО'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'ООО Поиск')
