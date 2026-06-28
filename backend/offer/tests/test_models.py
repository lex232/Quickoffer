"""Tests for offer app models."""
from django.test import TestCase
from django.contrib.auth.models import User

from offer.models import (
    Client, Group, Brand, Item, ItemUser,
    OfferForCustomer, OfferItems, Profile
)


class ProfileModelTests(TestCase):
    def test_profile_created_on_user_creation(self):
        user = User.objects.create_user(
            username='testuser', password='testpass123'
        )
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsInstance(user.profile, Profile)

    def test_profile_str(self):
        user = User.objects.create_user(
            username='testuser', password='testpass123'
        )
        self.assertEqual(str(user.profile), 'testuser')

    def test_profile_defaults(self):
        user = User.objects.create_user(
            username='testuser', password='testpass123'
        )
        self.assertEqual(user.profile.company_type, 'ip')
        self.assertEqual(user.profile.image, 'def-avatar.PNG')


class ClientModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='clientuser', password='testpass123'
        )

    def test_client_creation(self):
        client = Client.objects.create(
            title='ООО Тест',
            author=self.user,
            inn='7707083893',
        )
        self.assertEqual(str(client), 'ООО Тест')
        self.assertEqual(client.author, self.user)

    def test_client_ordering(self):
        self.assertEqual(Client._meta.ordering, ['-pub_date'])

    def test_client_all_fields(self):
        client = Client.objects.create(
            title='ИП Иванов',
            author=self.user,
            company_type='ip',
            ogrn='1234567890123',
            inn='123456789012',
            kpp='123456789',
            address_reg='Москва, ул. Тестовая, 1',
            address_post='Москва, а/я 100',
            bill_num='40702810123456789012',
            bill_corr_num='30101810123456789012',
            bank_name='Сбербанк',
            phone_company='+7 (495) 123-45-67',
            bik='044525225',
            ruk='Иванов И.И.',
        )
        self.assertEqual(client.company_type, 'ip')
        self.assertEqual(client.inn, '123456789012')
        self.assertEqual(client.bik, '044525225')


class GroupModelTests(TestCase):
    def test_group_creation_with_slug(self):
        group = Group.objects.create(
            title='Камеры видеонаблюдения',
            slug='cameras',
            description='Все камеры',
        )
        self.assertEqual(str(group), 'Камеры видеонаблюдения')
        self.assertEqual(group.slug, 'cameras')

    def test_group_tree_creation(self):
        parent = Group.objects.create(
            title='Оборудование', slug='equipment', description=''
        )
        child = Group.objects.create(
            title='Камеры', slug='cameras',
            description='', parent=parent
        )
        self.assertEqual(child.parent, parent)
        self.assertIn(child, parent.get_children())

    def test_group_unique_slug_per_parent(self):
        parent = Group.objects.create(
            title='Parent', slug='parent', description=''
        )
        Group.objects.create(
            title='Child', slug='child', description='', parent=parent
        )
        with self.assertRaises(Exception):
            Group.objects.create(
                title='Child2', slug='child',
                description='', parent=parent
            )

    def test_group_cat_type_default(self):
        group = Group.objects.create(
            title='Test', slug='test', description=''
        )
        self.assertEqual(group.cat_type, 'product')

    def test_group_position_default(self):
        group = Group.objects.create(
            title='Test', slug='test', description=''
        )
        self.assertEqual(group.position, 999)


class BrandModelTests(TestCase):
    def test_brand_creation(self):
        brand = Brand.objects.create(
            title='Hikvision', description='Производитель камер'
        )
        self.assertEqual(str(brand), 'Hikvision')

    def test_brand_unique_title(self):
        Brand.objects.create(title='Dahua')
        with self.assertRaises(Exception):
            Brand.objects.create(title='Dahua')


class ItemModelTests(TestCase):
    def setUp(self):
        self.brand = Brand.objects.create(title='TestBrand')

    def test_item_creation(self):
        item = Item.objects.create(
            title='Камера тестовая',
            price_retail=5000.0,
            brand=self.brand,
        )
        self.assertEqual(item.title, 'Камера тестовая')
        self.assertEqual(item.price_retail, 5000.0)
        self.assertFalse(item.private_type)
        self.assertFalse(item.is_deleted)

    def test_item_slug_auto_generation(self):
        item = Item.objects.create(
            title='Камера IP 2MP',
            price_retail=3000.0,
        )
        self.assertTrue(item.slug)
        self.assertIn('kamera-ip-2mp', item.slug)

    def test_item_slug_unique(self):
        Item.objects.create(
            title='Камера A', slug='camera-a', price_retail=1000.0
        )
        item2 = Item.objects.create(
            title='Камера B', price_retail=2000.0
        )
        self.assertNotEqual(item2.slug, 'camera-a')
        self.assertIn('kamera-b', item2.slug)

    def test_item_soft_delete(self):
        item = Item.objects.create(
            title='To Delete', price_retail=1000.0
        )
        item.is_deleted = True
        item.save()
        self.assertNotIn(item, Item.active.all())

    def test_item_type_defaults_to_product(self):
        item = Item.objects.create(
            title='Default Type', price_retail=1000.0
        )
        self.assertEqual(item.item_type, 'product')

    def test_item_quantity_type_default(self):
        item = Item.objects.create(
            title='Qty Test', price_retail=1000.0
        )
        self.assertEqual(item.quantity_type, 'pc')


class ItemUserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='itemuser', password='testpass123'
        )

    def test_item_user_creation(self):
        item_user = ItemUser.objects.create(
            title='Мой товар',
            price_retail=1500.0,
            author=self.user,
            private_type=True,
        )
        self.assertEqual(item_user.author, self.user)
        self.assertTrue(item_user.private_type)

    def test_item_user_inherits_item_fields(self):
        item_user = ItemUser.objects.create(
            title='Наследование',
            price_retail=2000.0,
            author=self.user,
        )
        self.assertIsInstance(item_user, Item)
        self.assertEqual(item_user.item_type, 'product')


class OfferForCustomerModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='offeruser', password='testpass123'
        )
        self.client_model = Client.objects.create(
            title='ООО Клиент', author=self.user
        )

    def test_offer_creation(self):
        offer = OfferForCustomer.objects.create(
            author=self.user,
            name_offer='Тестовое КП',
            name_client=self.client_model,
        )
        self.assertIn('Тестовое КП', str(offer))
        self.assertEqual(offer.status_type, 'in_edit')

    def test_offer_price_defaults(self):
        offer = OfferForCustomer.objects.create(
            author=self.user,
            name_offer='КП без цен',
        )
        self.assertIsNone(offer.final_price)
        self.assertIsNone(offer.final_price_goods)
        self.assertIsNone(offer.final_price_work)

    def test_offer_unique_name_per_user(self):
        OfferForCustomer.objects.create(
            author=self.user, name_offer='Уникальное КП'
        )
        with self.assertRaises(Exception):
            OfferForCustomer.objects.create(
                author=self.user, name_offer='Уникальное КП'
            )

    def test_offer_same_name_different_users(self):
        user2 = User.objects.create_user(
            username='user2', password='testpass123'
        )
        OfferForCustomer.objects.create(
            author=self.user, name_offer='Одинаковое КП'
        )
        offer2 = OfferForCustomer.objects.create(
            author=user2, name_offer='Одинаковое КП'
        )
        self.assertIsNotNone(offer2)


class OfferItemsModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='offeritemsuser', password='testpass123'
        )
        self.client_model = Client.objects.create(
            title='Клиент', author=self.user
        )
        self.item = Item.objects.create(
            title='Товар в КП', price_retail=1000.0
        )
        self.offer = OfferForCustomer.objects.create(
            author=self.user, name_offer='КП с товарами'
        )

    def test_offer_items_creation(self):
        offer_item = OfferItems.objects.create(
            offer=self.offer,
            item=self.item,
            amount=5,
            item_price_retail=1000.0,
            item_price_purchase=800.0,
        )
        self.assertEqual(offer_item.amount, 5)
        self.assertEqual(offer_item.item_price_retail, 1000.0)
        self.assertEqual(offer_item.item_price_purchase, 800.0)
        self.assertEqual(offer_item.position, 1)

    def test_offer_items_amount_validation(self):
        offer_item = OfferItems(
            offer=self.offer,
            item=self.item,
            amount=0,
        )
        with self.assertRaises(Exception):
            offer_item.full_clean()

    def test_offer_items_unique_constraint(self):
        OfferItems.objects.create(
            offer=self.offer, item=self.item, amount=1
        )
        with self.assertRaises(Exception):
            OfferItems.objects.create(
                offer=self.offer, item=self.item, amount=2
            )
