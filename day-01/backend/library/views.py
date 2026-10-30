from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer

# Task 2: ModelViewSet for Authors
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

# Task 2 & 3: ModelViewSet for Books with custom filtering & custom action
class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer

    # Task 3: Overriding get_queryset to handle custom filtering via query_params
    def get_queryset(self):
        queryset = Book.objects.all()
        
        # Filter by title search (?search=django)
        search_param = self.request.query_params.get('search', None)
        if search_param:
            queryset = queryset.filter(title__icontains=search_param)
            
        # Filter by author ID (?author=2)
        author_param = self.request.query_params.get('author', None)
        if author_param:
            queryset = queryset.filter(author_id=author_param)
            
        return queryset

    # Task 3: Custom patch action at /api/books/<id>/mark_unavailable/
    @action(detail=True, methods=['patch'], url_path='mark_unavailable')
    def mark_unavailable(self, request, pk=None):
        book = self.get_object()
        
        # Note: Assumes your Book model has an 'is_available' boolean field.
        # If it doesn't, this safe check will let you know.
        if hasattr(book, 'is_available'):
            book.is_available = False
            book.save()
            return Response({'status': f'Book "{book.title}" marked as unavailable.'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Field is_available does not exist on Book model.'}, status=status.HTTP_400_BAD_REQUEST)
