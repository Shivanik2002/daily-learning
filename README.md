# Day 01: Environment Setup & Django API

This repository tracks my daily learning progress. On Day 01, I configured the local environment, resolved Git SSH authentication, and developed a basic greeting and math REST API using Django Rest Framework (DRF).

---

## Task 1 & 2: Environment & Git Setup
- Installed: **Python 3, Node.js, NPM, Git, VS Code, and Postman**
- Configured passwordless authentication securely using **SSH Keys** (`id_ed25519.pub`).
- Structured workspace folder layout with an active `.gitignore` safety filter.

---

## Task 3: Django "Hello API" Implementation

### Project Execution Flow
```bash
# Setup Virtual Environment
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework

## Start Server
python manage.py runserver
```

### API Endpoints Logic
Developed inside `hello/views.py` using DRF's `APIView`:
- **GET** `/api/hello/` ➔ Returns `{"message": "Hello Shivani"}`
- **GET** `/api/hello/<name>/` ➔ Returns dynamic customized name greeting.
- **POST** `/api/add/` ➔ Accepts JSON payload `{"a": 5, "b": 7}` and outputs `{"result": 12}`. Returns HTTP `400 Bad Request` if data structure parameters are omitted.

---

## Verification Screenshots

### 1. GET — Static Greeting
- **URL:** `http://127.0.0.1:8000/api/hello/`
- **Output Screenshot:**
![Static Greeting Output](screenshots/get-hello.png)

### 2. GET — Dynamic Greeting
- **URL:** `http://127.0.0.1:8000/api/hello/Kashi/`
- **Output Screenshot:**
![Dynamic Greeting Output](screenshots/get-Kashi.png)

### 3. POST — Math Addition Success
- **URL:** `http://127.0.0.1:8000/api/add/`
- **Payload:** `{"a": 5, "b": 7}`
- **Output Screenshot:**
![Math Success Output](screenshots/post-add.png)

### 4. POST — Validation Guard Failure
- **URL:** `http://127.0.0.1:8000/api/add/`
- **Payload:** `{"a": 5}` (Missing `b`)
- **Status Code:** `400 Bad Request`
- **Output Screenshot:**
![Validation Error Output](screenshots/post-error.png)

---

## Task 4: React "Hello" Application

### Project Execution Flow
```bash
# Initialize and launch the React application
cd day-01
npm create vite@latest frontend -- --template react
cd frontend && npm install
npm run dev
```

### Component Architecture
Developed inside `src/App.jsx` using modular UI structures:
- **Header Component:** Dynamic header accepting a custom rendering `title` prop.
- **Counter Component:** State-driven utility utilizing `useState` to manage reactive `increment`, `decrement`, and `reset` lifecycle functions.
- **Greeting Input Component:** Captures real-time text entries via input data-binding to display a fluid `"Hello <input>"` welcome string instantly.

---

## Task 5: Conceptual Documentation

### 1. REST APIs & Core HTTP Methods
A **REST API** is an architectural pattern that enables communication between a client (frontend) and a server (backend) using standard HTTP protocol requests:
- **GET:** Safely retrieves data from a resource without changing anything.
- **POST:** Submits new data to create a new resource on the server.
- **PUT:** Updates or completely replaces an existing target resource.
- **PATCH:** Modifies an existing resource with partial, specific updates.
- **DELETE:** Permanently removes a targeted resource.

### 2. HTTP Status Codes Reference Guide
- **200 OK:** The request succeeded, and data was fetched or loaded successfully.
- **201 Created:** The request succeeded and resulted in a brand-new resource being created.
- **400 Bad Request:** The server cannot understand or process the request due to missing arguments or bad syntax.
- **401 Unauthorized:** Authentication is missing or has failed (the server does not know who you are).
- **403 Forbidden:** The server understands who you are, but you do not have permission to access that file or folder.
- **404 Not Found:** The server cannot find the requested resource or URL link path.
- **500 Internal Server Error:** Something broke directly inside the backend server code.

### 3. Django Project vs. Django App
- **Django Project:** The entire website container configuration. It handles grand settings like databases, security keys, and global roadmaps (`urls.py`).
- **Django App:** A small, modular submodule within the project focused on a single independent task (e.g., our `hello` app only handles greetings and math view logic).

### 4. React Components, Props, and State
- **Components:** Independent, reusable Lego blocks of code that build the visual User Interface.
- **Props:** Read-only characteristics or parameters passed down from a parent component to a child component (like our title string).
- **State:** Active internal memory managed inside a component using hooks like `useState`. When State values change, React automatically rerenders that part of the screen.

---

## Developer Completion Checklist
- [x] 3 Django API endpoints functioning and tested.
- [x] 3 React components built and rendering correctly.
- [x] README populated with documentation and screenshots.
- [x] Verified `venv/` and `node_modules/` are excluded via `.gitignore`.

__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

# Day 02: Django ORM Database Queries Log

This document acts as a verified cheat sheet and execution log for all Object-Relational Mapping (ORM) query operations practiced inside the Django shell.

---

### Shell Setup: Mandatory Imports
*Run these commands every single time you open a fresh shell session to load the models into terminal memory:*

```python
from library.models import Author, Book
from django.db.models import Sum, Count
```

---

### Assignment Target Queries & Commands

#### 1. Retrieve All Books List
* **Command:** 
  ```python
  Book.objects.all()
  ```

#### 2. Filter Books Priced Over 500
* **Command:** 
  ```python
  Book.objects.filter(price__gt=500)
  ```

#### 3. Filter Books by One Particular Author
* **Command:** 
  ```python
  Book.objects.filter(author__name="Shivani Kushwah")
  ```

#### 4. Search for Books Whose Title Contains "python" (Case-Insensitive)
* **Command:** 
  ```python
  Book.objects.filter(title__icontains="python")
  ```

#### 5. Fetch the 5 Newest Books (Ordered by Creation Timestamp)
* **Command:** 
  ```python
  Book.objects.order_by('-created_at')[:5]
  ```

#### 6. Calculate Total Inventory Stock Across All Volumes (Aggregation)
* **Command:** 
  ```python
  Book.objects.aggregate(Sum('stock'))
  ```

#### 7. Calculate Number of Books Written Per Individual Author (Annotation)
* **Command:** 
  ```python
  Author.objects.annotate(Count('books'))
  ```

---

### Data Manipulation Queries

#### 8. Update One Book's Price Metric
* **Command:** 
  ```python
  book_to_update = Book.objects.first()
  book_to_update.price = 599.99
  book_to_update.save()
  ```

#### 9. Delete One Targeted Book Record Permanently
* **Command:** 
  ```python
  book_to_delete = Book.objects.last()
  book_to_delete.delete()
  ```

-------------------------------------------------------------------------------

## Task 4: Conceptual Questions & Notes

### 1. What are `on_delete=CASCADE`, `SET_NULL`, and `PROTECT`?

These are safety behaviors that tell Django what to do with a child record (like a **Book**) if its parent record (like an **Author**) gets deleted from the database:
- **`CASCADE`:** If an Author is deleted, Django automatically deletes all books written by that author. It cleans up everything down the line.

- **`SET_NULL`:** If an Author is deleted, the books remain in the database, but their `author` field is set to `NULL` (empty). *Note: This requires setting `null=True` on the ForeignKey field.*

- **`PROTECT`:** Django blocks the deletion of the Author as long as they have books linked to them. It forces a `ProtectedError` to prevent accidental loss of connected data.

### 2. What is `related_name`?

`related_name` creates a **reverse-lookup shortcut** from the parent model back to the child model. 
- In our code, we set `related_name='books'` on the Author ForeignKey inside the Book model.
- This allows us to easily fetch all books belonging to an author object using plain Python code (e.g., `author.books.all()`), instead of writing a manual filter query like `Book.objects.filter(author=author)`.

### 3. Why do we need migrations?

Databases do not understand Python code natively; they speak SQL. **Migrations are Django’s translation system.** 
- Every time you change your database structure in `models.py`, running `makemigrations` creates a step-by-step history blueprint file.
- Running `migrate` reads that blueprint and automatically sets up, updates, or alerts your actual SQL database tables behind the scenes without losing your existing data.

---

## Submission Checklist Verification

- [x] **Models defined and migrations applied successfully** (`0001_initial.py` compiled).
- [x] **Admin panel configured** with custom `list_display`, `search_fields`, and `list_filter`.
- [x] **Admin data inserted** (Verified 3 authors & 10 records are live in the database).
- [x] **Completed ORM queries** saved and logged in `day-02/orm_queries.md`.
- [x] **Answers to theoretical notes** documented accurately.

__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

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
__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

