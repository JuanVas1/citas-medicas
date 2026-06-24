import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authService = {
  register: (payload) => axios.post(`${API_URL}/auth/register`, payload),
  login: (payload) => axios.post(`${API_URL}/auth/login`, payload),
  me: (token) =>
    axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};