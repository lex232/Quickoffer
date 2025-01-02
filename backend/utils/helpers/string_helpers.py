"""Text helpers"""


def read_company_type(company):
    """Нормализует тип компании."""

    if company:
        list_types = {
            'ooo': 'ООО',
            'ip' : 'ИП',
            'fiz': 'Физическое лицо'
        }
        return list_types.get(company)
    return None


def read_quantity_type(quantity):
    """Нормализует тип количества."""

    if quantity:
        list_types = {
            'pc': 'шт.',
            'meters': 'м.',
            'kms': 'км.',
        }
        return list_types.get(quantity)
    return None


def read_month_ru(month):
    """Переводит месяц в прописной."""

    if month > 0:
        month_list = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        return month_list[month-1]
    return None


def read_okei_type(quantity):
    """Нормализует тип океи."""

    if quantity:
        list_types = {
            'pc': '796',
            'meters': '006',
            'kms': '008',
        }
        return list_types.get(quantity)
    return None