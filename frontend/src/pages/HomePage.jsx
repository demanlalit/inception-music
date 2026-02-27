import { useEffect, useState } from 'react';
import SongCard from '../components/SongCard';
import { fetchSongs } from '../services/songService';
import {
  fetchLikedSongs,
  likeSongRequest,
  unlikeSongRequest,
} from '../services/likeService';

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const [liked, setLiked] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [songData, likedData] = await Promise.all([
        fetchSongs(query),
        fetchLikedSongs(),
      ]);
      setSongs(songData);
      setLiked(likedData.map((s) => s._id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  const toggleLike = async (song) => {
    const isLiked = liked.includes(song._id);
    try {
      if (isLiked) {
        await unlikeSongRequest(song._id);
        setLiked((prev) => prev.filter((id) => id !== song._id));
      } else {
        await likeSongRequest(song._id);
        setLiked((prev) => [...prev, song._id]);
      }
    } catch {
      // swallow simple UI error; backend still handles validation
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h1 className="page-title">Browse</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            className="search-input"
            placeholder="Search title or artist"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-outline" type="submit">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div>Loading songs...</div>
      ) : (
        <div className="grid grid-3">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songs={songs}
              onLikeToggle={toggleLike}
              isLiked={liked.includes(song._id)}
            />
          ))}
          {songs.length === 0 && <div>No songs found.</div>}
        </div>
      )}
    </div>
  );
};

export default HomePage;

