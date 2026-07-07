from datetime import datetime

from django.shortcuts import get_object_or_404

from offer.models import OfferForCustomer, OfferItems, Profile, Client
from offer.services.base import render_docx
from utils.num_to_text import get_string_by_number, get_string_by_number_only
from utils.helpers.string_helpers import (
    read_company_type, read_month_ru, read_quantity_type, read_okei_type
)


def generate_dict_info_items(id, work=False):
    """Генерирует словарь с общими данными для договоров и накладных."""

    context = {}

    # Дата сегодня
    today = datetime.today().strftime('%d-%m-%Y')
    context['date'] = today
    context['now_day'] = datetime.today().strftime('%d')
    context['now_month_ru'] = read_month_ru(int(datetime.today().strftime('%m')))
    context['now_year'] = datetime.today().strftime('%Y')

    # Блок данных
    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    ).select_related('item__brand', 'item').prefetch_related('item__group')
    context['data_items'] = []

    count_items = 1
    amount_items = 0
    type = 'product'
    for index, item in enumerate(items_all):
        if work:
            type = 'service'
        if item.item.item_type == type:
            context['data_items'].append({
                'num': count_items,
                'item': item.item,
                'count': item.amount,
                'quantity': read_quantity_type(str(item.item.quantity_type)),
                'quantity_okei': read_okei_type(str(item.item.quantity_type)),
                'category': str(item.item.group.last()),
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            amount_items += item.amount
            count_items += 1

    context['count_items'] = count_items - 1
    context['count_items_propis'] = get_string_by_number_only(count_items - 1)
    context['amount_items'] = amount_items
    context['summ'] = "{:.2f}".format(offer_id.final_price)
    context['summ_devices'] = "{:.2f}".format(offer_id.final_price_goods)
    context['summ_services'] = "{:.2f}".format(offer_id.final_price_work)
    context['n_offer'] = f'{offer_id.id}'
    context['propis'] = f'{get_string_by_number(offer_id.final_price)}, НДС не облагается'
    context['propis_devices'] = f'{get_string_by_number(offer_id.final_price_goods)}, НДС не облагается'
    context['propis_services'] = f'{get_string_by_number(offer_id.final_price_work)}, НДС не облагается'
    context['reason'] = f'Договор №{offer_id.id} от {today}'

    # Блок исполнитель
    try:
        installer = get_object_or_404(Profile, user=offer_id.author)
        if installer.ruk:
            context['ruk'] = installer.ruk
        context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
        context['company_inn'] = installer.inn
        context['company_ogrn'] = installer.ogrn
        context['company_bik'] = installer.bik
        context['company_kpp'] = installer.kpp
        context['company_bank'] = installer.bank_name
        context['company_bill'] = installer.bill_num
        context['company_corr_bill'] = installer.bill_corr_num
        context['company_address'] = installer.address_reg
        context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name}, ИНН {installer.inn}, Адрес регистрации: {installer.address_reg}, Телефон:  {installer.phone}'
        context['company_bank_full'] = f'р/с {installer.bill_num} в банке "{installer.bank_name}", БИК {installer.bik}, к/с {installer.bill_corr_num}'
    except Exception:
        pass

    # Блок клиент
    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        context['customer'] = f'{read_company_type(customer.company_type)} {customer.title}'
        context['customer_inn'] = customer.inn
        context['customer_address'] = customer.address_reg
        context['customer_ogrn'] = customer.ogrn
        context['customer_kpp'] = customer.kpp
        context['customer_bank'] = customer.bank_name
        context['customer_bill'] = customer.bill_num
        context['customer_corr_bill'] = customer.bill_corr_num
        context['customer_full'] = f'{read_company_type(customer.company_type)} {customer.title}, ИНН {customer.inn}, Адрес регистрации: {customer.address_reg}'
        context['customer_bank_full'] = f'р/с {customer.bill_num} в банке "{customer.bank_name}", БИК {customer.bik}, к/с {customer.bill_corr_num}'
    except Exception:
        context['customer'] = 'Клиент не выбран'

    return context


def generate_contract_items_doc(id):
    """Договор на товары."""
    context = generate_dict_info_items(id)
    return render_docx('contract_items.docx', context)


def generate_contract_service_doc(id):
    """Договор на работы."""
    context = generate_dict_info_items(id, True)
    return render_docx('contract_work.docx', context)
