# Day 03 Tasks - Concept Notes

### 1. What is the difference between APIView, GenericAPIView, and ModelViewSet?
* **APIView**: The most basic view class wrapper provided by DRF. It handles standard HTTP methods (`get`, `post`, `put`, `delete`) manually. You write the handling logic entirely from scratch.

* **GenericAPIView**: Extends `APIView` by adding support for common database workflows. It pairs with mixins to offer built-in attributes like `queryset` and `serializer_class`, drastically shortening boilerplate CRUD code.

* **ModelViewSet**: The highest level of abstraction. It inherits from `GenericAPIView` and all CRUD mixins. It automatically constructs a complete set of read/write operations mapping to conventional URL routing via a DRF Router.

### 2. What is the difference between PUT and PATCH?
* **PUT**: Used for a complete update. You must send **all** fields of the payload. If you omit an optional field, it replaces the existing data with `null` or a default value.

* **PATCH**: Used for a partial update. You only send the specific field(s) you want to change, leaving all other existing properties untouched.

## 📋 Developer Completion Checklist
-  **CRUD Operations:** Works perfectly for Authors and Books via `ModelViewSet` and `DefaultRouter`.
-  **Data Validation:** Implemented custom rules for price validation and title length checks.
-  **Filters & Pagination:** Wired `search` queries, author filtering, and active `PageNumberPagination` (size 5).
-  **Custom Action:** Successfully bound the dynamic `@action` endpoint for `/mark_unavailable/`.
-  **Postman Collection:** Exported and saved all request sets directly inside `day-03/postman_collection.json`.
