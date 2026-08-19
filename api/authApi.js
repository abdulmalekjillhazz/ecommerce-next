import api from './axios';

export const authApi = {
  register: (payload) => api.post('/api/v1/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/api/v1/auth/login', payload).then((res) => res.data),
  logout: () => api.post('/api/v1/auth/logout').then((res) => res.data),
  getMe: () => api.get('/api/v1/auth/me').then((res) => res.data),
};
