from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from library.views import AuthorViewSet, BookViewSet

# Task 2: DefaultRouter setup
router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    path('admin/', admin.site.urls),        # Fixed: must point to admin.site.urls
    path('api/', include(router.urls)),     # Registers /api/authors/ and /api/books/
]
