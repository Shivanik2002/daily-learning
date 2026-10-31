from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserMeView, AdminUserListView, BookViewSet

# Initialize the DefaultRouter for conventional ViewSet mappings
router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = [
    # Task 2 – Authentication Routes
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', UserMeView.as_view(), name='auth_me'),
    
    # Task 3 – Administrative Global Users View Route
    path('users/', AdminUserListView.as_view(), name='admin_users_list'),
    
    # Task 3 – Include Automatically Handled Book ViewSet Endpoints (/api/books/)
    path('', include(router.urls)),
]
