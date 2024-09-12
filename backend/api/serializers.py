from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Session, Timer
"""
User Serializer
Purpose: Provide JSON data about the User python -> JSON, vise versa

Accepts and Returns
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", 'username','password']
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        # Accepts validated data then creates a user object
        user = User.objects.create_user(**validated_data)
        return user
    

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'user', 'title', 'slug', 'start_date', 'end_date', 'is_finished', 'description', 'break_duration', 'study_duration']
        extra_kwargs = {'user': {'read_only': True}}
        
class TimerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timer
        fields = ['id', 'session','duration','start_date','is_finished','is_break']
        extra_kwargs = {'session': {'read_only': True}}