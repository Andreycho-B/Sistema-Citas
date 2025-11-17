import api from './api';

export const profesionalService = {
  async obtenerTodosLosProfesionales() {
    const response = await api.get('/profesionales');
    return response.data;
  },

  async obtenerProfesionalPorId(id) {
    const response = await api.get(`/profesionales/${id}`);
    return response.data;
  },

  async crearProfesional(profesionalData) {
    const response = await api.post('/profesionales', profesionalData);
    return response.data;
  },

  async actualizarProfesional(id, profesionalData) {
    const response = await api.put(`/profesionales/${id}`, profesionalData);
    return response.data;
  },

  async eliminarProfesional(id) {
    const response = await api.delete(`/profesionales/${id}`);
    return response.data;
  },

  async buscarPorEspecialidad(especialidad) {
    const response = await api.get(`/profesionales/especialidad/${especialidad}`);
    return response.data;
  }
};