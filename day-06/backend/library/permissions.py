from rest_framework import permissions

class IsSellerOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Anyone can GET/read data.
    - Only a 'seller' can write (POST/PUT/DELETE).
    - A 'seller' can only modify a book they own.
    """
    def has_permission(self, request, view):
        # Allow anyone to read data safely
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write operations require an authenticated user with a 'seller' role
        return request.user.is_authenticated and request.user.role == 'seller'

    def has_object_permission(self, request, view, obj):
        # Allow object-level reads safely
        if request.method in permissions.SAFE_METHODS:
            return True
        # Restrict mutations exclusively to the owner of the book asset
        return obj.owner == request.user
