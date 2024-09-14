from django.contrib import admin
from .models import ChartData
# Register your models here.
class ChartAdmin(admin.ModelAdmin):
    list_display = ('id','user','session', 'date', 'value')
admin.site.register(ChartData)