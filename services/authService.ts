import { SocialUser } from '../types';
import { api } from './api';

const TOKEN_KEY = 'story-weaver-token';

export const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const login = async (email: string, password: string): Promise<SocialUser> => {
  const { token, user } = await api.post('/auth/login', { email, password });
  setToken(token);
  return user;
};

export const signup = async (email: string, password: string, username: string): Promise<SocialUser> => {
    const { token, user } = await api.post('/auth/register', { email, password, username });
    setToken(token);
    return user;
};

export const logout = () => {
    setToken(null);
};
