"""API DRF OFFERS views"""
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
from django_filters.rest_framework import DjangoFilterBackend
from PIL import Image as ImagePIL

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader

from docxtpl import DocxTemplate
from docxtpl import InlineImage
from docx.shared import Mm
from quickoffer.settings import BASE_DIR

from api.permissions import IsAdminOrReadOnly
from offer.models import (
    OfferForCustomer,
    OfferItems,
    Profile,
    Client
)
from api.v1.offer.serializers import (
    OfferSerializer,
    OfferPostSerializer,
    OfferFullSerializer
)
from utils.num_to_text import get_string_by_number
from utils.newline import insert_newline

User = get_user_model()


def read_company_type(company):
    if company:
        list_types = {
            'ooo': 'ООО',
            'ip' : 'ИП',
            'fiz': 'Физическое лицо'
        }
        return list_types.get(company)
    return None


def generate_dict_info_items(id):

    # Дата сегодня
    today = datetime.today().strftime('%d-%m-%Y')

    # Блок данных
    context = {}
    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    )
    context['data_items'] = []
    # Перебираем в табличку товары и услуги

    count_items = 1
    for index, item in enumerate(items_all):
        if item.item.item_type == 'product':
            context['data_items'].append({
                'num': count_items,
                'item': item.item,
                'count': item.amount,
                'quantity': item.item.quantity_type,
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            count_items += 1

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
    context['company_inn'] = installer.inn
    context['company_ogrn'] = installer.ogrn
    context['company_bik'] = installer.bik
    context['company_bank'] = installer.bank_name
    context['company_bill'] = installer.bill_num
    context['company_corr_bill'] = installer.bill_corr_num
    context['company_address'] = installer.address_reg
    # context['company_full'] = f'{read_company_type(installer.company_type)} {installer.company_name} ИНН {installer.inn} Адрес регистрации: {installer.address_reg} Телефон:  {installer.phone}'

    # Блок клиента
    try:
        customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
        # context['customer'] = f'{read_company_type(customer.company_type)} {customer.title} ИНН {customer.inn} Адрес регистрации: {customer.address_reg}'
        context['customer'] = f'{read_company_type(customer.company_type)} {customer.title}'
        context['customer_inn'] = customer.inn
        context['customer_address'] = customer.address_reg
    except:
        pass
    return context

def generate_offer_doc(id):
    """генерация КП в формате doc, на основе ID коммерческого"""

    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'offer_doc.docx')
    doc = DocxTemplate(file)

    # Дата сегодня
    today = datetime.today().strftime('%d-%m-%Y')

    # Блок данных
    context = {}
    offer_id = get_object_or_404(OfferForCustomer, id=id)
    items_all = OfferItems.objects.filter(
        offer=offer_id
    )
    context['data_items'] = []
    context['data_services'] = []
    # Перебираем в табличку товары и услуги

    count_items = 1
    count_services = 1
    for index, item in enumerate(items_all):
        if item.item.item_type == 'product':
            context['data_items'].append({
                'num': count_items,
                'item': item.item,
                'count': item.amount,
                'quantity': item.item.quantity_type,
                'price': "{:.2f}".format(item.item_price_retail),
                'summ': "{:.2f}".format(item.amount * item.item_price_retail)
            })
            url_img = item.item.image
            if url_img:
                pass
                image = InlineImage(doc, url_img, width=Mm(15))
            else:
                image = None
            context['data_items'][index]['image'] = image
            count_items += 1
        if item.item.item_type == 'service':
            context['data_services'].append({
                'num': count_services,
                'item': item.item,
                'count': item.amount,
                'quantity': item.item.quantity_type,
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
    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', 'contract_items.docx')
    doc = DocxTemplate(file)

    # Блок данных
    context = generate_dict_info_items(id)

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
    filterset_fields = ['status_type']

    def get_queryset(self):
        """Показываем только КП авторизованного пользователя"""

        user = self.request.user
        queryset = OfferForCustomer.objects.filter(author=user)
        return queryset

    def get_serializer_class(self):
        """Определеям сериалайзер в зависимости от запроса"""

        if self.action in 'list':
            return OfferSerializer
        elif self.action in 'retrieve':
            return  OfferFullSerializer
        return OfferPostSerializer

    @action(detail=True,
            methods=['get'],
            permission_classes=(AllowAny,))
    def download_pdf(self, request, **kwargs):
        """Скачивание КП в формате PDF"""

        if request.method == 'GET':

            # Достаем объекты
            offer_id = get_object_or_404(OfferForCustomer, id=kwargs['pk'])
            items_all = OfferItems.objects.filter(
                offer=offer_id
            )
            table_data = [['Позиция','Наименование', 'Розничная цена', 'Количество', 'Сумма', 'Изображение']]
            # Перебираем в табличку товары
            total_sum = 0
            for index, item in enumerate(items_all):
                table_data.append([])
                table_data[index+1].append(index+1)

                # Режем имя, если оно более 40 символов
                item_name = insert_newline(str(item.item), 40)
                item_description = insert_newline(str(item.item.description), 40)
                table_data[index + 1].append(item_name + '\n' + item_description)

                table_data[index+1].append(item.item_price_retail)
                table_data[index+1].append(item.amount)
                temp_sum = item.amount * item.item_price_retail
                table_data[index + 1].append(temp_sum)
                total_sum += temp_sum

                url_img = item.item.image
                if url_img:
                    image = Image(url_img, 0.8*inch, 0.8*inch)
                else:
                    image = None
                table_data[index + 1].append(image)
            print("OFFER", offer_id.id)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{offer_id.id}"'
            p = canvas.Canvas(response, pagesize=letter)
            pdfmetrics.registerFont(TTFont('Roboto-Regular', 'Roboto-Regular.ttf'))
            p.setFont('Roboto-Regular', 10)

            # Заголовок
            title = f'Коммерческое предложение № {offer_id.id}'
            p.drawString(30, 750, title)

            # Блок исполнитель
            installer = get_object_or_404(Profile, user=offer_id.author)
            table_installer = [['Исполнитель:'], ['ИНН:'], ['Адрес регистрации:']]
            table_installer[0].append(installer.company_name_for_docs)
            table_installer[1].append(installer.inn)
            table_installer[2].append(installer.address_reg)

            url_img_customer = installer.image
            # Узнаем aspect ratio
            # with ImagePIL.open(url_img_customer) as temp_img:
            #     logo_w, logo_h = temp_img.size
            #     aspect_logo = logo_w / logo_h
            image_customer = ImageReader(url_img_customer)
            logo_w, logo_h = image_customer.getSize()
            aspect_logo = logo_w / logo_h

            # Блок заказчик
            table_customer = [['Заказчик:'], ['ИНН:'], ['Адрес регистрации:']]
            try:
                customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
                table_customer[0].append(customer.title)
                table_customer[1].append(customer.inn)
                table_customer[2].append(customer.address_reg)
            except:
                pass

            # Формируем таблицу
            table_style = [
                ('GRID', (0, 0), (-1,-1), 0.25, colors.black),
                ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
                ('VALIGN', (0, 1), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, -1), 'Roboto-Regular'),  # font
            ]
            table_style_installer = [
                ('INNERGRID', (0,0), (-1,-1), 0.25, colors.white),
                ('FONTNAME', (0, 0), (-1, -1), 'Roboto-Regular'),  # font
            ]
            report_table = Table(data=table_data, style=table_style, hAlign='LEFT')
            installer_table = Table(data=table_installer, style=table_style_installer, hAlign='LEFT')
            installer_customer = Table(data=table_customer, style=table_style_installer, hAlign='LEFT')

            actual_table_x, actual_table_y = report_table.wrapOn(p, 200, 600)
            report_table.drawOn(p, 20, letter[0]-actual_table_y-40)
            installer_table.wrapOn(p, 200, 400)
            installer_table.drawOn(p, 20, 680)
            installer_customer.wrapOn(p, 200, 400)
            installer_customer.drawOn(p, 20, 600)

            # Итого
            total_string = f'Итого: {total_sum} Руб. (Без НДС)'
            total_string_word = f'Итого прописью: {get_string_by_number(total_sum)}, НДС не облагается'
            total_string_sign = f'Подпись _________ м.п.'
            p.drawString(30, letter[0]-actual_table_y - 60, total_string)
            p.drawString(30, letter[0]-actual_table_y - 70, total_string_word)
            p.drawString(30, 40, total_string_sign)

            # Логотип
            p.drawImage(
                image=image_customer,
                x=490,
                y=680,
                width=100,
                height=int(100/aspect_logo),
                mask='auto'
            )
            p.showPage()
            p.save()
            return response

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
            context['summ'] = offer_id.final_price_work
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
        """Скачивание счета на работы в формате doc"""

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
            # Перебираем в табличку товары
            for index, item in enumerate(items_all):
                if item.item.item_type == 'product':
                    context['data'].append({
                        'num': index + 1,
                        'item': item.item,
                        'count': item.amount,
                        'price': item.item_price_retail,
                        'summ': item.amount * item.item_price_retail
                    })


            context['summ'] = offer_id.final_price_goods
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
    def download_contract_items(self, request, **kwargs):
        """Скачивание КП в формате doc"""

        if request.method == 'GET':

            doc_io = generate_contract_items_doc(kwargs['pk'])
            response = HttpResponse(doc_io)
            response["Content-Disposition"] = "attachment; filename=contract_doc"
            response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            return response