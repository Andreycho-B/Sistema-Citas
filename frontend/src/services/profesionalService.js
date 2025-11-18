import api from './api';

export const profesionalService = {
  async obtenerTodosLosProfesionales() {
    const response = await api.get('/api/profesionales');
    return response.data;
  },

  async obtenerProfesionalPorId(id) {
    const response = await api.get(`/api/profesionales/${id}`);
    return response.data;
  },

  async obtenerProfesionalPorUsuarioId(usuarioId) {
    const response = await api.get(`/api/profesionales/usuario/${usuarioId}`);
    return response.data;
  },

  async crearProfesional(profesionalData) {
    const response = await api.post('/api/profesionales', profesionalData);
    return response.data;
  },

  async actualizarProfesional(id, profesionalData) {
    const response = await api.put(`/api/profesionales/${id}`, profesionalData);
    return response.data;
  },

  async eliminarProfesional(id) {
    const response = await api.delete(`/api/profesionales/${id}`);
    return response.data;
  },

  async buscarPorEspecialidad(especialidad) {
    const response = await api.get('/api/profesionales/buscar', { 
      params: { especialidad } 
    });
    return response.data;
  }
};