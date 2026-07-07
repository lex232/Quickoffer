import io
import os

from docxtpl import DocxTemplate
from quickoffer.settings import BASE_DIR
from django.http import HttpResponse


def render_docx(template_name, context):
    """Загружает шаблон, рендерит, возвращает BytesIO."""
    file = os.path.join(BASE_DIR, 'utils', 'doc_templates', template_name)
    doc = DocxTemplate(file)
    doc.render(context)
    doc_io = io.BytesIO()
    doc.save(doc_io)
    doc_io.seek(0)
    return doc_io


def make_docx_response(doc_io, filename="generated_doc"):
    """Оборачивает BytesIO в HttpResponse для скачивания."""
    response = HttpResponse(doc_io)
    response["Content-Disposition"] = f"attachment; filename={filename}"
    response["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return response
