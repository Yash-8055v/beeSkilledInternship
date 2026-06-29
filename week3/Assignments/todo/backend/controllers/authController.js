const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

const USERS_COLLECTION = 'users';

const generateToken = (user) => {
  return jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = getDB();
    const existing = await db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection(USERS_COLLECTION).insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    });

    const user = { _id: result.insertedId, email: email.toLowerCase() };

    res.status(201).json({
      _id: result.insertedId,
      name,
      email: email.toLowerCase(),
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDB();
    const user = await db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const db = getDB();
    const user = await db
      .collection(USERS_COLLECTION)
      .findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0 } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getMe };
