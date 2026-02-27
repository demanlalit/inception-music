import api from './api';

export const fetchSongs = async (query) => {
  if (query) {
    const { data } = await api.get('/songs/search', {
      params: { query },
    });
    return data;
  }
  const { data } = await api.get('/songs');
  return data;
};

export const fetchSongById = async (id) => {
  const { data } = await api.get(`/songs/${id}`);
  return data;
};

export const uploadSongRequest = async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const { data } = await api.post('/songs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

