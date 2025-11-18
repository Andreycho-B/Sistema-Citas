import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { profesionalService } from '../services/profesionalService';
import { usuarioService } from '../services/usuarioService';
import { useToast } from '../hooks/useToast';

export default function AdminProfesionalesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [profesionales, setProfesionales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfesionales, setFilteredProfesionales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState(null);
  const [formData, setFormData] = useState({
    usuarioId: '',
    especialidad: '',
    horarioDisponible: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProfesionales(profesionales);
    } else {
      const filtered = profesionales.filter(prof =>
        prof.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prof.usuarioNombre && prof.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProfesionales(filtered);
    }
  }, [searchTerm, profesionales]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profesionalesData, usuariosData] = await Promise.all([
        profesionalService.obtenerTodosLosProfesionales(),
        usuarioService.obtenerTodosLosUsuarios()
      ]);
      setProfesionales(profesionalesData);
      setUsuarios(usuariosData);
      setFilteredProfesionales(profesionalesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al profesional "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await profesionalService.eliminarProfesional(id);
      showToast('Profesional eliminado exitosamente', 'success');
      await loadData();
    } catch (error) {
      console.error('Error al eliminar profesional:', error);
      showToast(error.response?.data?.message || 'Error al eliminar profesional', 'error');
    }
  };

  const handleNuevoProfesional = () => {
    setEditingProfesional(null);
    setFormData({
      usuarioId: '',
      especialidad: '',
      horarioDisponible: 'Lunes a Viernes: 9:00 AM - 5:00 PM'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditarProfesional = (profesional) => {
    setEditingProfesional(profesional);
    setFormData({
      usuarioId: profesional.usuarioId || '',
      especialidad: profesional.especialidad,
      horarioDisponible: profesional.horarioDisponible || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!editingProfesional && !formData.usuarioId) {
      errors.usuarioId = 'Debe seleccionar un usuario';
    }
    
    if (!formData.especialidad.trim()) {
      errors.especialidad = 'La especialidad es obligatoria';
    }
    
    if (!formData.horarioDisponible.trim()) {
      errors.horarioDisponible = 'El horario es obligatorio';
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
      if (editingProfesional) {
        // Para edición
        const updateData = {
          especialidad: formData.especialidad,
          horarioDisponible: formData.horarioDisponible
        };
        await profesionalService.actualizarProfesional(editingProfesional.id, updateData);
        showToast('Profesional actualizado exitosamente', 'success');
      } else {
        // Para creación
        await profesionalService.crearProfesional(formData);
        showToast('Profesional creado exitosamente', 'success');
      }
      
      setShowModal(false);
      setEditingProfesional(null);
      await loadData();
    } catch (error) {
      console.error('Error al guardar profesional:', error);
      showToast(error.response?.data?.message || 'Error al guardar profesional', 'error');
    }
  };

  // Filtrar usuarios que ya son profesionales
  const usuariosDisponibles = usuarios.filter(usuario => {
    // Si estamos editando, permitir el usuario actual
    if (editingProfesional && usuario.id === editingProfesional.usuarioId) {
      return true;
    }
    // Verificar que el usuario no sea ya un profesional
    return !profesionales.some(prof => prof.usuarioId === usuario.id);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Cargando profesionales...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Profesionales</h1>
              <p className="mt-1 text-sm text-gray-600">
                Administra todos los profesionales del sistema
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleNuevoProfesional}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Profesional
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
                placeholder="Buscar por especialidad o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabla de profesionales */}
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
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfesionales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron profesionales' : 'No hay profesionales registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredProfesionales.map((prof) => (
                    <tr key={prof.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prof.usuarioNombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prof.especialidad}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {prof.horarioDisponible || 'No especificado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditarProfesional(prof)}
                          className="text-cyan-600 hover:text-cyan-900 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(prof.id, prof.usuarioNombre || 'este profesional')}
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
            Total de profesionales: {filteredProfesionales.length}
          </div>
        </motion.div>
      </div>

      {/* Modal para crear/editar profesional */}
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
                {editingProfesional ? 'Editar Profesional' : 'Nuevo Profesional'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingProfesional && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usuario *
                    </label>
                    <select
                      value={formData.usuarioId}
                      onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        formErrors.usuarioId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuariosDisponibles.map(usuario => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nombre} ({usuario.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.usuarioId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.usuarioId}</p>
                    )}
                    {usuariosDisponibles.length === 0 && (
                      <p className="mt-1 text-sm text-amber-600">
                        No hay usuarios disponibles. Todos los usuarios ya son profesionales.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad *
                  </label>
                  <input
                    type="text"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      formErrors.especialidad ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Medicina General, Odontología, Psicología"
                  />
                  {formErrors.especialidad && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.especialidad}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario Disponible *
                  </label>
                  <textarea
                    value={formData.horarioDisponible}
                    onChange={(e) => setFormData({ ...formData, horarioDisponible: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      formErrors.horarioDisponible ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Ej: Lunes a Viernes: 9:00 AM - 5:00 PM"
                  />
                  {formErrors.horarioDisponible && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.horarioDisponible}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors font-medium"
                  >
                    {editingProfesional ? 'Actualizar' : 'Crear Profesional'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProfesional(null);
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
