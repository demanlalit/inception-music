import api from './api';

export const createPlaylistRequest = async (name, description) => {
  const { data } = await api.post('/playlists', { name, description });
  return data;
};

export const fetchUserPlaylists = async () => {
  const { data } = await api.get('/playlists');
  return data;
};

export const fetchPlaylistById = async (id) => {
  const { data } = await api.get(`/playlists/${id}`);
  return data;
};

export const addSongToPlaylistRequest = async (playlistId, songId) => {
  const { data } = await api.post(`/playlists/${playlistId}/songs`, {
    songId,
  });
  return data;
};

export const removeSongFromPlaylistRequest = async (playlistId, songId) => {
  const { data } = await api.delete(
    `/playlists/${playlistId}/songs/${songId}`
  );
  return data;
};

