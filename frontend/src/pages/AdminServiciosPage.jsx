import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { servicioService } from '../services/servicioService';
import { profesionalService } from '../services/profesionalService';
import { useToast } from '../hooks/useToast';

export default function AdminServiciosPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    profesionalId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServicios(servicios);
    } else {
      const filtered = servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredServicios(filtered);
    }
  }, [searchTerm, servicios]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [serviciosData, profesionalesData] = await Promise.all([
        servicioService.obtenerTodosLosServicios(),
        profesionalService.obtenerTodosLosProfesionales()
      ]);
      setServicios(serviciosData);
      setProfesionales(profesionalesData);
      setFilteredServicios(serviciosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await servicioService.eliminarServicio(id);
      showToast('Servicio eliminado exitosamente', 'success');
      await loadData();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      showToast(error.response?.data?.message || 'Error al eliminar servicio', 'error');
    }
  };

  const handleNuevoServicio = () => {
    setEditingServicio(null);
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: '60 minutos',
      precio: '',
      profesionalId: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditarServicio = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      duracion: servicio.duracion,
      precio: servicio.precio,
      profesionalId: servicio.profesionalId || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.duracion.trim()) {
      errors.duracion = 'La duración es obligatoria';
    }
    
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        duracion: formData.duracion,
        precio: parseFloat(formData.precio),
        profesionalId: formData.profesionalId || null
      };

      if (editingServicio) {
        await servicioService.actualizarServicio(editingServicio.id, dataToSend);
        showToast('Servicio actualizado exitosamente', 'success');
      } else {
        await servicioService.crearServicio(dataToSend);
        showToast('Servicio creado exitosamente', 'success');
      }
      
      setShowModal(false);
      setEditingServicio(null);
      await loadData();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      showToast(error.response?.data?.message || 'Error al guardar servicio', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Cargando servicios...</p>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
              <p className="mt-1 text-sm text-gray-600">
                Administra todos los servicios del sistema
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleNuevoServicio}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Servicio
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Volver
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabla de servicios */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServicios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron servicios' : 'No hay servicios registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredServicios.map((servicio) => (
                    <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {servicio.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {servicio.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {servicio.descripcion || 'Sin descripción'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {servicio.duracion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${servicio.precio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {servicio.profesionalNombre ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {servicio.profesionalNombre}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Global
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditarServicio(servicio)}
                          className="text-cyan-600 hover:text-cyan-900 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(servicio.id, servicio.nombre)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total de servicios: {filteredServicios.length}
          </div>
        </motion.div>
      </div>

      {/* Modal para crear/editar servicio */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
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
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Consulta General"
                  />
                  {formErrors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
                  )}
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
                    placeholder="Describe el servicio..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración *
                  </label>
                  <input
                    type="text"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      formErrors.duracion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 60 minutos"
                  />
                  {formErrors.duracion && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.duracion}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      formErrors.precio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.precio && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.precio}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profesional (opcional)
                  </label>
                  <select
                    value={formData.profesionalId}
                    onChange={(e) => setFormData({ ...formData, profesionalId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Servicio Global (todos los profesionales)</option>
                    {profesionales.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.usuarioNombre} - {prof.especialidad}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Si no seleccionas un profesional, el servicio estará disponible para todos
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors font-medium"
                  >
                    {editingServicio ? 'Actualizar' : 'Crear Servicio'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingServicio(null);
                      setFormErrors({});
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
