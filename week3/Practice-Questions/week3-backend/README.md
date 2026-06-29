# Week 3 – Backend (Node.js + Express + MongoDB)

A REST API for managing users, built with Express and MongoDB (via Mongoose), with JWT-based authentication.

Covers all 5 tasks:
1. REST API for managing users
2. Express connected to MongoDB via Mongoose
3. Full CRUD operations on users
4. JWT-based authentication
5. Postman collection to test every route

## Project Structure

```
week3-backend/
├── config/
│   └── db.js                  # MongoDB connection (Mongoose)
├── controllers/
│   ├── authController.js      # register, login, getMe
│   └── userController.js      # CRUD for users
├── middleware/
│   ├── authMiddleware.js       # JWT verification (protect) + role check (authorize)
│   └── errorMiddleware.js      # centralized error handling, 404 handler
├── models/
│   └── User.js                 # Mongoose schema, password hashing
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── server.js                   # app entry point
├── package.json
├── .env.example                 # copy to .env and fill in your values
└── Week3-Backend-API.postman_collection.json
```

## 1. Prerequisites

- Node.js (v18+) installed
- MongoDB running, either:
  - **Local**: install MongoDB Community Server and run `mongod`, OR
  - **Cloud**: a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (recommended if you don't want to install MongoDB locally)
- [Postman](https://www.postman.com/downloads/) to test the API

## 2. Setup

```bash
# 1. Unzip and enter the project
cd week3-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Open `.env` and set `MONGO_URI`:

```
# Local MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/week3_userdb

# OR MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/week3_userdb
```

Also set a real `JWT_SECRET` (any long random string).

## 3. Run the server

```bash
# normal start
npm start

# auto-restart on file changes (dev)
npm run dev
```

You should see:
```
MongoDB connected: <host>
Server running on port 5000
```

Visit `http://localhost:5000/` in your browser — you should see a JSON welcome message confirming the API is running.

## 4. API Reference

Base URL: `http://localhost:5000`

### Auth routes (`/api/auth`) — public unless noted

| Method | Endpoint | Description | Auth required |
|--------|----------|--------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in, returns JWT | No |
| GET | `/api/auth/me` | Get logged-in user's profile | Yes |

**Register / Login body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
(`name` is not needed for login.)

**Response (register/login):**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### User CRUD routes (`/api/users`) — all require JWT

Add header: `Authorization: Bearer <token>` (token from register/login response).

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get a single user |
| POST | `/api/users` | Create a user directly |
| PUT | `/api/users/:id` | Update a user (name/email/password/role) |
| DELETE | `/api/users/:id` | Delete a user |

## 5. Testing with Postman

1. Open Postman → **Import** → select `Week3-Backend-API.postman_collection.json` from this folder.
2. Run **Auth → Register User** (or **Login User**) first. A script automatically saves the returned `token` and `userId` into collection variables.
3. Run any request under **Users CRUD** — the saved token is automatically attached as the `Authorization` header.
4. Try deleting/updating the registered user, then re-run **Get All Users** to confirm changes.

If you'd rather not import the collection, you can test manually in Postman:
1. `POST /api/auth/register` with a JSON body → copy the `token` from the response.
2. For every `/api/users` request, go to the **Authorization** tab → type **Bearer Token** → paste the token (or add header `Authorization: Bearer <token>` manually).

## 6. Notes

- Passwords are hashed with bcrypt before being stored; they are never returned in API responses.
- JWTs expire after the time set in `JWT_EXPIRES_IN` (default 1 day).
- Duplicate email registration, invalid IDs, and validation errors all return clean JSON error messages with appropriate status codes.
