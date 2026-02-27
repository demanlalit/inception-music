import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  return (
    <div className="card" onClick={() => navigate(`/playlists/${playlist._id}`)}>
      <div className="card-cover">
        <span>▦</span>
      </div>
      <div className="card-title">{playlist.name}</div>
      <div className="card-subtitle">
        {playlist.songs?.length || 0} tracks
      </div>
    </div>
  );
};

export default PlaylistCard;

