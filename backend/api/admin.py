from django.contrib import admin
from .models import Session, Timer
# Register your models here.
class SessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'slug', 'start_date', 'end_date', 'is_finished', 'description', 'break_duration', 'study_duration')
    search_fields = ('title', 'description')
    list_filter = ('is_finished', 'start_date')
    ordering = ('-start_date',)
    prepopulated_fields = {'slug': ('title',)}
    actions = ["mark_as_finished"]

    # Make sure start_date is editable
    fields = ('user', 'title', 'slug', 'start_date', 'end_date', 'is_finished', 'description', 'break_duration', 'study_duration')

    def mark_as_finished(self, request, queryset):
        queryset.update(is_finished=True)


class TimerAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'duration', 'start_date', 'is_finished', 'is_break')
    ordering = ('-start_date',)
    
    # Make sure start_date is editable
    fields = ('session', 'duration', 'start_date', 'is_finished', 'is_break')

admin.site.register(Session, SessionAdmin)
admin.site.register(Timer, TimerAdmin)
