import { useState } from 'react';
import { uploadSongRequest } from '../services/songService';

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audio || !title || !artist) {
      setStatus('Please provide title, artist, and audio file');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      await uploadSongRequest({
        title,
        artist,
        album,
        audio,
        cover,
      });
      setTitle('');
      setArtist('');
      setAlbum('');
      setAudio(null);
      setCover(null);
      e.target.reset();
      setStatus('Upload successful');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Upload song</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <div className="form-label">Title</div>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="form-label">Artist</div>
          <input
            className="form-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="form-label">Album (optional)</div>
          <input
            className="form-input"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
        </div>
        <div>
          <div className="form-label">Audio file</div>
          <input
            className="form-file"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <div className="form-label">Cover image (optional)</div>
          <input
            className="form-file"
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {status && <div className="form-error">{status}</div>}
      </form>
    </div>
  );
};

export default UploadPage;

