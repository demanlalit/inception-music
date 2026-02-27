## Inception Music – Spotify-like MVP

Inception Music is a production-ready MVP Spotify-like web app with a Node/Express/MongoDB backend and a React (Vite) frontend, featuring JWT auth, song upload/streaming, playlists, likes, and a global audio player.

### Tech Stack

- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer, Cloudinary (or local disk for dev)
- **Frontend**: React (Vite), React Router, Context API, Axios, HTML5 `<audio>`, responsive dark UI

---

### Project Structure

- **backend**
  - `server.js`
  - `config/`
    - `db.js`
    - `cloudinary.js`
  - `controllers/`
    - `authController.js`
    - `userController.js`
    - `songController.js`
    - `playlistController.js`
    - `likeController.js`
  - `routes/`
    - `authRoutes.js`
    - `userRoutes.js`
    - `songRoutes.js`
    - `playlistRoutes.js`
    - `likeRoutes.js`
  - `models/`
    - `User.js`
    - `Song.js`
    - `Playlist.js`
  - `middleware/`
    - `authMiddleware.js`
    - `errorMiddleware.js`
  - `utils/generateToken.js`
- **frontend**
  - `index.html`
  - `vite.config.js`
  - `src/`
    - `main.jsx`, `App.jsx`, `styles.css`
    - `context/` (`AuthContext.jsx`, `PlayerContext.jsx`)
    - `hooks/` (`useAuth.js`, `usePlayer.js`)
    - `services/` (`api.js`, `authService.js`, `songService.js`, `playlistService.js`, `likeService.js`, `userService.js`)
    - `components/` (`Layout/`, `SongCard.jsx`, `PlaylistCard.jsx`)
    - `pages/` (auth, home, library, playlist, profile, upload, not-found)

---

### MongoDB Schemas

- **User (`models/User.js`)**
  - `name: String` (required)
  - `email: String` (required, unique, lowercase, trimmed)
  - `password: String` (required, min 6; hashed with bcryptjs in a pre-save hook)
  - `avatarUrl: String` (optional)
  - Timestamps enabled (`createdAt`, `updatedAt`).
  - Instance methods:
    - `matchPassword(candidatePassword)` → compares with bcrypt.
    - Custom `toJSON` removing `password` before returning to clients.

- **Song (`models/Song.js`)**
  - `title: String` (required, trimmed)
  - `artist: String` (required, trimmed)
  - `album: String` (optional)
  - `coverUrl: String` (optional; Cloudinary/local URL)
  - `audioUrl: String` (required; Cloudinary/local URL)
  - `duration: Number` (optional, seconds)
  - `uploadedBy: ObjectId` → `User` (optional)
  - `likes: ObjectId[]` → `User[]`
  - Text index on `title` and `artist` for search.

- **Playlist (`models/Playlist.js`)**
  - `name: String` (required)
  - `description: String` (optional)
  - `user: ObjectId` → `User` (required; owner)
  - `songs: ObjectId[]` → `Song[]`
  - Timestamps enabled.

---

### REST API Endpoints

Base URL: `http://localhost:5000/api`

#### Auth

- **POST** `/auth/register`
  - Body: `{ name, email, password }`
  - Response: `{ user, token }`
- **POST** `/auth/login`
  - Body: `{ email, password }`
  - Response: `{ user, token }`

#### Users (JWT required)

- **GET** `/users/me`
  - Returns current user profile.
- **PUT** `/users/me`
  - Body: `{ name?, avatarUrl? }`
  - Returns updated user.

#### Songs

- **POST** `/songs` (JWT required, file upload)
  - Multipart form-data:
    - `title` (string, required)
    - `artist` (string, required)
    - `album` (string, optional)
    - `audio` (file, required – audio)
    - `cover` (file, optional – image)
  - Stores files on Cloudinary or local disk; metadata in MongoDB.
  - Response: `Song` document.
- **GET** `/songs`
  - Returns all songs (latest first).
- **GET** `/songs/search?query=...`
  - Case-insensitive search on title or artist.
- **GET** `/songs/:id`
  - Returns one song by ID.
- **GET** `/songs/:id/stream`
  - Redirects to the `audioUrl` for direct streaming from Cloudinary/S3/local.

#### Playlists (JWT required)

- **POST** `/playlists`
  - Body: `{ name, description? }`
  - Creates playlist for current user.
- **GET** `/playlists`
  - Returns all playlists for current user (songs populated).
- **GET** `/playlists/:id`
  - Returns a single playlist for current user with `songs` populated.
- **POST** `/playlists/:id/songs`
  - Body: `{ songId }`
  - Adds song to playlist (idempotent).
- **DELETE** `/playlists/:id/songs/:songId`
  - Removes song from playlist.

#### Likes (JWT required)

- **GET** `/likes`
  - Returns songs liked by current user.
- **POST** `/likes/:songId`
  - Adds current user to song's `likes` array.
- **DELETE** `/likes/:songId`
  - Removes current user from song's `likes` array.

#### Misc

- **GET** `/health`
  - Simple health check.

---

### Environment Variables

See `.env.example` at the project root. Copy it to `.env` and fill in values:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/spotify_clone_mvp
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Storage
STORAGE_DRIVER=cloudinary   # or "local" for disk storage in development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
VITE_API_URL=http://localhost:5000/api
```

No credentials are hardcoded; everything sensitive is driven by environment variables.

---

### Running Locally – Step-by-Step

#### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- A Cloudinary account if you want cloud storage, otherwise use local disk.

#### 2. Clone and configure

```bash
cd inception
cp .env.example .env
# edit .env to match your MongoDB and Cloudinary settings
```

If you prefer local file storage for audio:

- Set `STORAGE_DRIVER=local` and leave Cloudinary keys blank. Files will be written to `backend/uploads`, and `audioUrl`/`coverUrl` will point to `http://localhost:5000/uploads/...`.

#### 3. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

#### 4. Start backend

```bash
cd ../backend
npm run dev
```

The API will be available at `http://localhost:5000/api`.

#### 5. Start frontend

```bash
cd ../frontend
npm run dev
```

Visit the printed Vite URL (default `http://localhost:5173`).

---

### Frontend Overview

- **Auth flow**
  - `AuthContext` holds `user`/`token`, persists JWT in `localStorage`, and exposes `login`, `register`, and `logout`.
  - On app load, existing token is validated via `GET /users/me`.
  - Routes in `App.jsx` are wrapped in a `ProtectedRoute` component that redirects unauthenticated users to `/login`.

- **Global player**
  - `PlayerContext` manages queue, current index, and play/pause/next/prev.
  - `PlayerBar` (always visible) renders an HTML5 `<audio>` element and controls playback.
  - Clicking a `SongCard` or track row calls `playSong(song, list)` to update the global queue.

- **Pages**
  - `LoginPage` / `RegisterPage`: JWT-based login/registration.
  - `HomePage`: lists songs, supports search by title/artist, allows like/unlike and play.
  - `LibraryPage`: shows user playlists, lets you create playlists, and displays liked songs.
  - `PlaylistPage`: shows a playlist with populated songs, allows adding/removing songs, and plays from the playlist queue.
  - `ProfilePage`: lets users view/update profile `name` and `avatarUrl`.
  - `UploadPage`: song upload form (title, artist, album, audio file, cover image).

---

### Error Handling

- Centralized error middleware in `middleware/errorMiddleware.js` handles unexpected errors and formats responses, hiding stack traces in production.
- `express-async-errors` is used so async controllers can `throw` and be caught by the error middleware.
- Auth middleware (`authMiddleware.js`) validates JWTs and attaches `req.user`, sending `401` with clear messages on invalid/missing tokens.
- Frontend surfaces basic API errors on forms (login, register, upload) via status messages.

---

### Notes for Production Hardening

- Add rate limiting, input validation (e.g. Joi/Zod), stricter CORS, and file size/type limits for uploads.
- Configure Cloudinary/S3 with signed URLs and folder-level access policy as needed.
- Put the frontend behind a proper static file host (e.g. Vercel, Netlify) and the backend behind a reverse proxy (e.g. Nginx) with HTTPS.

### AUTHOR
- LALIT VERMA
