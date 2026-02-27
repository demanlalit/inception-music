import { useEffect, useState } from 'react';
import PlaylistCard from '../components/PlaylistCard';
import { fetchUserPlaylists, createPlaylistRequest } from '../services/playlistService';
import { fetchLikedSongs } from '../services/likeService';
import SongCard from '../components/SongCard';

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const [pl, liked] = await Promise.all([
      fetchUserPlaylists(),
      fetchLikedSongs(),
    ]);
    setPlaylists(pl);
    setLikedSongs(liked);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createPlaylistRequest(name, description);
    setName('');
    setDescription('');
    await load();
  };

  return (
    <div>
      <h1 className="page-title">Your Library</h1>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Create playlist
        </h2>
        <form
          onSubmit={handleCreate}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
          <input
            className="form-input"
            style={{ maxWidth: '200px' }}
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-input"
            style={{ maxWidth: '260px' }}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Playlists
        </h2>
        <div className="grid grid-3">
          {playlists.map((pl) => (
            <PlaylistCard key={pl._id} playlist={pl} />
          ))}
          {playlists.length === 0 && <div>No playlists yet.</div>}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Liked songs
        </h2>
        <div className="grid grid-3">
          {likedSongs.map((s) => (
            <SongCard key={s._id} song={s} songs={likedSongs} />
          ))}
          {likedSongs.length === 0 && <div>No liked songs yet.</div>}
        </div>
      </section>
    </div>
  );
};

export default LibraryPage;

