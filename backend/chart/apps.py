from django.apps import AppConfig

class ChartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chart'

    def ready(self):
        import chart.signals  # Import signals to ensure they are registered
