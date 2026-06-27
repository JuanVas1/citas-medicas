import api from './api';

export const consultorioService = {
  getAll: () => api.get('/consultorios'),
  create: (payload) => api.post('/consultorios', payload),
  update: (id, payload) => api.put(`/consultorios/${id}`, payload),
  toggleActivo: (id) => api.patch(`/consultorios/${id}/toggle`),
  deleteConsultorio: (id) => api.delete(`/consultorios/${id}`)
};
