const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const COLLECTION_NAME = 'tasks';

// GET /api/tasks - only tasks belonging to the logged-in user
const getTasks = async (req, res) => {
  try {
    const db = getDB();
    const tasks = await db
      .collection(COLLECTION_NAME)
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const db = getDB();
    const task = await db.collection(COLLECTION_NAME).findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const db = getDB();
    const newTask = {
      title,
      description: description || '',
      completed: completed || false,
      userId: req.user.id,
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(newTask);

    res.status(201).json({ _id: result.insertedId, ...newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(req.params.id), userId: req.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(req.params.id) });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
