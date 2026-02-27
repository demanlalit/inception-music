import React, { createContext, useRef, useState } from 'react';

export const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  const playSong = (song, list) => {
    if (list) {
      setQueue(list);
      const index = list.findIndex((s) => s._id === song._id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setQueue([song]);
      setCurrentIndex(0);
    }
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 0);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 0);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 0);
    }
  };

  const value = {
    audioRef,
    queue,
    currentIndex,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    playNext,
    playPrev,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

