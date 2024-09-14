from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import Session
from .models import ChartData

from datetime import timedelta

# Proccess duration fields
def calculate_percentage(study_duration, break_duration):
    # Convert timedelta to total seconds
    total_seconds_study = study_duration.total_seconds()
    total_seconds_break = break_duration.total_seconds()
    total_seconds = total_seconds_study + total_seconds_break

    # Avoid division by zero
    if total_seconds == 0:
        return 0

    return (total_seconds_study / total_seconds) * 100

# Receiver for when a post is saved in the database(updates etc), then the sender is specified to that Django instance
@receiver(post_save, sender = Session)
def create_or_update_chartdata(sender, instance, **kwargs):
    if instance.is_finished:
        # update or create is a Django ORM(object relational model)
        ChartData.objects.update_or_create(
            session = instance,
            # Defaults make sure that we are either updating or creating cant be both
            defaults={
                "user": instance.user,
                "date": instance.start_date,
                "value": calculate_percentage(instance.study_duration, instance.break_duration)
                
            }
        )