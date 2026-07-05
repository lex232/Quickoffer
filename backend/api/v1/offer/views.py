"""API DRF OFFERS views - generate docs"""
import os
import io
from datetime import datetime
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from docxtpl import DocxTemplate
from docxtpl import InlineImage
from docx.shared import Mm
from quickoffer.settings import BASE_DIR

from offer.models import (
    OfferForCustomer,
    OfferItems,
    Profile,
    Client
)
from api.filters import FilterForOffers
from api.v1.offer.serializers import (
    OfferSerializer,
    OfferPostSerializer,
    OfferFullSerializer,
    ChangeOfferStatusSerializer,
)
from utils.num_to_text import get_string_by_number, get_string_by_number_only
from utils.helpers.string_helpers import (
    read_company_type,
    read_month_ru,
    read_okei_type,
    read_quantity_type
)

User = get_user_model()


def generate_dict_info_items(id, work=False):
    """Генерирует словарь с общими данными."""

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
    )
    context['data_items'] = []
    # Перебираем в табличку товары и услуги

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
        if installer.ruk: context['ruk'] = installer.ruk
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
    except:
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
        print("CUSTOMER", context['customer_full'])
        context['customer_bank_full'] = f'р/с {customer.bill_num} в банке "{customer.bank_name}", БИК {customer.bik}, к/с {customer.bill_corr_num}'
        print("CUSTOMER", context['customer_bank_full'])
    except:
        context['customer'] = 'Клиент не выбран'
    return context

def generate_offer_doc(id, description=False):
    """генерация КП в формате doc, на основе ID коммерческого"""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'offer_doc.docx')
    doc = DocxTemplate(file)
    context = {}

    # Дата сегодня
    today = datetime.today().strftime('%d-%m-%Y')

    # Блок данных
    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    )
    context['data_items'] = []
    context['data_services'] = []
    # Перебираем в табличку товары и услуги

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
                # Пример словаря характеристик для разбиения в таблице на будущее
                # context['data_items'][-1]['desc'] = [{'desc_name': 'Тип', 'desc_param': 'Уличный'}, {'desc_name': 'Параметр', 'desc_param': '12В'}]
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
    if installer.ruk: context['ruk'] = installer.ruk
    context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
    context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

    # Блок клиента
    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
    except:
        pass

    doc.render(context)
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)

    return doc_io


def generate_contract_items_doc(id):
    """Договор на товары."""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'contract_items.docx')
    doc = DocxTemplate(file)

    # Блок данных
    context = generate_dict_info_items(id)

    doc.render(context)
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)

    return doc_io


def generate_torg12(id):
    """Накладная на товары."""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'torg12.docx')
    doc = DocxTemplate(file)

    # Блок данных
    context = generate_dict_info_items(id)

    doc.render(context)
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)

    return doc_io


def generate_contract_service_doc(id):
    """Договор на работы."""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'contract_work.docx')
    doc = DocxTemplate(file)

    # Блок данных
    context = generate_dict_info_items(id, True)

    doc.render(context)
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)

    return doc_io


class OfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для коммерческих предложений."""

    serializer_class = OfferSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = FilterForOffers

    def get_queryset(self):
        """Показываем только КП авторизованного пользователя"""

        user = self.request.user
        queryset = OfferForCustomer.objects.filter(author=user)
        return queryset

    def get_serializer_class(self):
        """Определяем сериалайзер в зависимости от запроса"""

        if self.action in 'list':
            return OfferSerializer
        elif self.action in 'retrieve':
            return  OfferFullSerializer
        return OfferPostSerializer


    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_bill_work(self, request, **kwargs):
        """Скачивание счета на работы в формате doc"""

        if request.method == 'GET':
            file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'bill_work_wo_buh.docx')
            doc = DocxTemplate(file)

            # Дата сегодня
            today = datetime.today().strftime('%d-%m-%Y')

            # Блок данных
            context = {}
            offer_id = get_object_or_404(OfferForCustomer, id=kwargs['pk'])
            context['summ'] = "{:.2f}".format(offer_id.final_price_work)
            context['n_invoice'] = f'{offer_id.id}-2'
            context['reason'] = f'Договор №{offer_id.id} от {today}'
            context['propis'] = f'{get_string_by_number(offer_id.final_price_work)}, НДС не облагается'
            context['date'] = today
            context['info'] = f'Оплата по договору №{offer_id.id} от {today} за монтажные работы'
            context['nds'] = 'Без НДС'

            # Блок исполнитель
            installer = get_object_or_404(Profile, user=offer_id.author)
            context['bik'] = installer.bik
            context['bank'] = installer.bank_name
            context['bill_cor'] = installer.bill_corr_num
            context['bill'] = installer.bill_num
            context['inn'] = installer.inn
            if installer.kpp: context['kpp'] = installer.kpp
            if installer.ruk: context['ruk'] = installer.ruk
            context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
            context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

            # Блок клиента
            try:
                customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
                context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
            except:
                pass

            doc.render(context)
            doc_io = io.BytesIO()  # create a file-like object
            doc.save(doc_io)  # save data to file-like object
            doc_io.seek(0)  # go to the beginning of the file-like object

            response = HttpResponse(doc_io)

            # Content-Disposition header makes a file downloadable
            response["Content-Disposition"] = "attachment; filename=generated_doc"

            # Set the appropriate Content-Type for docx file
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response


    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_bill_items(self, request, **kwargs):
        """Скачивание счета на товары в формате doc"""

        if request.method == 'GET':
            file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'bill_items_wo_buh.docx')
            doc = DocxTemplate(file)

            # Дата сегодня
            today = datetime.today().strftime('%d-%m-%Y')

            # Блок данных
            context = {}
            offer_id = get_object_or_404(OfferForCustomer, id=kwargs['pk'])
            items_all = OfferItems.objects.filter(
                offer=offer_id
            )
            context['data'] = []
            count_items = 0
            # Перебираем в табличку товары
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

            # Блок исполнитель
            installer = get_object_or_404(Profile, user=offer_id.author)
            context['bik'] = installer.bik
            context['bank'] = installer.bank_name
            context['bill_cor'] = installer.bill_corr_num
            context['bill'] = installer.bill_num
            context['inn'] = installer.inn
            if installer.kpp: context['kpp'] = installer.kpp
            if installer.ruk: context['ruk'] = installer.ruk
            context['company'] = f'{read_company_type(installer.company_type)} {installer.company_name}'
            context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

            # context['data'] = [{'num': 0, 'item': 'hello', 'count': 2, 'price': 8000, 'summ': 16000}, {'num': 1, 'item': 'hello1', 'count': 2, 'price': 4000, 'summ': 8000}]
            # Блок клиента
            try:
                customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
                context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
            except:
                pass

            doc.render(context)
            doc_io = io.BytesIO()
            doc.save(doc_io)
            doc_io.seek(0)

            response = HttpResponse(doc_io)

            # Content-Disposition header makes a file downloadable
            response["Content-Disposition"] = "attachment; filename=offer_doc"

            # Set the appropriate Content-Type for docx file
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response


    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_doc(self, request, **kwargs):
        """Скачивание КП в формате doc"""

        if request.method == 'GET':

            doc_io = generate_offer_doc(kwargs['pk'])
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=generated_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response

    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_doc_with_description(self, request, **kwargs):
        """Скачивание КП в формате doc с характеристиками"""

        if request.method == 'GET':

            doc_io = generate_offer_doc(kwargs['pk'], True)
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=generated_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response

    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_contract_items(self, request, **kwargs):
        """Скачивание договора на товары в формате doc"""

        if request.method == 'GET':

            doc_io = generate_contract_items_doc(kwargs['pk'])
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=contract_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response

    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_contract_service(self, request, **kwargs):
        """Скачивание КП в формате doc"""

        if request.method == 'GET':

            doc_io = generate_contract_service_doc(kwargs['pk'])
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=contract_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response

    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_torg12(self, request, **kwargs):
        """Скачивание накладной торг-12 в формате doc"""

        if request.method == 'GET':

            doc_io = generate_torg12(kwargs['pk'])
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=contract_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response

    @action(detail=True,
            methods=['patch'],
            permission_classes=(IsAuthenticated,))
    def change_status(self, request, **kwargs):
        """Смена статуса КП."""

        offer = self.get_object()
        serializer = ChangeOfferStatusSerializer(
            offer,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OfferSerializer(offer).data)