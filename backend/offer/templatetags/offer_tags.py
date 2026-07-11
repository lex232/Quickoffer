from django import template

register = template.Library()


@register.filter
def dict_lookup(d, key):
    """Получить значение из dict по ключу: {{ mydict|dict_lookup:key }}"""
    if isinstance(d, dict):
        return d.get(key, '')
    return ''
