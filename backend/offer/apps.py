from django.apps import AppConfig


class OfferConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'offer'

    def ready(self):
        """Импортируем сигналы для создания побочной модели пользователя"""

        import offer.signals  # noqa