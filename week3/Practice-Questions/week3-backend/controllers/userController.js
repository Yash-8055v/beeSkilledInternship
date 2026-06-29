const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/:id
// @desc    Get a single user by id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/users
// @desc    Create a new user directly (admin use case; for self-signup use /api/auth/register)
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (password) user.password = password; // pre-save hook will re-hash it

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
