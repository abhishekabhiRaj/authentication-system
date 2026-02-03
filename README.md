# authentication-system

Simple Login Application — a minimal login app with a **React** frontend and **Node.js** backend. Built for a coding assignment (evaluates code quality, structure, readability, and best practices).

## Features

- **Frontend (React):** Login screen with Email and Password, basic validation (required, email format), success/error messages, clean folder structure, and a dedicated service for API calls.
- **Backend (Node.js):** `POST /api/login` that validates input and returns success or error. Uses a hardcoded user (no database).

## Project Structure

```
login_system/
├── backend/           # Node.js API
│   ├── server.js
│   └── package.json
├── frontend/          # React (Vite) app
│   ├── src/
│   │   ├── components/   # Login form
│   │   ├── services/     # Auth API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup

### Prerequisites

- **Node.js** (v16 or newer) and **npm**

### 1. Backend

```bash
cd backend
npm install
npm start
```

Server runs at **http://localhost:3001**.

### 2. Frontend

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** and proxies `/api` to the backend.

### 3. Test Login

Use this hardcoded user:

- **Email:** `user@example.com`
- **Password:** `password123`

## API

### `POST /api/login`

**Request body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "user": { "email": "user@example.com" }
}
```

**Error (400 – validation / 401 – invalid credentials):**

```json
{
  "success": false,
  "message": "Email and password are required."
}
```

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express, CORS

## Submission

- GitHub repo (public or private with access)
- This README with setup steps
- Clear commit history
