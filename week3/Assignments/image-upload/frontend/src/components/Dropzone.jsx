import React, { useState, useRef } from 'react';
import { formatBytes } from '../utils.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function Dropzone({ onUploadComplete }) {
  const [pending, setPending] = useState([]); // { file, previewUrl }
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const validateAndAdd = (fileList) => {
    setError('');
    const files = Array.from(fileList);
    const valid = [];
    const errors = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported type`);
        return;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: exceeds 5MB`);
        return;
      }
      valid.push({ file, previewUrl: URL.createObjectURL(file) });
    });

    if (errors.length) setError(errors.join(' · '));
    if (valid.length) setPending((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const removePending = (index) => {
    setPending((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const handleUploadAll = async () => {
    if (pending.length === 0) return;
    setUploading(true);
    setError('');
    try {
      await onUploadComplete(pending.map((p) => p.file));
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPending([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        className={`dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => validateAndAdd(e.target.files)}
        />
        <div className="dropzone-icon">
          <UploadIcon />
        </div>
        <p className="dropzone-text">Drag images here, or click to browse</p>
        <p className="dropzone-hint">JPEG · PNG · WEBP · GIF — up to 5MB each</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {pending.length > 0 && (
        <>
          <div className="pending-grid">
            {pending.map((p, i) => (
              <div className="pending-card" key={p.previewUrl}>
                <img src={p.previewUrl} alt={p.file.name} />
                <div className="pending-card-meta">{formatBytes(p.file.size)}</div>
                <button className="pending-remove" onClick={() => removePending(i)} aria-label="Remove">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="upload-actions">
            <button className="upload-btn" onClick={handleUploadAll} disabled={uploading}>
              {uploading ? 'Uploading…' : `Upload ${pending.length} image${pending.length === 1 ? '' : 's'}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
