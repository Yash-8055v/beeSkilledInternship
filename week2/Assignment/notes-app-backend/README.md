# Notes App Backend

A complete backend for a notes-taking app with user authentication and CRUD operations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running or update MONGO_URI in .env

3. Start the server:
```bash
npm start
```

## Features

- User registration and login
- JWT-based authentication
- Create, read, update, and delete notes
- User-specific notes (isolated by userId)
- Secure routes with middleware

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Notes (All require JWT token)
- `GET /notes` - Get all user's notes
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

## Example Usage

**Register:**
```
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login:**
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Create Note:**
```
POST /notes
Authorization: Bearer <token>
{
  "title": "My First Note",
  "content": "This is the note content"
}
```

**Get All Notes:**
```
GET /notes
Authorization: Bearer <token>
```

**Update Note:**
```
PUT /notes/:noteId
Authorization: Bearer <token>
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Delete Note:**
```
DELETE /notes/:noteId
Authorization: Bearer <token>
```
