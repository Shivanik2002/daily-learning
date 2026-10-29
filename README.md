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

# Start Server
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
