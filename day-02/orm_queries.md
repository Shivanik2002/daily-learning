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
