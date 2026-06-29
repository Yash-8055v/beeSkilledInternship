import React, { useState } from 'react';

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function Gallery({ images, loading, onDelete }) {
  const [lightboxUrl, setLightboxUrl] = useState(null);

  return (
    <section className="gallery-section">
      <div className="gallery-heading">
        <h2>Uploaded images</h2>
        <span className="gallery-count">{images.length} file{images.length === 1 ? '' : 's'}</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading gallery…</div>
      ) : images.length === 0 ? (
        <div className="empty-gallery">No images uploaded yet — drop one above to get started.</div>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <div className="gallery-card" key={img.filename}>
              <div className="gallery-image-wrap">
                <img src={img.url} alt={img.originalName} onClick={() => setLightboxUrl(img.url)} />
              </div>
              <div className="gallery-card-footer">
                <span className="gallery-card-name" title={img.originalName}>
                  {img.originalName}
                </span>
                <button className="delete-btn" onClick={() => onDelete(img.filename)} aria-label="Delete image">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxUrl && (
        <div className="lightbox-overlay" onClick={() => setLightboxUrl(null)}>
          <img src={lightboxUrl} alt="Full size preview" />
        </div>
      )}
    </section>
  );
}
