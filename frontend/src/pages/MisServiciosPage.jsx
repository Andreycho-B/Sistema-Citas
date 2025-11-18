import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

export default function MisServiciosPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: ''
  });

  useEffect(() => {
    loadMisServicios();
  }, []);

  const loadMisServicios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/servicios/mis-servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      showToast('Error al cargar tus servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingServicio) {
        // Actualizar servicio existente
        await api.put(`/api/servicios/${editingServicio.id}`, formData);
        showToast('Servicio actualizado exitosamente', 'success');
      } else {
        // Crear nuevo servicio
        await api.post('/api/servicios', formData);
        showToast('Servicio creado exitosamente', 'success');
      }
      
      setShowModal(false);
      setEditingServicio(null);
      setFormData({ nombre: '', descripcion: '', duracion: '', precio: '' });
      await loadMisServicios();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      showToast(error.response?.data?.message || 'Error al guardar servicio', 'error');
    }
  };

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      duracion: servicio.duracion,
      precio: servicio.precio
    });
    setShowModal(true);
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/servicios/${id}`);
      showToast('Servicio eliminado exitosamente', 'success');
      await loadMisServicios();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      showToast('Error al eliminar servicio', 'error');
    }
  };

  const handleNuevoServicio = () => {
    setEditingServicio(null);
    setFormData({ nombre: '', descripcion: '', duracion: '', precio: '' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando tus servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Servicios</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona los servicios que ofreces
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleNuevoServicio}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
              >
                + Nuevo Servicio
              </button>
              <button
                onClick={() => navigate('/professional/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Volver
              </button>
            </div>
          </div>

          {/* Lista de servicios */}
          {servicios.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">No tienes servicios registrados aún.</p>
              <button
                onClick={handleNuevoServicio}
                className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition-colors"
              >
                Crear mi primer servicio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicios.map((servicio) => (
                <motion.div
                  key={servicio.id}
                  className="bg-white rounded-lg shadow-md p-6"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {servicio.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {servicio.descripcion || 'Sin descripción'}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duración:</span>
                      <span className="font-medium">{servicio.duracion}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-medium text-cyan-600">${servicio.precio}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(servicio)}
                      className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(servicio.id, servicio.nombre)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal para crear/editar servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Ej: Consulta General"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe tu servicio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración *
                </label>
                <input
                  type="text"
                  required
                  value={formData.duracion}
                  onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Ej: 60 minutos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
                >
                  {editingServicio ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingServicio(null);
                    setFormData({ nombre: '', descripcion: '', duracion: '', precio: '' });
                  }}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
