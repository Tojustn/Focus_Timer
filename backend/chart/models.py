from django.db import models
from django.contrib.auth.models import User
from api.models import Session
# Create your models here.
class ChartData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session = models.OneToOneField(Session, on_delete = models.CASCADE, null=True)
    date = models.DateField()
    value = models.FloatField()