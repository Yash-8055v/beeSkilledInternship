import React, { useEffect, useState } from 'react';
import api from './api.js';
import Dropzone from './components/Dropzone.jsx';
import Gallery from './components/Gallery.jsx';

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/upload');
      setImages(data);
    } catch (err) {
      setError('Could not load the gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (files) => {
    if (files.length === 1) {
      const formData = new FormData();
      formData.append('image', files[0]);
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((prev) => [data, ...prev]);
    } else {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));
      const { data } = await api.post('/api/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((prev) => [...data, ...prev]);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await api.delete(`/api/upload/${filename}`);
      setImages((prev) => prev.filter((img) => img.filename !== filename));
    } catch (err) {
      setError('Could not delete that image.');
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">
          Drop<span className="accent">box</span>
        </h1>
        <p className="app-subtitle">Upload images with Multer, preview and manage them right here.</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <Dropzone onUploadComplete={handleUpload} />

      <Gallery images={images} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
