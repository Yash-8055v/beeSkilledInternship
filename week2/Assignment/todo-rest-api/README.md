# To-Do List REST API

A simple REST API for managing tasks with MongoDB and Express.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running on localhost:27017 or update MONGO_URI in .env

3. Start the server:
```bash
npm start
```

## Endpoints

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Example Requests

**Create Task:**
```
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Update Task:**
```
PUT /tasks/:id
Content-Type: application/json

{
  "completed": true
}
```

**Delete Task:**
```
DELETE /tasks/:id
```
