from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,SessionSerializer,TimerSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Session, Timer
from django.utils import timezone
from rest_framework.exceptions import NotFound
from django.db import models
from django.db.models import Sum
from datetime import timedelta
# Create your views here.

class SessionListView(generics.ListCreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # User can see past sessions, most recent 4 and the current session 
        return Session.objects.filter(user=user, is_finished = True, start_date__lte=timezone.now()).order_by("-start_date")[:5]
    
    # When saving a Session 
    def perform_create(self,serializer):
        # If serializer passed all fields and is valid
        if serializer.is_valid():
            # Cuz user is readonly this passes the user for us given validated data
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class SessionDelete(generics.DestroyAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # User can see past sessions, most recent 4 and the current session 
        return Session.objects.filter(user=user)

class TimerListView(generics.ListCreateAPIView):
    serializer_class = TimerSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        session_id = self.kwargs.get('session_id')
        if session_id:
            return Timer.objects.filter(session_id=session_id)
        return Timer.objects.none()
    def perform_create(self, serializer):
        if serializer.is_valid():
            session_id = self.kwargs.get('session_id')
            session = Session.objects.get(id=session_id)
            serializer.save(session=session)

class TimerView(generics.RetrieveUpdateAPIView):
    serializer_class = TimerSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        session_id = self.kwargs.get('session_id')
        return Timer.objects.filter(session_id=session_id)
    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        try:
            return queryset.get(pk=pk)
        except Session.DoesNotExist:
            raise NotFound("Session not found")
    

class SessionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Session.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        return Session.objects.filter(user=user)
    
    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        try:
            return queryset.get(pk=pk)
        except Session.DoesNotExist:
            raise print("Session not found")

    def get_total_duration(self,session):
        # Calculate break and study durations
        break_duration_timedelta = session.timer_set.filter(is_break=True).aggregate(total=Sum('duration'))['total'] or timedelta()
        study_duration_timedelta = session.timer_set.filter(is_break=False).aggregate(total=Sum('duration'))['total'] or timedelta()

        # Convert timedelta to total seconds
        break_duration_seconds = break_duration_timedelta.total_seconds()
        study_duration_seconds = study_duration_timedelta.total_seconds()

        # Convert total seconds to timedelta for storage
        session.break_duration = timedelta(seconds=break_duration_seconds)
        session.study_duration = timedelta(seconds=study_duration_seconds)
        session.save()
    def put(self, request, *args, **kwargs):
        session = self.get_object()

        # If 'is_finished' exists in the request and is set to True
        if request.data.get('is_finished', False):
            # Call get_total_duration method (which retrieves the session internally)
            self.get_total_duration(session)
            

        # Call the parent class's put method to continue processing
        return super().put(request, *args, **kwargs)
# CreateAPIView handles User creation
class CreateUserView(generics.CreateAPIView):
    # Checks if a user already has the username
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    