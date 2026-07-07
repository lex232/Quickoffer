import os

from datetime import datetime

from django.shortcuts import get_object_or_404
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
from quickoffer.settings import BASE_DIR

from offer.models import OfferForCustomer, OfferItems, Profile, Client
from utils.num_to_text import get_string_by_number
from utils.helpers.string_helpers import read_company_type, read_quantity_type


def generate_offer_doc(id, description=False):
    """Генерация КП в формате doc, на основе ID коммерческого предложения."""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'offer_doc.docx')
    doc = DocxTemplate(file)

    today = datetime.today().strftime('%d-%m-%Y')
    context = {}

    # Блок данных
    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    ).select_related('item__brand', 'item').prefetch_related('item__group')
    context['data_items'] = []
    context['data_services'] = []

    count_items = 1
    count_services = 1
    for item in items_all:
        if item.item.item_type == 'product':
            context['data_items'].append({
                'num': count_items,
                'item': str(item.item),
                'brand': str(item.item.brand),
                'category': str(item.item.group.last()),
                'count': item.amount,
                'quantity': read_quantity_type(str(item.item.quantity_type)),
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            url_img = item.item.image
            if url_img:
                pass
                image = InlineImage(doc, url_img, width=Mm(10))
            else:
                image = None
            context['data_items'][-1]['image'] = image
            if description:
                context['data_items'][-1]['desc'] = str(item.item.description).replace('!', ': ').replace(';', '. ')
            count_items += 1
        if item.item.item_type == 'service':
            context['data_services'].append({
                'num': count_services,
                'item': item.item,
                'count': item.amount,
                'quantity': read_quantity_type(str(item.item.quantity_type)),
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            count_services += 1

    context['summ'] = "{:.2f}".format(offer_id.final_price)
    context['summ_devices'] = "{:.2f}".format(offer_id.final_price_goods)
    context['summ_services'] = "{:.2f}".format(offer_id.final_price_work)
    context['n_offer'] = f'{offer_id.id}'
    context['propis'] = f'{get_string_by_number(offer_id.final_price)}, НДС не облагается'
    context['date'] = today

    # Блок исполнитель
    installer = get_object_or_404(Profile, user=offer_id.author)
    if installer.ruk:
        context['ruk'] = installer.ruk
    context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
    context['company_full'] = (
        f'{read_company_type(installer.company_type)} {installer.company_name} '
        f'ИНН {installer.inn} Адрес регистрации: {installer.address_reg} '
        f'Телефон: {installer.phone}'
    )

    # Блок клиента
    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        context['customer'] = (
            f'{read_company_type(customer.company_type)} {customer.title} '
            f'ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
        )
    except Exception:
        pass

    doc.render(context)
    import io
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)
    return doc_io
