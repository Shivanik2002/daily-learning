from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('hello.urls')),  # Hooks up your hello app paths
    path('api/', include('library.urls')), 
]
