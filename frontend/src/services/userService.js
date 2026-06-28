import api from './api';

export const userService = {
  getAll: () => api.get('/users'),
  updateProfile: (payload) => api.put('/users/profile', payload)
};
