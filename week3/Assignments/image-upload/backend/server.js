const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const uploadRoutes = require('./routes/uploadRoutes');
const { UPLOAD_DIR } = require('./middleware/uploadMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve uploaded images statically so the frontend can display them directly
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => {
  res.json({
    message: 'Image Upload API is running',
    endpoints: {
      list: 'GET /api/upload',
      uploadOne: 'POST /api/upload (field name: image)',
      uploadMany: 'POST /api/upload/multiple (field name: images)',
      remove: 'DELETE /api/upload/:filename',
      files: 'served statically at /uploads/<filename>',
    },
  });
});

app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

// Final error handler (catches anything not already handled)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
