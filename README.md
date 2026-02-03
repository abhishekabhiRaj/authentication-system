# authentication-system

## Project Structure

```
login_system/
├── backend/           # Node.js API + Aiven MySQL
│   ├── src/
│   │   ├── modules/
│   │   │   ├── routes.js  # Auto-registers APIs from each module (no per-module routes file)
│   │   │   ├── auth/      # Auth (login, signup)
│   │   │   │   ├── index.js
│   │   │   │   ├── controllers/
│   │   │   │   ├── models/
│   │   │   │   └── services/
│   │   │   └── product/   # Product API (list, create)
│   │   │       ├── index.js
│   │   │       ├── controllers/
│   │   │       ├── models/
│   │   │       └── services/
│   │   ├── server.js
│   │   └── db.js          # MySQL connection (Aiven)
│   ├── .env.example
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

### 1. Backend (with Aiven MySQL)

1. **Get Aiven MySQL credentials**  
   Open [Aiven Console](https://console.aiven.io) → your project → **MySQL** service → **Overview**. Copy:
   - Host, Port, User, Password, Database (or the connection URI).

2. **Configure env**  
   In `backend/`, copy `.env.example` to `.env` and fill in your values:

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (or MYSQL_URI)
   ```

3. **Start the server**:

   ```bash
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

Use a user that exists in your `users` table (create the table and add users in Aiven MySQL as needed; passwords must be bcrypt-hashed).

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
  "user": { "id": 1, "email": "user@example.com" },
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": "15m"
}
```

**Error (400 – validation / 401 – invalid credentials):**

```json
{
  "success": false,
  "message": "Email and password are required."
}
```

### `POST /api/signup`

**Request body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success (201):**

```json
{
  "success": true,
  "message": "Sign up successful.",
  "user": { "id": 1, "email": "user@example.com" },
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": "15m"
}
```

**Error (400 – validation / 409 – email already exists):**

```json
{
  "success": false,
  "message": "An account with this email already exists."
}
```

### JWT and cookies

- **Login/signup** return tokens in the response body and set **HTTP-only cookies**: `accessToken` (15m), `refreshToken` (7d). The frontend uses these cookies for authenticated requests.
- **Product API** (`GET /api/products`, `POST /api/products`) require a valid access token:
  - **Cookie:** `accessToken` (sent automatically with `credentials: 'include'`)
  - Or header: `Authorization: Bearer <accessToken>`
  - Missing or invalid token → **401**.
- **Refresh:** `POST /api/refresh` with body `{ "refreshToken": "..." }` (or cookie) returns new tokens and sets new cookies.
- **Logout:** `POST /api/logout` clears the token cookies.

Set in backend `.env`: `JWT_SECRET`, `JWT_REFRESH_SECRET` (optional; see `.env.example`).

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Node.js, Express, CORS, **MySQL (Aiven)** — [Aiven MySQL](https://console.aiven.io) for user storage

## Submission

- GitHub repo (public or private with access)
- This README with setup steps
- Clear commit history
