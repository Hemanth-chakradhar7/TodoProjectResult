import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = (data) => axios.post(`${API_URL}/auth/signup`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const createTask = (data, token) => axios.post(`${API_URL}/tasks`, data, { headers: { Authorization: token } });
export const getTasks = (token) => axios.get(`${API_URL}/tasks`, { headers: { Authorization: token } });
export const updateTask = (data, token) => axios.put(`${API_URL}/tasks`, data, { headers: { Authorization: token } });
export const deleteTask = (data, token) => axios.delete(`${API_URL}/tasks`, { headers: { Authorization: token }, data });
