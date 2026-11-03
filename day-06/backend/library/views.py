from rest_framework import viewsets, generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from .models import Book
from .serializers import BookSerializer, RegisterSerializer, UserMeSerializer

User = get_user_model()

# ==========================================
#           TASK 2 AUTH VIEWS
# ==========================================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserMeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ==========================================
#      TASK 3 BOOK & ADMIN VIEWS
# ==========================================

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    # 🫵 FIX: Changed from [IsSellerOrReadOnly] to [AllowAny] for Day 6 Frontend testing
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Checks if a guest is using the UI form or a token session user
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            # Fallback anchor: Assigns the very first database profile row as the owner metadata hook
            first_user = User.objects.first()
            serializer.save(owner=first_user)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
