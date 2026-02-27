import api from './api';

export const updateProfileRequest = async (payload) => {
  const { data } = await api.put('/users/me', payload);
  return data;
};

