"""
Модели приложения offer
"""
import os
from datetime import datetime

from PIL import Image

from django.db import models
from django.contrib.auth import get_user_model
from django.core import validators
from django.urls import reverse
from django.db.models.signals import post_delete
from django.dispatch import receiver
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField
from django.utils.text import slugify
from unidecode import unidecode

User = get_user_model()
ORGANIZATION_TYPE = [
    ('ip', 'ИП'),
    ('ooo', 'ООО'),
    ('fiz', 'Физическое лицо'),
]
CHOICE_TYPE = [
    ('pc', 'шт.'),
    ('meters', 'м.'),
    ('kms', 'км.'),
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
    ('denied', 'отказано'),
]


def item_upload_to(instance, filename):
    """Путь загрузки картинок товаров: user/{username}/{date}/ или catalog/{date}/"""
    date = datetime.now().strftime('%Y-%m-%d')
    if hasattr(instance, 'author') and instance.author:
        return f'item/user/{instance.author.username}/{date}/{filename}'
    return f'item/catalog/{date}/{filename}'


def item_min_upload_to(instance, filename):
    """Путь загрузки миниатюр: рядом с оригиналом, суффикс _min"""
    name, ext = os.path.splitext(filename)
    return item_upload_to(instance, f'{name}_min{ext}')


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
    bik = models.CharField(
        verbose_name='БИК',
        max_length=200,
        null=True,
        blank=True
    )
    ruk = models.CharField(
        verbose_name='Руководитель (подписант)',
        max_length=200,
        null=True,
        blank=True
    )
    pub_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'клиент'
        verbose_name_plural = 'клиенты'
        ordering = ['-pub_date']

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
    position = models.PositiveSmallIntegerField(
        verbose_name='позиция',
        null=True,
        blank=True,
        default=999
    )
    cat_type = models.CharField(
        verbose_name='тип категории: товар или услуга',
        max_length=20,
        db_index=True,
        choices=ITEM_TYPE,
        default=ITEM_TYPE[0][0]
    )

    class MPTTMeta:
        # order_insertion_by = ['title']
        order_insertion_by = ['position']

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
        upload_to='media/brand/image',
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
    slug = models.SlugField(
        verbose_name='слаг товара',
        max_length=150,
        unique=True,
        blank=True,
    )
    brand = models.ForeignKey(
        Brand,
        verbose_name='брэнд товара',
        on_delete=models.SET_NULL,
        related_name='brand_item',
        blank=True,
        null=True,
    )
    description = models.TextField(
        verbose_name='описание техническое',
        null=True,
        blank=True
    )
    description_general = models.TextField(
        verbose_name='описание обычное',
        null=True,
        blank=True
    )
    group = TreeManyToManyField(
        'Group',
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
        upload_to=item_upload_to,
        null=True,
        blank=True
    )
    image_min = models.ImageField(
        verbose_name='миниатюра 150х150',
        upload_to=item_min_upload_to,
        null=True,
        blank=True,
        editable=False
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
    is_deleted = models.BooleanField(
        verbose_name='Мягкое удаление',
        default=False,
        db_index=True
    )

    objects = models.Manager()

    # Кастомный менеджер для "активных" (не удалённых) объектов
    class ActiveManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(is_deleted=False)

    active = ActiveManager()

    class Meta:
        verbose_name = 'товар/ услуга'
        verbose_name_plural = 'товары/ услуги'
        ordering = ['-pub_date', '-pub_time']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_base = slugify(unidecode(self.title))
            slug = slug_base
            counter = 1
            while Item.objects.filter(slug=slug).exists():
                slug = f"{slug_base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

        # Создаём миниатюру 150х150 если есть изображение
        if self.image:
            try:
                img = Image.open(self.image.path)

                # Создаём копию и изменяем размер до 150х150
                img_copy = img.copy()
                img_copy.thumbnail((300, 300), Image.Resampling.LANCZOS)

                # Обрабатываем прозрачность: конвертируем в RGB с белым фоном
                if img_copy.mode in ('RGBA', 'LA', 'P'):
                    # Создаём белый фон
                    background = Image.new('RGB', img_copy.size, (255, 255, 255))
                    # Накладываем изображение на фон с учётом прозрачности
                    if img_copy.mode == 'RGBA':
                        background.paste(img_copy, mask=img_copy.split()[3])  # Альфа-канал
                    elif img_copy.mode == 'LA':
                        background.paste(img_copy, mask=img_copy.split()[1])
                    elif img_copy.mode == 'P':
                        img_copy = img_copy.convert('RGBA')
                        background.paste(img_copy, mask=img_copy.split()[3])
                    img_copy = background

                # Формируем путь для миниатюры: та же папка, имя с суффиксом _min.jpg
                name, _ = os.path.splitext(self.image.path)
                min_path = f"{name}_min.jpg"

                # Сохраняем как JPEG (стандарт для веб-миниатюр)
                img_copy.save(min_path, 'JPEG', quality=100)

                # Обновляем поле image_min
                min_name, _ = os.path.splitext(self.image.name)
                self.image_min = f"{min_name}_min.jpg"
                super().save(update_fields=['image_min'])
            except Exception as e:
                print(f"Ошибка создания миниатюры: {e}")


def user_directory_path(instance, filename):
    # путь, куда будет осуществлена загрузка MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)


class ItemUser(Item):

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='item',
        db_index=True
    )

    class Meta:
        verbose_name = 'товар/ услуга пользовательский'
        verbose_name_plural = 'товары/ услуги пользовательские'
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
        on_delete=models.CASCADE,
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
    final_price = models.FloatField(
        verbose_name='Итого',
        null=True
    )
    final_price_goods = models.FloatField(
        verbose_name='Итого оборудование',
        null=True
    )
    final_price_work = models.FloatField(
        verbose_name='Итого работа',
        null=True
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
        default=0,
    )
    item_price_purchase = models.FloatField(
        verbose_name='закупка',
        null=True,
        default=0,
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
        validators=[
            validators.MinValueValidator(
                1, message='Нельзя добавить меньше 1 штук позиции'
            )
        ]
    )

    class Meta:
        verbose_name = 'количество товара в КП'
        verbose_name_plural = 'количество товаров в КП'
        # Тут еще надо проверить как лучше ордеринг организовать
        ordering = ['position']
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
    bik = models.CharField(
        verbose_name='БИК',
        max_length=200,
        null=True,
        blank=True
    )
    ruk = models.CharField(
        verbose_name='Руководитель (подписант)',
        max_length=200,
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


@receiver(post_delete, sender=Item)
def delete_item_images(sender, instance, **kwargs):
    """Удаление картинок и миниатюр при удалении товара"""
    if instance.image:
        instance.image.delete(save=False)
    if instance.image_min:
        instance.image_min.delete(save=False)