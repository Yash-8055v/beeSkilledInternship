const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'todo_db';
const COLLECTION_NAME = 'tasks';

let db;

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// GET all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(req.params.id) });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await db.collection(COLLECTION_NAME).insertOne({
      title,
      description: description || '',
      completed: completed || false,
      createdAt: new Date()
    });

    res.status(201).json({ _id: result.insertedId, title, description, completed: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
