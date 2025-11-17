import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8088/api',
  timeout: 10000
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es de autenticación, NO redirigir automáticamente
    // Solo si es un 401 real (no 403)
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    
    // Para 403, solo rechazar el error sin cerrar sesión
    return Promise.reject(error);
  }
);

export default api;