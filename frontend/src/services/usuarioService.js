import api from './api';

export const usuarioService = {
  async obtenerTodosLosUsuarios() {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async obtenerUsuarioPorId(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async actualizarUsuario(id, usuarioData) {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  async eliminarUsuario(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  async buscarPorNombre(nombre) {
    const response = await api.get(`/usuarios/buscar`, { params: { nombre } });
    return response.data;
  }
};