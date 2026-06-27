# User Authentication API

User registration and login with JWT-based authentication and bcrypt password encryption.

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

## Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT token
- `GET /auth/me` - Get current user (requires token)

## Example Requests

**Register:**
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Login:**
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Get Current User (Protected):**
```
GET /auth/me
Authorization: Bearer <your_jwt_token>
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Token expiration (24 hours)
- Protected routes with middleware
