import base64
import csv
import io
import os
import shutil
import zipfile

from django.contrib import admin, messages
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.base import ContentFile
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.urls import path
from django import forms
from mptt.admin import MPTTModelAdmin

from .models import (
    Item,
    ItemUser,
    Group,
    OfferForCustomer,
    OfferItems,
    Client,
    Profile,
    Brand
)


# ---------------------------------------------------------------------------
# Вспомогательные функции для импорта
# ---------------------------------------------------------------------------

def get_tmp_dir():
    """Временная директория для промежуточных файлов импорта."""
    tmp_dir = os.path.join(settings.MEDIA_ROOT, 'import_tmp')
    os.makedirs(tmp_dir, exist_ok=True)
    return tmp_dir


def parse_csv(content):
    """Парсит CSV-файл из строки. Поддерживает 8 и 9 колонок."""
    reader = csv.reader(content.splitlines())
    items = []
    for row in reader:
        if len(row) not in (8, 9):
            continue
        if len(row) == 9:
            item = {
                'title': row[0].strip(),
                'brand': row[1].strip(),
                'price_retail': row[2].strip(),
                'description': row[3].strip(),
                'description_general': row[4].strip(),
                'quantity_type': row[6].strip(),
                'item_type': row[7].strip(),
                'image': row[8].strip(),
            }
        else:
            item = {
                'title': row[0].strip(),
                'brand': row[1].strip(),
                'price_retail': row[2].strip(),
                'description': row[3].strip(),
                'description_general': '',
                'quantity_type': row[5].strip(),
                'item_type': row[6].strip(),
                'image': row[7].strip(),
            }
        items.append(item)
    return items


def validate_items(parsed_items, groups, brand_override=None):
    """Валидация каждой строки. Возвращает список dict с полем status."""
    existing_titles = set(Item.objects.values_list('title', flat=True))
    brands_cache = {b.title: b for b in Brand.objects.all()}
    groups_cache = {g.pk: g for g in Group.objects.all()}
    results = []
    for item in parsed_items:
        errors = []
        status = 'create'

        if item['title'] in existing_titles:
            status = 'skip'
            errors.append('Товар уже существует')

        brand = None
        brand_found = True
        brand_name = brand_override or item['brand']
        if brand_name:
            brand = brands_cache.get(brand_name)
            if not brand:
                brand_found = False
                status = 'error'
                errors.append(f'Бренд «{brand_name}» не найден в базе')

        try:
            price = float(item['price_retail'].replace(' ', '').replace(',', '.'))
        except (ValueError, AttributeError):
            status = 'error'
            errors.append(f'Неверная цена: {item["price_retail"]}')

        has_image = bool(item.get('image'))

        results.append({
            **item,
            'price_valid': price if 'price_valid' not in errors else 0,
            'brand_obj': brand,
            'brand_found': brand_found,
            'status': status,
            'errors': errors,
            'has_image': has_image,
        })
    return results


# ---------------------------------------------------------------------------
# Формы
# ---------------------------------------------------------------------------

class ImportUploadForm(forms.Form):
    csv_file = forms.FileField(label='CSV-файл')
    zip_file = forms.FileField(
        label='ZIP-архив с фото',
        required=False,
    )
    groups = forms.MultipleChoiceField(
        label='Категории',
        widget=forms.CheckboxSelectMultiple,
        choices=[],
    )
    brand_override = forms.CharField(
        label='Бренд (переопределить)',
        required=False,
        max_length=100,
    )
    item_type = forms.ChoiceField(
        label='Тип',
        choices=[('product', 'Товар'), ('service', 'Услуга')],
        initial='product',
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['groups'].choices = [
            (g.pk, g.title) for g in Group.objects.all()
        ]


# ---------------------------------------------------------------------------
# Views (обёрнуты в staff_member_required)
# ---------------------------------------------------------------------------

@staff_member_required
def import_view(request):
    """Шаг 1: Форма загрузки CSV + ZIP."""
    if request.method == 'POST':
        form = ImportUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES['csv_file']
            zip_file = request.FILES.get('zip_file')

            csv_content = csv_file.read().decode('utf-8-sig')
            parsed = parse_csv(csv_content)

            if not parsed:
                messages.error(request, 'CSV-файл пуст или имеет неверный формат')
                return render(request, 'admin/offer/item/import_items.html', {
                    'form': form,
                })

            # Удаляем старые временные файлы если были
            old_paths = request.session.get('import_paths')
            if old_paths:
                for path_key in ('csv', 'zip'):
                    p = old_paths.get(path_key)
                    if p and os.path.exists(p):
                        os.remove(p)

            # Сохраняем временные файлы
            tmp_dir = get_tmp_dir()
            session_key = request.session.session_key
            csv_path = os.path.join(tmp_dir, f'{session_key}.csv')
            zip_path = os.path.join(tmp_dir, f'{session_key}.zip')

            with open(csv_path, 'w', encoding='utf-8', newline='') as f:
                f.write(csv_content)

            if zip_file:
                with open(zip_path, 'wb') as f:
                    for chunk in zip_file.chunks():
                        f.write(chunk)

            groups = form.cleaned_data['groups']
            brand_override = form.cleaned_data['brand_override'].strip()
            item_type = form.cleaned_data['item_type']

            # Валидация
            validated = validate_items(parsed, groups, brand_override)

            request.session['import_paths'] = {
                'csv': csv_path,
                'zip': zip_path if zip_file else '',
                'groups': [int(g) for g in groups],
                'brand_override': brand_override,
                'item_type': item_type,
            }

            return redirect('admin:offer_item_import_preview')

    form = ImportUploadForm()
    return render(request, 'admin/offer/item/import_items.html', {
        'form': form,
    })


@staff_member_required
def preview_view(request):
    """Шаг 2: Превью таблица."""
    import_paths = request.session.get('import_paths')
    if not import_paths:
        messages.error(request, 'Нет данных для превью. Начните заново.')
        return redirect('admin:offer_item_import')

    with open(import_paths['csv'], 'r', encoding='utf-8') as f:
        csv_content = f.read()
    parsed = parse_csv(csv_content)

    groups = import_paths['groups']
    brand_override = import_paths['brand_override']
    validated = validate_items(parsed, groups, brand_override)

    # ZIP-информация + картинки как base64
    zip_names = []
    zip_images = {}
    if import_paths.get('zip') and os.path.exists(import_paths['zip']):
        try:
            with zipfile.ZipFile(import_paths['zip'], 'r') as zf:
                zip_names = [n for n in zf.namelist()
                             if n.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
                for name in zip_names:
                    ext = name.rsplit('.', 1)[-1].lower()
                    mime = {'jpg': 'jpeg', 'jpeg': 'jpeg', 'png': 'png', 'gif': 'gif', 'webp': 'webp'}.get(ext, 'jpeg')
                    data = base64.b64encode(zf.read(name)).decode('utf-8')
                    zip_images[name] = f'data:image/{mime};base64,{data}'
        except zipfile.BadZipFile:
            pass

    # Подсчёт
    count_create = sum(1 for v in validated if v['status'] == 'create')
    count_skip = sum(1 for v in validated if v['status'] == 'skip')
    count_error = sum(1 for v in validated if v['status'] == 'error')

    return render(request, 'admin/offer/item/import_preview.html', {
        'items': validated,
        'total': len(validated),
        'count_create': count_create,
        'count_skip': count_skip,
        'count_error': count_error,
        'zip_names': zip_names,
        'zip_images': zip_images,
        'groups': groups,
    })


@staff_member_required
def do_import_view(request):
    """Шаг 3: Выполнение импорта."""
    if request.method != 'POST':
        return redirect('admin:offer_item_import')

    import_paths = request.session.get('import_paths')
    if not import_paths:
        messages.error(request, 'Нет данных для импорта. Начните заново.')
        return redirect('admin:offer_item_import')

    with open(import_paths['csv'], 'r', encoding='utf-8') as f:
        csv_content = f.read()
    parsed = parse_csv(csv_content)

    groups = import_paths['groups']
    brand_override = import_paths['brand_override']
    item_type = import_paths['item_type']
    validated = validate_items(parsed, groups, brand_override)

    selected = request.POST.getlist('selected')
    group_objs = list(Group.objects.filter(pk__in=groups))

    # ZIP для картинок
    zip_file = None
    if import_paths.get('zip') and os.path.exists(import_paths['zip']):
        zip_file = zipfile.ZipFile(import_paths['zip'], 'r')

    created = 0
    skipped = 0
    errors = 0
    error_messages = []

    for idx in selected:
        item_data = validated[int(idx)]

        if item_data['status'] != 'create':
            skipped += 1
            continue

        brand = item_data.get('brand_obj')

        try:
            item = Item.objects.create(
                title=item_data['title'],
                brand=brand,
                price_retail=float(item_data['price_valid']),
                description=item_data['description'],
                description_general=item_data['description_general'],
                quantity_type=item_data['quantity_type'],
                item_type=item_type,
            )
            item.group.set(group_objs)

            # Картинка из ZIP
            image_name = item_data.get('image', '')
            if zip_file and image_name:
                try:
                    image_bytes = zip_file.read(image_name)
                    item.image.save(
                        os.path.basename(image_name),
                        ContentFile(image_bytes),
                        save=True,
                    )
                except KeyError:
                    pass

            created += 1
        except Exception as e:
            errors += 1
            error_messages.append(f'{item_data["title"]}: {e}')

    if zip_file:
        zip_file.close()

    # Очистка временных файлов
    for path_key in ('csv', 'zip'):
        p = import_paths.get(path_key)
        if p and os.path.exists(p):
            os.remove(p)

    request.session.pop('import_paths', None)

    return render(request, 'admin/offer/item/import_result.html', {
        'created': created,
        'skipped': skipped,
        'errors': errors,
        'error_messages': error_messages,
    })


# ---------------------------------------------------------------------------
# Django Admin
# ---------------------------------------------------------------------------

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'author',
        'inn',
        'address_reg'
    )


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'title',
        'description',
        'brand',
        'price_retail',
        'private_type',
        'item_type',
    )
    change_list_template = 'admin/offer/item/change_list.html'

    def get_urls(self):
        custom_urls = [
            path('import/', self.admin_site.admin_view(import_view),
                 name='offer_item_import'),
            path('import/preview/', self.admin_site.admin_view(preview_view),
                 name='offer_item_import_preview'),
            path('import/do/', self.admin_site.admin_view(do_import_view),
                 name='offer_item_import_do'),
        ]
        return custom_urls + super().get_urls()


@admin.register(ItemUser)
class ItemUserAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'author',
        'title',
        'description',
        # 'group',
        'price_retail',
        'private_type',
    )


@admin.register(OfferForCustomer)
class OfferForCustomerAdmin(admin.ModelAdmin):
    list_display = (
        'name_offer',
        'author',
        'name_client',
        'id',
        'created',
        'status_type',
    )


@admin.register(OfferItems)
class OfferItemsAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'offer',
        'position',
        'item',
        'amount',
        'item_price_retail',
        'item_price_purchase'
    )


class GroupAdmin(MPTTModelAdmin):
    prepopulated_fields = {
        "slug": ("title",)
    }


admin.site.register(Group, GroupAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Интерфейс админ-зоны модели пользователя."""

    list_display = ('pk', 'user', 'ogrn', 'inn')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Интерфейс админ-зоны модели пользователя."""

    list_display = ('pk', 'title', 'description', 'image')