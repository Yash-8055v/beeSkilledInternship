const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getTaskStats);
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
