import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  addSongToPlaylistRequest,
  fetchPlaylistById,
  removeSongFromPlaylistRequest,
} from '../services/playlistService';
import { fetchSongs } from '../services/songService';
import { usePlayer } from '../hooks/usePlayer';

const PlaylistPage = () => {
  const { id } = useParams();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState('');

  const load = async () => {
    const [pl, songs] = await Promise.all([
      fetchPlaylistById(id),
      fetchSongs(),
    ]);
    setPlaylist(pl);
    setAllSongs(songs);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedSongId) return;
    await addSongToPlaylistRequest(id, selectedSongId);
    setSelectedSongId('');
    await load();
  };

  const handleRemove = async (songId) => {
    await removeSongFromPlaylistRequest(id, songId);
    await load();
  };

  if (!playlist) {
    return <div>Loading playlist...</div>;
  }

  return (
    <div>
      <h1 className="page-title">{playlist.name}</h1>
      {playlist.description && (
        <div style={{ marginBottom: '0.75rem', color: '#9ca3af' }}>
          {playlist.description}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
      >
        <select
          className="form-input"
          value={selectedSongId}
          onChange={(e) => setSelectedSongId(e.target.value)}
        >
          <option value="">Add song...</option>
          {allSongs.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title} – {s.artist}
            </option>
          ))}
        </select>
        <button className="btn" type="submit">
          Add
        </button>
      </form>

      <div>
        {playlist.songs && playlist.songs.length > 0 ? (
          playlist.songs.map((s) => (
            <div key={s._id} className="track-row">
              <button
                className="player-button secondary"
                onClick={() => playSong(s, playlist.songs)}
              >
                ▶
              </button>
              <div>
                <div className="track-row-title">{s.title}</div>
                <div className="track-row-artist">{s.artist}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                {s.album}
              </div>
              <button
                className="btn-outline"
                style={{ fontSize: '0.75rem' }}
                onClick={() => handleRemove(s._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div>No songs in this playlist yet.</div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;

