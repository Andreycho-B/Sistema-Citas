import api from './api';

export const servicioService = {
  async obtenerTodosLosServicios() {
    const response = await api.get('/api/servicios');
    // Si la respuesta es paginada, retornar content, sino retornar data directamente
    return response.data.content || response.data; 
  },

  async obtenerServicioPorId(id) {
    const response = await api.get(`/api/servicios/${id}`);
    return response.data;
  },

  async crearServicio(servicioData) {
    const response = await api.post('/api/servicios', servicioData);
    return response.data;
  },

  async actualizarServicio(id, servicioData) {
    const response = await api.put(`/api/servicios/${id}`, servicioData);
    return response.data;
  },

  async eliminarServicio(id) {
    const response = await api.delete(`/api/servicios/${id}`);
    return response.data;
  },

  async buscarPorNombre(nombre) {
    const response = await api.get('/api/servicios/buscar', {
      params: { nombre }
    });
    return response.data;
  },

  async buscarPorRangoPrecio(min, max) {
    const response = await api.get('/api/servicios/precio', {
      params: { min, max }
    });
    return response.data;
  }
};