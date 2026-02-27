import api from './api';

export const loginRequest = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const registerRequest = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const getProfile = async (tokenOverride) => {
  const { data } = await api.get('/users/me', {
    headers: tokenOverride
      ? {
          Authorization: `Bearer ${tokenOverride}`,
        }
      : undefined,
  });
  return data;
};

