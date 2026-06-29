const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../middleware/uploadMiddleware');

// Simple in-memory metadata store, keyed by filename.
// (For a production app you'd persist this in MongoDB alongside the file path,
// but for this assignment the uploads folder + this index is enough.)
let imageRecords = [];

const buildRecord = (file, req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `${baseUrl}/uploads/${file.filename}`,
    uploadedAt: new Date().toISOString(),
  };
};

// POST /api/upload - single image
const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Use field name "image".' });
  }
  const record = buildRecord(req.file, req);
  imageRecords.unshift(record);
  res.status(201).json(record);
};

// POST /api/upload/multiple - up to 10 images
const uploadMultiple = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded. Use field name "images".' });
  }
  const records = req.files.map((file) => buildRecord(file, req));
  imageRecords.unshift(...records);
  res.status(201).json(records);
};

// GET /api/upload - list all uploaded images
const listImages = (req, res) => {
  res.json(imageRecords);
};

// DELETE /api/upload/:filename
const deleteImage = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.unlinkSync(filePath);
  imageRecords = imageRecords.filter((r) => r.filename !== filename);

  res.json({ message: 'Image deleted successfully', filename });
};

module.exports = { uploadSingle, uploadMultiple, listImages, deleteImage };
