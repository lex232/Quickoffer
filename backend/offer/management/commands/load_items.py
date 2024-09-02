"""Скрипт загрузки категорий в БД"""
import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from offer.models import Item, Group, Brand

temp_dir = 'besprovodnaya_ohrannaya_sistema-page1'

# CATS = ["Видеорегистраторы", "Регистраторы CVI формат 4Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры цифровые IP 2 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры CVI 2 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры цифровые IP 4 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры CVI 5 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры TVI 2 Mpix"]
# CATS = ["Камеры видеонаблюдения", "Камеры TVI 5 Mpix"]
# CATS = ["Аккумуляторы"]
# CATS = ["Микрофоны"]
# CATS = ["Домофоны", "Мониторы аналоговые"]
# CATS = ["Домофоны", "Мониторы IP цифровые"]
# CATS = ["Домофоны", "Модуль сопряжения домофона"]
# CATS = ["Блоки питания", "Адаптеры в пластиковом корпусе"]
# CATS = ["Блоки питания", "Бесперебойное питание"]
# CATS = ["Блоки питания", "Уличное исполнение БП"]
# CATS = ["Замки для домофонов", "электромагнитные"]
# CATS = ["Замки для домофонов", "Электромеханические"]
# CATS = ["Замки для домофонов", "Электромеханические"]
# CATS = ["Кабель", "для аналоговой системы"]
# CATS = ["Кабель", "Витая пара"]
# CATS = ["Кабель", "Патч-корд"]
# CATS = ["Кабель", "Шнуры"]
# CATS = ["Накопители информации", "Карты памяти"]
# CATS = ["Накопители информации", "Жесткие диски для видеонаблюдения"]
# CATS = ["Коммутаторы", "POE - коммутаторы"]
# CATS = ["Приемо-передатчики", "Пассивные приемо-передатчики"]
# CATS = ["Разъёмы", "Коннекторы для камер"]
# CATS = ["Разъёмы", "Коннекторы сетевые RJ45"]
# CATS = ["Разъёмы", "Коннекторы питания"]
# CATS = ["Монтажные материалы", "Шкафы"]
# CATS = ["Монтажные материалы", "Монтажные коробки"]
# CATS = ["Вызывные панели", "Аналоговые hd панели"]
# CATS = ["Вызывные панели", "Цифровые IP панели"]
# CATS = ["Видеорегистраторы", "Регистраторы CVI формат 2Mpix"]
# CATS = ["Видеорегистраторы", "Регистраторы IP цифровые 2Mpix"]
# CATS = ["Контроль доступа (СКУД)", "Считыватели карт"]
# CATS = ["Контроль доступа (СКУД)", "Контроллеры СКУД"]
# CATS = ["Контроль доступа (СКУД)", "Карточки/Ключи"]
# CATS = ["Охранные системы", "Пульты Dahua"]
# CATS = ["Охранные системы", "Сирены (Оповещатели) Dahua"]
# CATS = ["Охранные системы", "Центральный модуль Dahua"]
# CATS = ["Охранные системы", "Датчики Dahua"]
# CATS = ["Охранные системы", "Комплекты Dahua"]
CATS = ["Охранные системы", "IMOU охранные решения для дома"]



DATA_FILES = {
    Item: f'{temp_dir}/result.csv',
}

FIELDS = {
    Item: [
        'title',
        'brand',
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
                            if FIELDS.get(model)[i] == 'brand':
                                temp_brand = Brand.objects.get(title=data[i])
                                print('Полученный бренд', temp_brand)
                                dict_for_record.setdefault(
                                    FIELDS.get(model)[i],
                                    temp_brand
                                )
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
                        try:
                            temp_model = model.objects.create(
                                title=dict_for_record.get('title'),
                                brand=dict_for_record.get('brand'),
                                price_retail=dict_for_record.get('price_retail'),
                                description=dict_for_record.get('description'),
                                quantity_type=dict_for_record.get('quantity_type'),
                                item_type=dict_for_record.get('item_type'),
                                image=dict_for_record.get('image')
                            )
                            temp_model.group.set(dict_for_record.get('group'))
                            print('Позиция записана', dict_for_record.get('title'))
                        except Exception as e:
                            print('Произошла ошибка при обработке позиции', e)
            self.stdout.write('Обработка данных завершена')
