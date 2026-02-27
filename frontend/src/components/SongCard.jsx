import { usePlayer } from '../hooks/usePlayer';

const SongCard = ({ song, songs, onLikeToggle, isLiked }) => {
  const { playSong } = usePlayer();

  return (
    <div className="card" onClick={() => playSong(song, songs)}>
      <div className="card-cover">
        {song.coverUrl ? (
          <img
            src={song.coverUrl}
            alt={song.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>♪</span>
        )}
      </div>
      <div className="card-title">{song.title}</div>
      <div className="card-subtitle">{song.artist}</div>
      {onLikeToggle && (
        <button
          className="btn-outline"
          style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(song);
          }}
        >
          {isLiked ? '♥ Liked' : '♡ Like'}
        </button>
      )}
    </div>
  );
};

export default SongCard;

