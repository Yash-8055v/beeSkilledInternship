const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const JWT_SECRET = process.env.JWT_SECRET || 'notes-secret-key';
const DB_NAME = 'notes_app';

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

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name: name || '',
      createdAt: new Date()
    });

    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NOTES ROUTES ====================

// GET all notes for current user
app.get('/notes', verifyToken, async (req, res) => {
  try {
    const notes = await db.collection('notes').find({ userId: new ObjectId(req.userId) }).toArray();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single note
app.get('/notes/:id', verifyToken, async (req, res) => {
  try {
    const note = await db.collection('notes').findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.userId)
    });

    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a new note
app.post('/notes', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const result = await db.collection('notes').insertOne({
      userId: new ObjectId(req.userId),
      title,
      content: content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      _id: result.insertedId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a note
app.put('/notes/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { updatedAt: new Date() };

    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a note
app.delete('/notes/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.collection('notes').deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.userId)
    });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB();
app.listen(PORT, () => {
  console.log(`Notes app running on http://localhost:${PORT}`);
});
