import axios from 'axios';
import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const citaService = {
  getDoctorAgenda: () => axios.get(`${API_URL}/citas/agenda-doctor`, authHeaders()),
  getById: (id) => api.get(`/citas/${id}`),
  updateStatus: (id, payload) => axios.patch(`${API_URL}/citas/${id}/estado`, payload, authHeaders())
};
