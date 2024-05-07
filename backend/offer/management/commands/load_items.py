"""Скрипт загрузки категорий в БД"""
import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from offer.models import Item, Group

temp_dir = 'akkymylyator-page1'
# Видеорегистраторы
# Контроль доступа
# Микрофоны
# Замки для домофонов
# Домофоны
# Накопители информации
# Разъёмы
# Камеры видеонаблюдения
# Вызывные панели
# Кабель
# Блоки питания
# Аккумуляторы
# CATS = ["Камеры видеонаблюдения", "Камеры цифровые IP 2 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры цифровые IP 4 Mpix"]
CATS = ["Аккумуляторы"]


DATA_FILES = {
    Item: f'{temp_dir}/result.csv',
}

FIELDS = {
    Item: [
        'title',
        'price_retail',
        'description',
        'group',
        'quantity_type',
        'item_type',
        'image',
    ],
}


class Command(BaseCommand):
    """Заполняет БД данными из файлов словаря DATA_FILES"""

    def handle(self, *args, **kwargs):
        for model, csv_f in DATA_FILES.items():
            with open(
                f'{settings.BASE_DIR}/demo/{csv_f}',
                'r',
                encoding='utf-8'
            ) as csv_file:
                reader = csv.reader(csv_file)
                for data in reader:
                    dict_for_record = {}
                    for i in range(len(data)):
                        if FIELDS.get(model)[i] == 'group':
                            temp_group = []
                            for group in CATS:
                            # obj = Group.objects.get(pk=int(data[i]))
                                obj = Group.objects.get(title=group)
                                temp_group.append(obj)
                            print('Полученные группы ', temp_group)
                            dict_for_record.setdefault(
                                FIELDS.get(model)[i],
                                temp_group
                            )
                        if FIELDS.get(model)[i] == 'image':
                            image = f'media/item/image/{data[i]}'
                            dict_for_record.setdefault(
                                FIELDS.get(model)[i],
                                image
                            )
                        else:
                            dict_for_record.setdefault(
                                FIELDS.get(model)[i],
                                data[i]
                            )
                    temp_model = model.objects.create(
                        title=dict_for_record.get('title'),
                        price_retail=dict_for_record.get('price_retail'),
                        description=dict_for_record.get('description'),
                        quantity_type=dict_for_record.get('quantity_type'),
                        item_type=dict_for_record.get('item_type'),
                        image=dict_for_record.get('image')
                    )
                    temp_model.group.set(dict_for_record.get('group'))
        self.stdout.write('Данные в БД успешно загружены')
