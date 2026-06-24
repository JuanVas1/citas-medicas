import axios from 'axios';
import api from './api';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const doctorService = {
  getAll: () => api.get('/doctors'),
  create: (payload) => api.post('/doctors', payload)
};