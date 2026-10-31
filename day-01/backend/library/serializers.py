from rest_framework import serializers
from .models import Author, Book
from django.contrib.auth import get_user_model


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # Password must be write-only and at least 6 characters long
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'role', 'phone']

    def validate_role(self, value):
        # Prevent registration payloads from choosing the admin role
        if value == 'admin':
            raise serializers.ValidationError("You cannot register directly as an admin.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'phone']
        # Email and Role cannot be mutated via PATCH requests
        read_only_fields = ['email', 'role']

#_______________________________________________________________________________________________________________________

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    # Task 1: Read-only field fetching the author's name
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'

    # Task 1 Validation: price must be > 0
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    # Task 1 Validation: title must be at least 3 characters
    def validate_title(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value
