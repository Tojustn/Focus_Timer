from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import ChartData
from .serializers import ChartDataSerializer
from rest_framework import generics

class ChartDataListView(generics.ListAPIView):
    queryset = ChartData.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChartDataSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Chart will only get the past weeks data
        queryset = ChartData.objects.filter(user=user).order_by("-date")[:14]
        
        
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response(serializer.data)