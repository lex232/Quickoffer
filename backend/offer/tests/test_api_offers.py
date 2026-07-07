"""Tests for offers API endpoints and document downloads."""
from unittest.mock import patch, MagicMock
from django.contrib.auth.models import User
from rest_framework import status

from offer.models import Client, Brand, Item, OfferForCustomer, OfferItems
from offer.tests.base import BaseAPITest


class OfferAPITests(BaseAPITest):
    def setUp(self):
        super().setUp()
        self.client_model = Client.objects.create(
            title='ООО Покупатель', author=self.user
        )
        self.brand = Brand.objects.create(title='Hikvision')
        self.item = Item.objects.create(
            title='Камера', price_retail=10000.0,
            brand=self.brand, private_type=False,
        )

    def test_create_offer_with_items(self):
        response = self.client.post('/api/offers/', {
            'name_offer': 'Тестовое КП',
            'name_client': self.client_model.id,
            'status_type': 'in_edit',
            'items_for_offer': [
                {
                    'id': self.item.id,
                    'position': 1,
                    'item_price_retail': 10000.0,
                    'item_price_purchase': 8000.0,
                    'amount': 2,
                }
            ],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name_offer'], 'Тестовое КП')
        self.assertIsNotNone(response.data['id'])

    def test_create_offer_with_multiple_items(self):
        item2 = Item.objects.create(
            title='Кабель', price_retail=500.0,
            private_type=False,
        )
        response = self.client.post('/api/offers/', {
            'name_offer': 'КП с двумя товарами',
            'name_client': self.client_model.id,
            'status_type': 'in_edit',
            'items_for_offer': [
                {
                    'id': self.item.id,
                    'position': 1,
                    'item_price_retail': 10000.0,
                    'item_price_purchase': 8000.0,
                    'amount': 1,
                },
                {
                    'id': item2.id,
                    'position': 2,
                    'item_price_retail': 500.0,
                    'item_price_purchase': 400.0,
                    'amount': 100,
                }
            ],
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            float(response.data['final_price']), 60000.0
        )

    def test_create_offer_duplicate_items_fails(self):
        response = self.client.post('/api/offers/', {
            'name_offer': 'КП с дубликатом',
            'status_type': 'in_edit',
            'items_for_offer': [
                {
                    'id': self.item.id,
                    'position': 1,
                    'item_price_retail': 10000.0,
                    'item_price_purchase': 8000.0,
                    'amount': 1,
                },
                {
                    'id': self.item.id,
                    'position': 2,
                    'item_price_retail': 5000.0,
                    'item_price_purchase': 4000.0,
                    'amount': 1,
                }
            ],
        }, format='json')
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_create_offer_with_zero_amount_fails(self):
        response = self.client.post('/api/offers/', {
            'name_offer': 'КП с нулем',
            'status_type': 'in_edit',
            'items_for_offer': [
                {
                    'id': self.item.id,
                    'position': 1,
                    'item_price_retail': 10000.0,
                    'item_price_purchase': 8000.0,
                    'amount': 0,
                }
            ],
        }, format='json')
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST
        )

    def test_list_offers_only_own(self):
        OfferForCustomer.objects.create(
            author=self.user, name_offer='My Offer'
        )
        other_user = User.objects.create_user(
            username='other', password='testpass123'
        )
        OfferForCustomer.objects.create(
            author=other_user, name_offer='Their Offer'
        )
        response = self.client.get('/api/offers/')
        results = response.data['results']
        titles = [o['name_offer'] for o in results]
        self.assertIn('My Offer', titles)
        self.assertNotIn('Their Offer', titles)

    def test_update_offer(self):
        offer = OfferForCustomer.objects.create(
            author=self.user, name_offer='Old Offer',
            status_type='in_edit',
        )
        response = self.client.patch(
            f'/api/offers/{offer.id}/',
            {
                'name_offer': 'Updated Offer',
                'items_for_offer': [],
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        offer.refresh_from_db()
        self.assertEqual(offer.name_offer, 'Updated Offer')

    def test_delete_offer(self):
        offer = OfferForCustomer.objects.create(
            author=self.user, name_offer='To Delete'
        )
        response = self.client.delete(f'/api/offers/{offer.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_retrieve_offer_returns_items(self):
        offer = OfferForCustomer.objects.create(
            author=self.user, name_offer='Full КП',
            name_client=self.client_model,
            final_price=20000.0,
        )
        OfferItems.objects.create(
            offer=offer, item=self.item,
            amount=2, item_price_retail=10000.0,
            item_price_purchase=8000.0,
        )
        response = self.client.get(f'/api/offers/{offer.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name_offer'], 'Full КП'
        )
        self.assertEqual(
            float(response.data['final_price']), 20000.0
        )
        self.assertIn('items_for_offer', response.data)

    def test_offer_filter_by_status(self):
        OfferForCustomer.objects.create(
            author=self.user, name_offer='Edit',
            status_type='in_edit'
        )
        OfferForCustomer.objects.create(
            author=self.user, name_offer='Sent',
            status_type='in_process'
        )
        response = self.client.get(
            '/api/offers/?status_type=in_edit'
        )
        results = response.data['results']
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name_offer'], 'Edit')


class OfferDocumentDownloadTests(BaseAPITest):
    """Tests for document download endpoints."""

    def setUp(self):
        super().setUp()
        self.client_model = Client.objects.create(
            title='ООО Покупатель', author=self.user,
            company_type='ooo', inn='7707083893',
        )
        self.item = Item.objects.create(
            title='Камера', price_retail=10000.0,
            private_type=False,
        )
        self.user.profile.company_name = 'Исполнитель'
        self.user.profile.inn = '1234567890'
        self.user.profile.save()
        self.offer = OfferForCustomer.objects.create(
            author=self.user, name_offer='Документ КП',
            name_client=self.client_model,
            final_price=20000.0,
            final_price_goods=20000.0,
            final_price_work=0.0,
        )
        OfferItems.objects.create(
            offer=self.offer, item=self.item,
            amount=2, item_price_retail=10000.0,
            item_price_purchase=8000.0,
        )

    @patch('offer.services.offer_doc.DocxTemplate')
    def test_download_doc(self, mock_docx):
        mock_instance = MagicMock()
        mock_docx.return_value = mock_instance
        mock_instance.get_xml.return_value = b'<doc></doc>'
        response = self.client.get(
            f'/api/offers/{self.offer.id}/download_doc/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(
            'application/vnd.openxmlformats',
            response['Content-Type']
        )

    @patch('offer.services.base.DocxTemplate')
    def test_download_bill_items(self, mock_docx):
        mock_instance = MagicMock()
        mock_docx.return_value = mock_instance
        mock_instance.get_xml.return_value = b'<doc></doc>'
        response = self.client.get(
            f'/api/offers/{self.offer.id}/download_bill_items/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('offer.services.base.DocxTemplate')
    def test_download_contract_items(self, mock_docx):
        mock_instance = MagicMock()
        mock_docx.return_value = mock_instance
        mock_instance.get_xml.return_value = b'<doc></doc>'
        response = self.client.get(
            f'/api/offers/{self.offer.id}/download_contract_items/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('offer.services.base.DocxTemplate')
    def test_download_torg12(self, mock_docx):
        mock_instance = MagicMock()
        mock_docx.return_value = mock_instance
        mock_instance.get_xml.return_value = b'<doc></doc>'
        response = self.client.get(
            f'/api/offers/{self.offer.id}/download_torg12/'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_download_unauthorized_offer_fails(self):
        response = self.client.get('/api/offers/99999/download_doc/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
