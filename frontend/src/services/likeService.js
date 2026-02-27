import api from './api';

export const likeSongRequest = async (songId) => {
  const { data } = await api.post(`/likes/${songId}`);
  return data;
};

export const unlikeSongRequest = async (songId) => {
  const { data } = await api.delete(`/likes/${songId}`);
  return data;
};

export const fetchLikedSongs = async () => {
  const { data } = await api.get('/likes');
  return data;
};

