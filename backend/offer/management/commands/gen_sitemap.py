"""Генерация sitemap.xml для публичных товаров и статических страниц"""

import os

from django.core.management.base import BaseCommand

from offer.models import Item


DOMAIN_ENV_VAR = 'SITE_URL'
DEFAULT_DOMAIN = 'https://offerguru.ru'

STATIC_PAGES = [
    {'loc': '/', 'priority': '1.0', 'changefreq': 'weekly'},
    {'loc': '/catalog', 'priority': '0.9', 'changefreq': 'weekly'},
    {'loc': '/privacy', 'priority': '0.3', 'changefreq': 'monthly'},
    {'loc': '/terms', 'priority': '0.3', 'changefreq': 'monthly'},
    {'loc': '/disclaimer', 'priority': '0.3', 'changefreq': 'monthly'},
    {'loc': '/cookies', 'priority': '0.3', 'changefreq': 'monthly'},
]


class Command(BaseCommand):
    help = 'Генерирует sitemap.xml для публичных товаров и статических страниц'

    def add_arguments(self, parser):
        parser.add_argument(
            '--domain',
            type=str,
            default=os.getenv(DOMAIN_ENV_VAR, DEFAULT_DOMAIN),
            help=f'Домен (без слеша на конце). По умолчанию: env {DOMAIN_ENV_VAR} или {DEFAULT_DOMAIN}',
        )
        parser.add_argument(
            '--output',
            type=str,
            default='',
            help='Путь для сохранения sitemap.xml. "-" или пусто = stdout',
        )

    def handle(self, *args, **options):
        domain = options['domain'].rstrip('/')
        output_path = options['output']

        items = Item.objects.filter(
            private_type=False,
            is_deleted=False,
            item_type='product',
        ).only('slug', 'pub_date').order_by('slug')

        lines = []
        lines.append('<?xml version="1.0" encoding="UTF-8"?>')
        lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

        for page in STATIC_PAGES:
            url = f'{domain}{page["loc"]}'
            lines.append('  <url>')
            lines.append(f'    <loc>{_escape(url)}</loc>')
            lines.append(f'    <priority>{page["priority"]}</priority>')
            lines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
            lines.append('  </url>')

        for item in items:
            url = f'{domain}/catalog/{item.slug}'
            lastmod = item.pub_date.isoformat() if item.pub_date else ''
            lines.append('  <url>')
            lines.append(f'    <loc>{_escape(url)}</loc>')
            if lastmod:
                lines.append(f'    <lastmod>{lastmod}</lastmod>')
            lines.append('    <priority>0.8</priority>')
            lines.append('    <changefreq>daily</changefreq>')
            lines.append('  </url>')

        lines.append('</urlset>')
        content = '\n'.join(lines) + '\n'

        if output_path and output_path != '-':
            parent = os.path.dirname(output_path)
            if parent:
                os.makedirs(parent, exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            self.stdout.write(self.style.SUCCESS(f'Saved sitemap ({len(items)} items) to {output_path}'))
        else:
            self.stdout.write(content)


def _escape(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace("'", '&apos;').replace('"', '&quot;')
