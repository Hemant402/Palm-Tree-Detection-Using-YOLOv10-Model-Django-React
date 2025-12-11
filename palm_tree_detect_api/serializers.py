from rest_framework import serializers
from .models import DashboardDesign

class DashboardDesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardDesign
        fields = ['title', 'logo']
