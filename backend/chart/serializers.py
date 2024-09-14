from rest_framework import serializers
from .models import ChartData

class ChartDataSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ChartData
        fields = ['user', 'session', 'date', 'value']