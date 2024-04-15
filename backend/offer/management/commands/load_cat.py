"""Скрипт загрузки категорий в БД"""
import csv

from django.conf import settings
from django.core.management.base import BaseCommand

from offer.models import Group


DATA_FILES = {
    Group: 'cats.csv',
}

FIELDS = {
    Group: ['title', 'slug', 'description'],
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
                        dict_for_record.setdefault(
                            FIELDS.get(model)[i],
                            data[i]
                        )
                    model.objects.create(
                        **dict_for_record
                    )
        self.stdout.write('Данные в БД успешно загружены')
