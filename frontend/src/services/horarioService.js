import api from './api';

export const horarioService = {
  getAll: () => api.get('/horarios'),
  getByDoctor: (doctorId) => api.get(`/horarios/doctor/${doctorId}`),
  create: (payload) => api.post('/horarios', payload),
  delete: (id) => api.delete(`/horarios/${id}`)
};