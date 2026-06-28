import api from './api';

export const doctorService = {
  getAll: () => api.get('/doctors'),
  create: (payload) => api.post('/doctors', payload),
  createFromUser: (userId, payload) => api.post(`/doctors/from-user/${userId}`, payload),
  update: (id, payload) => api.put(`/doctors/${id}`, payload)
};