import api from './api';

export const servicioService = {
  async obtenerTodosLosServicios() {
    const response = await api.get('/servicios');
    return response.data;
  },

  async obtenerServicioPorId(id) {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  async crearServicio(servicioData) {
    const response = await api.post('/servicios', servicioData);
    return response.data;
  },

  async actualizarServicio(id, servicioData) {
    const response = await api.put(`/servicios/${id}`, servicioData);
    return response.data;
  },

  async eliminarServicio(id) {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
  },

  async buscarPorNombre(nombre) {
    const response = await api.get(`/servicios/buscar`, { params: { nombre } });
    return response.data;
  }
};