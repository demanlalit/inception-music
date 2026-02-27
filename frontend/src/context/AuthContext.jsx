import React, { createContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, getProfile } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getProfile(storedToken)
        .then((u) => {
          setUser(u);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user: u, token: t } = await loginRequest(email, password);
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
  };

  const register = async (name, email, password) => {
    const { user: u, token: t } = await registerRequest(name, email, password);
    setUser(u);
    setToken(t);
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

