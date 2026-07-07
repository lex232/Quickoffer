from datetime import datetime

from offer.models import Client, Profile
from utils.helpers.string_helpers import read_company_type, read_month_ru


def get_date_context():
    """Сегодняшняя дата в разных форматах."""
    today = datetime.today().strftime('%d-%m-%Y')
    return {
        'date': today,
        'now_day': datetime.today().strftime('%d'),
        'now_month_ru': read_month_ru(int(datetime.today().strftime('%m'))),
        'now_year': datetime.today().strftime('%Y'),
    }


def get_installer_context(profile):
    """Реквизиты исполнителя из Profile."""
    ctx = {
        'company': f'{read_company_type(profile.company_type)} {profile.company_name}',
        'company_inn': profile.inn,
        'company_ogrn': profile.ogrn,
        'company_bik': profile.bik,
        'company_kpp': profile.kpp,
        'company_bank': profile.bank_name,
        'company_bill': profile.bill_num,
        'company_corr_bill': profile.bill_corr_num,
        'company_address': profile.address_reg,
        'company_full': (
            f'{read_company_type(profile.company_type)} {profile.company_name}, '
            f'ИНН {profile.inn}, Адрес регистрации: {profile.address_reg}, '
            f'Телефон: {profile.phone}'
        ),
        'company_bank_full': (
            f'р/с {profile.bill_num} в банке "{profile.bank_name}", '
            f'БИК {profile.bik}, к/с {profile.bill_corr_num}'
        ),
    }
    if profile.ruk:
        ctx['ruk'] = profile.ruk
    return ctx


def get_installer_short_context(profile):
    """Короткие реквизиты для счетов (bik, bank, bill, inn, kpp, ruk)."""
    ctx = {
        'bik': profile.bik,
        'bank': profile.bank_name,
        'bill_cor': profile.bill_corr_num,
        'bill': profile.bill_num,
        'inn': profile.inn,
        'company': f'{read_company_type(profile.company_type)} {profile.company_name}',
        'company_full': (
            f'{read_company_type(profile.company_type)} {profile.company_name} '
            f'ИНН {profile.inn} Адрес регистрации: {profile.address_reg} '
            f'Телефон: {profile.phone}'
        ),
    }
    if profile.kpp:
        ctx['kpp'] = profile.kpp
    if profile.ruk:
        ctx['ruk'] = profile.ruk
    return ctx


def get_customer_context(client):
    """Реквизиты клиента из Client."""
    ctx = {
        'customer': f'{read_company_type(client.company_type)} {client.title}',
        'customer_inn': client.inn,
        'customer_address': client.address_reg,
        'customer_ogrn': client.ogrn,
        'customer_kpp': client.kpp,
        'customer_bank': client.bank_name,
        'customer_bill': client.bill_num,
        'customer_corr_bill': client.bill_corr_num,
        'customer_full': (
            f'{read_company_type(client.company_type)} {client.title}, '
            f'ИНН {client.inn}, Адрес регистрации: {client.address_reg}'
        ),
        'customer_bank_full': (
            f'р/с {client.bill_num} в банке "{client.bank_name}", '
            f'БИК {client.bik}, к/с {client.bill_corr_num}'
        ),
    }
    return ctx
