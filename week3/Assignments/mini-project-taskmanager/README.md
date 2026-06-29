# Mini Project — Task Manager Application

A complete task tracking web app: user login, a kanban-style board (To do / In progress / Done), priority levels, due dates, and filtering/search. React frontend, Express backend, MongoDB storage.

## What's included

- **Backend** (`/backend`): Express + Mongoose, with:
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
  - `GET /api/tasks` — supports `?status=`, `?priority=`, `?search=` query params
  - `GET /api/tasks/stats` — counts by status, used for the dashboard summary cards
  - Full CRUD on tasks, each scoped to the logged-in user
  - Passwords hashed with bcrypt; JWT-based auth
- **Frontend** (`/frontend`): React (Vite) app with:
  - Login / register flow with protected routes
  - A 3-column kanban board (To do / In progress / Done) — change a task's status right from its card
  - Priority levels (low/medium/high) shown as a colored left border + badge
  - Optional due dates
  - Filter by priority, live search by title
  - Summary stat cards (total / to do / in progress / done)

## Project structure

```
mini-project-taskmanager/
├── backend/
│   ├── config/db.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── controllers/authController.js
│   ├── controllers/taskController.js
│   ├── middleware/authMiddleware.js
│   ├── middleware/errorMiddleware.js
│   ├── routes/authRoutes.js
│   ├── routes/taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── components/ProtectedRoute.jsx
    │   ├── components/TaskCard.jsx
    │   ├── components/TaskForm.jsx
    │   ├── pages/Login.jsx
    │   ├── pages/Register.jsx
    │   ├── pages/Dashboard.jsx
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
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager_db
JWT_SECRET=put_a_long_random_string_here
JWT_EXPIRES_IN=1d
```

Make sure MongoDB is running locally, or point `MONGO_URI` at a MongoDB Atlas cluster.

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5175`.

## How it works

1. Visit `http://localhost:5175` → redirected to `/login` since you're not signed in.
2. Register an account, then you land on your dashboard automatically.
3. Add a task — give it a title, optional description, priority, and due date.
4. Move tasks between columns using the status dropdown on each card, or edit/delete them with the icon buttons.
5. Use the priority chips or the search box to filter the board — both talk straight to the backend's query params.
6. Stat cards at the top update as you add, complete, or remove tasks.

## API quick reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/register` | No | Create account, returns JWT |
| POST | `/api/auth/login` | No | Log in, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/tasks` | Yes | List tasks (filters: `status`, `priority`, `search`) |
| GET | `/api/tasks/stats` | Yes | Counts by status |
| GET | `/api/tasks/:id` | Yes | Get one task |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

All `/api/tasks` requests need header: `Authorization: Bearer <token>`.

## Notes

- Tasks have a `status` (`todo` / `in-progress` / `done`) and `priority` (`low` / `medium` / `high`), plus an optional `dueDate`.
- Every task is tied to a `user` field, so each account only ever sees and manages its own tasks — confirmed by registering two separate accounts and checking each board independently.
