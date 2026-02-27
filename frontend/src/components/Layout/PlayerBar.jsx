import { useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';

const PlayerBar = () => {
  const {
    audioRef,
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
  } = usePlayer();

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong, audioRef]);

  return (
    <div className="player-bar">
      <div className="player-info">
        {currentSong ? (
          <>
            <div className="player-title">{currentSong.title}</div>
            <div className="player-artist">{currentSong.artist}</div>
          </>
        ) : (
          <div className="player-title">Nothing playing</div>
        )}
      </div>
      <div className="player-controls">
        <button
          className="player-button secondary"
          onClick={playPrev}
          disabled={!currentSong}
        >
          &#9664;
        </button>
        <button
          className="player-button"
          onClick={togglePlay}
          disabled={!currentSong}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button
          className="player-button secondary"
          onClick={playNext}
          disabled={!currentSong}
        >
          &#9654;
        </button>
      </div>
      <audio ref={audioRef} style={{ width: '260px' }} controls />
    </div>
  );
};

export default PlayerBar;

