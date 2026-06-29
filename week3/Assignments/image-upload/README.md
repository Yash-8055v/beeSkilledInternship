# Assignment 2 — Image Upload Feature

A standalone full-stack app: an Express + Multer file upload API, and a React frontend to drag-and-drop, preview, and manage uploaded images.

## What's included

- **Backend** (`/backend`):
  - `POST /api/upload` — upload a single image (field name `image`)
  - `POST /api/upload/multiple` — upload up to 10 images at once (field name `images`)
  - `GET /api/upload` — list all uploaded images
  - `DELETE /api/upload/:filename` — delete an image
  - Files are validated (JPEG/PNG/WEBP/GIF only, 5MB max) and saved to `backend/uploads/`, then served statically at `/uploads/<filename>`
- **Frontend** (`/frontend`): a React (Vite) app with:
  - A drag-and-drop zone (also click-to-browse) with local preview before upload
  - Multi-file upload support
  - A gallery grid of uploaded images with a click-to-zoom lightbox and delete button

## Project structure

```
assignment2-upload/
├── backend/
│   ├── controllers/uploadController.js
│   ├── middleware/uploadMiddleware.js   ← Multer config (storage, validation, limits)
│   ├── routes/uploadRoutes.js
│   ├── uploads/                          ← uploaded files land here
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/Dropzone.jsx
    │   ├── components/Gallery.jsx
    │   ├── api.js
    │   ├── utils.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs at `http://localhost:4000`. No database needed — uploaded file metadata is tracked in memory and the files themselves live in `backend/uploads/`.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5174`.

## How it works

1. Open `http://localhost:5174`.
2. Drag an image (or several) onto the dropzone, or click it to browse — you'll see local previews immediately.
3. Click "Upload" to send them to the backend. Multer validates type and size, saves the file to `backend/uploads/`, and the API returns its URL.
4. The gallery below updates immediately and reflects every image currently on the server.
5. Click any image to view it full-size; click the trash icon to delete it (removes both the file on disk and its gallery entry).

## API quick reference

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/api/upload` | List all uploaded images |
| POST | `/api/upload` | Upload one image (form field: `image`) |
| POST | `/api/upload/multiple` | Upload up to 10 images (form field: `images`) |
| DELETE | `/api/upload/:filename` | Delete an image by filename |

Uploaded files are served at: `http://localhost:4000/uploads/<filename>`

## Notes

- Max file size: 5MB per image. Allowed types: JPEG, PNG, WEBP, GIF.
- The in-memory image index resets if you restart the backend, but the actual files in `backend/uploads/` remain — if you want full persistence across restarts, the next step would be storing this metadata in MongoDB (see Assignment 1 / Mini Project for that pattern).
