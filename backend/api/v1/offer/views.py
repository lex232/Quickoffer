"""API DRF OFFERS views"""
from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from PIL import Image as ImagePIL

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader

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


class OfferViewSet(viewsets.ModelViewSet):
    """Апи вьюсет для коммерческих предложений."""

    serializer_class = OfferSerializer
    permission_classes = (IsAuthenticated,)

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

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="file.pdf"'
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
            customer = get_object_or_404(Client, title=offer_id.name_client, author=offer_id.author)
            table_customer = [['Заказчик:'], ['ИНН:'], ['Адрес регистрации:']]
            table_customer[0].append(customer.title)
            table_customer[1].append(customer.inn)
            table_customer[2].append(customer.address_reg)

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
