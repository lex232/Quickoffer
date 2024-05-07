"""
Модели приложения offer
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.core import validators
from django.urls import reverse

from PIL import Image
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField

User = get_user_model()
ORGANIZATION_TYPE = [
    ('ip', 'ИП'),
    ('ooo', 'ООО'),
]
CHOICE_TYPE = [
    ('pc', 'шт.'),
    ('meters', 'м.'),
]
ITEM_TYPE = [
    ('product', 'товар'),
    ('service', 'услуга'),
]
STATUS_TYPE = [
    ('in_edit', 'на редактировании'),
    ('in_process', 'КП отправлено'),
    ('in_prepayment', 'получена предоплата'),
    ('in_install', 'в работе'),
    ('in_payment', 'получена оплата'),
]


class Client(models.Model):
    """Модель клиента."""

    title = models.CharField(
        verbose_name='название',
        max_length=200
    )
    company_type = models.CharField(
        verbose_name='тип компании',
        max_length=20,
        null=True,
        choices=ORGANIZATION_TYPE,
        default=ORGANIZATION_TYPE[0][0]
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='client'
    )
    ogrn = models.CharField(
        verbose_name='огрн',
        max_length=200,
        null=True,
        blank=True
    )
    inn = models.CharField(
        verbose_name='инн',
        max_length=200,
        null=True,
        blank=True
    )
    kpp = models.CharField(
        verbose_name='кпп',
        max_length=200,
        null=True,
        blank=True
    )
    address_reg = models.CharField(
        verbose_name='адрес юридической регистрации',
        max_length=200,
        null=True,
        blank=True
    )
    address_post = models.CharField(
        verbose_name='почтовый адрес',
        max_length=200,
        null=True,
        blank=True
    )
    bill_num = models.CharField(
        verbose_name='расчетный счет',
        max_length=200,
        null=True,
        blank=True
    )
    bill_corr_num = models.CharField(
        verbose_name='корреспондентский счет',
        max_length=200,
        null=True,
        blank=True
    )
    bank_name = models.CharField(
        verbose_name='имя банка',
        max_length=200,
        null=True,
        blank=True
    )
    image = models.ImageField(
        verbose_name='изображение',
        upload_to='media/client/image',
        null=True,
        blank=True
    )
    phone_company = models.CharField(
        verbose_name='телефон организации',
        max_length=20,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'клиент'
        verbose_name_plural = 'клиенты'
        ordering = ['-title']

    def __str__(self):
        return self.title


class Group(MPTTModel):
    """Модель категории."""

    title = models.CharField(
        verbose_name='название категории',
        max_length=200,
        unique=True
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
        db_index=True,
        verbose_name='родительская категория'
    )
    slug = models.SlugField(
        max_length=50,
        unique=True
        )
    description = models.TextField()

    class MPTTMeta:
        order_insertion_by = ['title']

    class Meta:
        unique_together = [['parent', 'slug']]
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def get_absolute_url(self):
        return reverse('post-by-category', args=[str(self.slug)])

    def __str__(self):
        return self.title


class Brand(models.Model):
    """Модель бренда"""

    title = models.CharField(
        verbose_name='название бренда',
        max_length=100,
        unique=True
    )
    description = models.TextField(
        verbose_name='описание',
        null=True,
        blank=True
    )
    image = models.ImageField(
        verbose_name='лого бренда',
        upload_to='media/item/image',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'бренд'
        verbose_name_plural = 'бренды'
        ordering = ['-title',]

    def __str__(self):
        return self.title


class Item(models.Model):
    """Модель товара/ услуги абстрактная."""

    title = models.CharField(
        verbose_name='название товара',
        max_length=150,
        unique=True
    )
    brand = models.ForeignKey(
        Brand,
        verbose_name='брэнд товара',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    description = models.TextField(
        verbose_name='описание',
        null=True,
        blank=True
    )
    # group = models.ForeignKey(
    #     Group,
    #     verbose_name='группа товара',
    #     on_delete=models.SET_NULL,
    #     blank=True,
    #     null=True,
    # )
    group = TreeManyToManyField(
        'Group',
        # on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='items',
        verbose_name='Категория'
    )
    pub_date = models.DateField(auto_now_add=True)
    pub_time = models.TimeField(auto_now_add=True)
    price_retail = models.FloatField(
        verbose_name='розничная цена',
    )
    image = models.ImageField(
        verbose_name='изображение товара',
        upload_to='media/item/image',
        null=True,
        blank=True
    )
    quantity_type = models.CharField(
        verbose_name='количественная характеристика',
        max_length=20,
        null=True,
        choices=CHOICE_TYPE,
        default=CHOICE_TYPE[0][0]
    )
    item_type = models.CharField(
        verbose_name='тип - товар или услуга',
        max_length=20,
        db_index=True,
        choices=ITEM_TYPE,
        default=ITEM_TYPE[0][0]
    )
    private_type = models.BooleanField(
        verbose_name='Приватность товара/ услуги',
        default=False,
        db_index=True,
    )

    class Meta:
        verbose_name = 'товар'
        verbose_name_plural = 'товары'
        ordering = ['-pub_date', '-pub_time']

    def __str__(self):
        return self.title


class ItemUser(Item):

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='item',
        db_index=True
    )

    class Meta:
        verbose_name = 'товар пользовательский'
        verbose_name_plural = 'товары пользовательские'
        ordering = ['-pub_date', '-pub_time']


class OfferForCustomer(models.Model):
    """Модель коммерческого предложения."""

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='offer'
    )
    name_offer = models.CharField(
        verbose_name='название КП',
        max_length=250,
    )
    name_client = models.ForeignKey(
        Client,
        verbose_name='Клиент',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    items = models.ManyToManyField(
        Item,
        through='OfferItems',
        related_name='items',
        verbose_name='Товары / услуги'
    )
    created = models.DateTimeField(auto_now_add=True)
    status_type = models.CharField(
        verbose_name='Статус КП',
        max_length=30,
        null=True,
        choices=STATUS_TYPE,
        default='in_edit'
    )

    class Meta:
        verbose_name = 'коммерческое предложение'
        verbose_name_plural = 'коммерческие предложения'
        ordering = ('-created',)
        constraints = [
            models.UniqueConstraint(
                fields=['author', 'name_offer'],
                name='КП с таким именем уже есть!'
            )
        ]

    def __str__(self):
        return str(self.name_offer)[:15] + ': ' + str(self.author)


class OfferItems(models.Model):
    """Модель M2M связь Товар-КП-количество."""

    position = models.PositiveSmallIntegerField(
        verbose_name='позиция',
        null=True,
        default=1
    )
    item_price_retail = models.FloatField(
        verbose_name='розничная цена',
        null=True,
        default=0
    )
    item_price_purchase = models.FloatField(
        verbose_name='закупка',
        null=True,
        default=0
    )
    offer = models.ForeignKey(
        OfferForCustomer,
        on_delete=models.CASCADE,
        related_name='selected_offer'
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='selected_item'
    )
    amount = models.PositiveSmallIntegerField(
        verbose_name='количество',
        default=1,
        validators=(
            validators.MinValueValidator(
                1, message='Нельзя добавить меньше 1 штук позиции'
            ),
        )
    )

    class Meta:
        verbose_name = 'количество товара в КП'
        verbose_name_plural = 'количество товаров в КП'
        ordering = ['-position']
        constraints = [
            models.UniqueConstraint(
                fields=['offer', 'item'],
                name='Такой товар в КП уже есть!'
            )
        ]

    def __str__(self):
        return str(self.offer)[:15] + ': ' + str(self.item)[:15]


class Profile(models.Model):
    """Модель расширения профиля пользователя"""

    user = models.OneToOneField(
        User,
        related_name='profile',
        on_delete=models.CASCADE
    )
    company_name = models.CharField(
        verbose_name='имя компании',
        max_length=200,
        null=True,
        blank=True
    )
    company_name_for_docs = models.CharField(
        verbose_name='имя компании для документов',
        max_length=200,
        null=True,
        blank=True
    )
    company_type = models.CharField(
        verbose_name='тип компании',
        max_length=20,
        null=True,
        choices=ORGANIZATION_TYPE,
        default=ORGANIZATION_TYPE[0][0]
    )
    image = models.ImageField(
        verbose_name='аватар',
        default='def-avatar.PNG',
        upload_to='media/profile-img/',
        null=True,
        blank=True
    )
    ogrn = models.CharField(
        verbose_name='огрн',
        max_length=200,
        null=True,
        blank=True
    )
    inn = models.CharField(
        verbose_name='инн',
        max_length=200,
        null=True,
        blank=True
    )
    kpp = models.CharField(
        verbose_name='кпп',
        max_length=200,
        null=True,
        blank=True
    )
    address_reg = models.CharField(
        verbose_name='адрес юридической регистрации',
        max_length=200,
        null=True,
        blank=True
    )
    address_post = models.CharField(
        verbose_name='почтовый адрес',
        max_length=200,
        null=True,
        blank=True
    )
    bill_num = models.CharField(
        verbose_name='расчетный счет',
        max_length=200,
        null=True,
        blank=True
    )
    bill_corr_num = models.CharField(
        verbose_name='корреспондентский счет',
        max_length=200,
        null=True,
        blank=True
    )
    bank_name = models.CharField(
        verbose_name='имя банка',
        max_length=200,
        null=True,
        blank=True
    )
    phone = models.CharField(
        verbose_name='телефон',
        max_length=20,
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        """Фото профиля компании"""

        super().save()
        img = Image.open(self.image.path)
        if img.height > 400 or img.width > 400:
            new_img = (400, 400)
            img.thumbnail(new_img)
            img.save(self.image.path)

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'
        ordering = ['user']

    def __str__(self):
        return self.user.username