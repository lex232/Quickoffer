from datetime import datetime

from django.shortcuts import get_object_or_404

from offer.models import OfferForCustomer, OfferItems, Profile, Client
from offer.services.base import render_docx
from utils.num_to_text import get_string_by_number
from utils.helpers.string_helpers import read_company_type


def generate_bill_work(id):
    """Счёт на работы."""
    today = datetime.today().strftime('%d-%m-%Y')
    context = {}

    offer_id = get_object_or_404(OfferForCustomer, id=id)
    context['summ'] = "{:.2f}".format(offer_id.final_price_work)
    context['n_invoice'] = f'{offer_id.id}-2'
    context['reason'] = f'Договор №{offer_id.id} от {today}'
    context['propis'] = f'{get_string_by_number(offer_id.final_price_work)}, НДС не облагается'
    context['date'] = today
    context['info'] = f'Оплата по договору №{offer_id.id} от {today} за монтажные работы'
    context['nds'] = 'Без НДС'

    installer = get_object_or_404(Profile, user=offer_id.author)
    context['bik'] = installer.bik
    context['bank'] = installer.bank_name
    context['bill_cor'] = installer.bill_corr_num
    context['bill'] = installer.bill_num
    context['inn'] = installer.inn
    if installer.kpp:
        context['kpp'] = installer.kpp
    if installer.ruk:
        context['ruk'] = installer.ruk
    context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
    context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
    except Exception:
        pass

    return render_docx('bill_work_wo_buh.docx', context)


def generate_bill_items(id):
    """Счёт на товары."""
    today = datetime.today().strftime('%d-%m-%Y')
    context = {}

    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    ).select_related('item')
    context['data'] = []
    count_items = 0
    for index, item in enumerate(items_all):
        if item.item.item_type == 'product':
            context['data'].append({
                'num': index + 1,
                'item': item.item,
                'count': item.amount,
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            count_items += 1

    context['count_items'] = count_items
    context['summ'] = "{:.2f}".format(offer_id.final_price_goods)
    context['n_invoice'] = f'{offer_id.id}-1'
    context['reason'] = f'Договор №{offer_id.id} от {today}'
    context['propis'] = f'{get_string_by_number(offer_id.final_price_goods)}, НДС не облагается'
    context['date'] = today
    context['info'] = f'Оплата по договору №{offer_id.id} от {today} за монтажные работы'
    context['nds'] = 'Без НДС'

    installer = get_object_or_404(Profile, user=offer_id.author)
    context['bik'] = installer.bik
    context['bank'] = installer.bank_name
    context['bill_cor'] = installer.bill_corr_num
    context['bill'] = installer.bill_num
    context['inn'] = installer.inn
    if installer.kpp:
        context['kpp'] = installer.kpp
    if installer.ruk:
        context['ruk'] = installer.ruk
    context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
    context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
    except Exception:
        pass

    return render_docx('bill_items_wo_buh.docx', context)
