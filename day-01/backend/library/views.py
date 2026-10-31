from rest_framework import viewsets, generics, permissions
from django.contrib.auth import get_user_model
from .models import Book
from .serializers import BookSerializer, RegisterSerializer, UserMeSerializer
from .permissions import IsSellerOrReadOnly

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
    permission_classes = [IsSellerOrReadOnly]

    def perform_create(self, serializer):
        # This dynamically hooks up the active login session profile as the owner
        serializer.save(owner=self.request.user)


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
