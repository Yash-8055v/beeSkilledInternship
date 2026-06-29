# Assignment 1 — Full Stack To-Do Application

Connects the Week 2 To-Do API (Express + MongoDB) with a React frontend, adds JWT authentication, and scopes every task to its owning user.

## What's included

- **Backend** (`/backend`): your Week 2 `tasks` REST API, extended with:
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - Every `/api/tasks` route now requires a JWT and only returns/affects the logged-in user's own tasks
  - Passwords hashed with bcrypt; users stored in a `users` collection in the same database
- **Frontend** (`/frontend`): a React (Vite) app with:
  - Routing via `react-router-dom` (`/login`, `/register`, `/` for the task list)
  - A protected route that redirects to `/login` if not authenticated
  - Full CRUD UI: add, edit (inline), complete/uncomplete, delete
  - Filter tabs: All / Active / Done

## Project structure

```
assignment1-todo/
├── backend/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/taskController.js
│   ├── middleware/authMiddleware.js
│   ├── routes/authRoutes.js
│   ├── routes/taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── components/ProtectedRoute.jsx
    │   ├── components/TaskItem.jsx
    │   ├── pages/Login.jsx
    │   ├── pages/Register.jsx
    │   ├── pages/Tasks.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/bee-skilled
JWT_SECRET=put_a_long_random_string_here
JWT_EXPIRES_IN=1d
```

Make sure MongoDB is running locally, or point `MONGO_URI` at a MongoDB Atlas cluster.

```bash
npm run dev
```

Backend runs at `http://localhost:3000`.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`. It talks to the backend at the URL set in `frontend/.env` (`VITE_API_URL`).

## How it works

1. Visit `http://localhost:5173` → since you're not logged in, you're redirected to `/login`.
2. Click "Create an account" → register with name/email/password.
3. You're logged in automatically (JWT saved in `localStorage`) and taken to your task list.
4. Add, complete, edit, and delete tasks — all requests carry your JWT and only touch your own tasks.
5. Log out and register a second account to confirm each user only ever sees their own tasks.

## API quick reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/tasks` | Yes | List your tasks |
| GET | `/api/tasks/:id` | Yes | Get one of your tasks |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

All `/api/tasks` requests need header: `Authorization: Bearer <token>`.
