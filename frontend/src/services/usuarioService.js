import api from './api';

export const usuarioService = {
  async obtenerTodosLosUsuarios() {
    const response = await api.get('/api/usuarios');
    return response.data;
  },

  async obtenerUsuarioPorId(id) {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },

  async crearUsuario(userData) {
    const response = await api.post('/api/usuarios', userData);
    return response.data;
  },

  async actualizarUsuario(id, userData) {
    const response = await api.put(`/api/usuarios/${id}`, userData);
    return response.data;
  },

  async eliminarUsuario(id) {
    const response = await api.delete(`/api/usuarios/${id}`);
    return response.data;
  }
};