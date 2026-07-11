import os
import time
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Удаляет временные файлы импорта старше 1 часа'

    def handle(self, *args, **options):
        tmp_dir = os.path.join(settings.MEDIA_ROOT, 'import_tmp')
        if not os.path.exists(tmp_dir):
            self.stdout.write('Папка import_tmp не найдена')
            return

        now = time.time()
        cutoff = now - 3600  # 1 час
        removed = 0

        for fname in os.listdir(tmp_dir):
            fpath = os.path.join(tmp_dir, fname)
            if os.path.isfile(fpath) and os.path.getmtime(fpath) < cutoff:
                os.remove(fpath)
                removed += 1

        self.stdout.write(f'Удалено файлов: {removed}')
