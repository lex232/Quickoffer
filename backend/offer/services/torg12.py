from offer.services.contract import generate_dict_info_items
from offer.services.base import render_docx


def generate_torg12(id):
    """Накладная на товары."""
    context = generate_dict_info_items(id)
    return render_docx('torg12.docx', context)
