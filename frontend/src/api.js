// src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';  
// (fallback para relative se não definido)

const api = axios.create({
  baseURL: API_URL,  
  headers: { 'Content-Type': 'application/json' }
});

export default api;
