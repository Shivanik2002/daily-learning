from django.urls import path
from .views import HelloShivaniView, HelloKashiView, AddNumbersView

urlpatterns = [
    path('hello/', HelloShivaniView.as_view(), name='hello-shivani'),
    path('hello/<str:name>/', HelloKashiView.as_view(), name='hello-Kashi'),
    path('add/', AddNumbersView.as_view(), name='add-numbers'),
]
