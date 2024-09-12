from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from datetime import timedelta

# Create your models here.
class Session(models.Model):
    user = models.ForeignKey(User,on_delete = models.CASCADE)
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=False, blank=True, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_finished = models.BooleanField(default=False)
    description = models.TextField(default = '')
    break_duration = models.DurationField(default=timedelta(0))
    study_duration = models.DurationField(default=timedelta(0))
    def __str__ (self):
        return self.title
    # Slugifying the url to be the title (GOING TO ADD USER/TITLE NOT RN)
    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.title)

        super(Session, self).save(*args, **kwargs)
    
class Timer(models.Model):
    session = models.ForeignKey(Session,on_delete = models.CASCADE)
    duration = models.DurationField(default=timedelta(0))
    start_date = models.DateTimeField(auto_now_add=True)
    is_finished = models.BooleanField(default=False)
    is_break = models.BooleanField(default=False)
    