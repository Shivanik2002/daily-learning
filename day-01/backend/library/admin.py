from django.contrib import admin
from .models import Author, Book

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at') # Columns shown in list view
    search_fields = ('name', 'email')                    # Adds a top search bar
    list_filter = ('created_at',)                        # Adds a right sidebar filter

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'price', 'stock', 'is_available', 'published_on')
    search_fields = ('title', 'author__name')            # Search by title or author's name
    list_filter = ('is_available', 'published_on', 'author')
