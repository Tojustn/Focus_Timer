from django.urls import path
from . import views

urlpatterns = [
    path('sessions/', views.SessionListView.as_view(),name = "session-list"),
    path('sessions/delete/<int:pk>/', views.SessionDelete.as_view(), name='delete-session'),
    path('sessions/<int:pk>/', views.SessionDetailView.as_view(), name="session-detail"),
    path('sessions/<int:session_id>/timers/', views.TimerListView.as_view(), name = "timer-list"),
    path('sessions/<int:session_id>/timers/<int:pk>', views.TimerView.as_view(), name = "timer-detail"),
]
