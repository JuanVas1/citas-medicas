import axios from 'axios';
import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const citaService = {
  getAll: () => axios.get(`${API_URL}/citas`, authHeaders()),
  getMine: () => axios.get(`${API_URL}/citas/mias`, authHeaders()),
  getMineHistory: () => api.get('/citas/mias/historial'),
  getDoctorAgenda: () => axios.get(`${API_URL}/citas/agenda-doctor`, authHeaders()),
  create: (payload) => axios.post(`${API_URL}/citas`, payload, authHeaders()),
  updateStatus: (id, payload) => axios.patch(`${API_URL}/citas/${id}/estado`, payload, authHeaders()),
  getById: (id) => api.get(`/citas/${id}`),
  rescheduleMine: (id, payload) => api.put(`/citas/${id}/reprogramar`, payload),
  cancelMine: (id) => api.patch(`/citas/${id}/cancelar`)
};