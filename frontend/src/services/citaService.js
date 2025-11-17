import api from './api';

export const citaService = {
  async obtenerTodasLasCitas() {
    const response = await api.get('/citas');
    return response.data;
  },

  async obtenerCitaPorId(id) {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  },

  async agendarCita(citaData) {
    const response = await api.post('/citas', citaData);
    return response.data;
  },

  async actualizarCita(id, citaData) {
    const response = await api.put(`/citas/${id}`, citaData);
    return response.data;
  },

  async cambiarEstadoCita(id, nuevoEstado) {
    const response = await api.patch(`/citas/${id}/estado`, { nuevoEstado });
    return response.data;
  },

  async eliminarCita(id) {
    const response = await api.delete(`/citas/${id}`);
    return response.data;
  },

  async obtenerCitasPorUsuario(usuarioId) {
    const response = await api.get(`/citas/usuario/${usuarioId}`);
    return response.data;
  },

  async obtenerCitasPorProfesional(profesionalId) {
    const response = await api.get(`/citas/profesional/${profesionalId}`);
    return response.data;
  }
};