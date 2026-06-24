import api from './api';

export const horarioService = {

  getAll: () => api.get('/horarios'),

  create: (payload) =>
    api.post('/horarios', payload),

  delete: (id) =>
    api.delete(`/horarios/${id}`)
};