# -*- coding: utf-8 -*-
from unidecode import unidecode
from django.db import migrations
from django.utils.text import slugify


def generate_slugs(apps, schema_editor):
    Item = apps.get_model('offer', 'Item')  # замените 'offer' на имя вашего приложения
    db_alias = schema_editor.connection.alias

    items = Item.objects.using(db_alias).all()
    for item in items:
        if not item.slug:
            base_slug = slugify(unidecode(item.title))
            slug = base_slug
            counter = 1
            # Проверяем уникальность среди уже обработанных и существующих
            while Item.objects.using(db_alias).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            item.slug = slug
            item.save(update_fields=['slug'])


def reverse_func(apps, schema_editor):
    # Обратная миграция: можно оставить пустой или обнулить slug
    Item = apps.get_model('offer', 'Item')
    db_alias = schema_editor.connection.alias
    Item.objects.using(db_alias).update(slug='')


class Migration(migrations.Migration):
    dependencies = [
        ('offer', '0022_item_is_deleted_item_slug'),  # ← ЗАМЕНИТЕ на последнюю миграцию вашего приложения
    ]

    operations = [
        migrations.RunPython(generate_slugs, reverse_func),
    ]