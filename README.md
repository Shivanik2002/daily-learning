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


#______________________________________________________________________________________________________________

# Day 04 Tasks - Authentication, Custom User & Permissions Notes

## 📋 Task Checklist Status
- [x] Custom User Model (Email-based authentication with roles)
- [x] JWT Integration (SimpleJWT framework with a 60-minute token lifetime restriction)
- [x] Fine-Grained Permissions (Custom IsSellerOrReadOnly & admin restrictions)
- [x] 5 Postman Verification Test Case Screenshots Saved

---

## Core Concept Notes

### Why set AUTH_USER_MODEL before the first migrate?
Django’s internal applications (like `admin`, `auth`, and `contenttypes`) create initial database tables and relational foreign key constraints pointing to the user model during their very first migration cycle. 

If you run migrations using the default configuration first and try to change it to a custom model later, it breaks existing foreign key constraints inside the database tables. Defining `AUTH_USER_MODEL = 'library.User'` before the first migrate ensures Django constructs the database schema cleanly around your custom user setup from day one without throwing schema conflicts.

---

## 🌐 API Endpoint Routing Matrix

| HTTP Method | API URL Path | Target Action / Operational Logic | Access Constraint |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register/` | Public registration wrapper. Validates role constraints (blocks admin role signups) and password minimum bounds (min 6 chars). | Open to All |
| **POST** | `/api/auth/login/` | Evaluates email credentials against the custom manager layout and returns valid access & refresh token pairs. | Open to All |
| **POST** | `/api/auth/refresh/` | SimpleJWT token refresh view to renew active access token lifespans. | Open to All |
| **GET / PATCH** | `/api/auth/me/` | Retrieves or updates current user profile data context. Role and Email are restricted to read-only fields. | Authenticated Users Only |
| **GET** | `/api/users/` | Administrative global system user list dashboard. | Administrators Only |
| **GET** | `/api/books/` | Lists all active book assets inside the database. | Open to All |
| **POST** | `/api/books/` | Creates a new book entry record and auto-binds the authenticated requester as the owner metadata anchor. | Sellers Only |
| **PUT / PATCH** | `/api/books/<id>/` | Mutates existing book records. Restricted to the exact user who created the asset row. | Asset Owner Only |
| **DELETE** | `/api/books/<id>/` | Purges book database entries permanently. Restricted to the exact creator. | Asset Owner Only |

---

## 📸 Task 4 — Postman Verification Screenshots

### 1. Blocked Admin Registration Privilege Attempt
* **Path:** `POST /api/auth/register/`
* **Status Expected:** `400 Bad Request`
![Register Admin Failure](screenshots/01_register_admin_fail.png)

### 2. Token Retrieval Authentication Check
* **Path:** `POST /api/auth/login/`
* **Status Expected:** `200 OK`
![Login Tokens Success](screenshots/02_login_success.png)

### 3. Anonymous Book Post Blocked
* **Path:** `POST /api/books/`
* **Status Expected:** `401 Unauthorized`
![Anonymous Block 401](screenshots/03_anon_post_401.png)

### 4. Customer Book Post Blocked
* **Path:** `POST /api/books/`
* **Status Expected:** `403 Forbidden`
![Customer Block 403](screenshots/04_customer_post_403.png)

### 5. Cross-Seller Data Mutation Isolation Assertion
* **Path:** `PATCH /api/books/1/`
* **Status Expected:** `403 Forbidden`
![Cross Seller Block 403](screenshots/05_cross_seller_patch_403.png)