import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { profesionalService } from '../services/profesionalService';
import { useToast } from '../hooks/useToast';

export default function AdminProfesionalesPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfesionales, setFilteredProfesionales] = useState([]);

  useEffect(() => {
    loadProfesionales();
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

  const loadProfesionales = async () => {
    try {
      setLoading(true);
      const data = await profesionalService.obtenerTodosLosProfesionales();
      setProfesionales(data);
      setFilteredProfesionales(data);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
      showToast('Error al cargar profesionales', 'error');
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
      await loadProfesionales();
    } catch (error) {
      console.error('Error al eliminar profesional:', error);
      showToast('Error al eliminar profesional', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando profesionales...</p>
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
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por especialidad o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
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
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron profesionales
                    </td>
                  </tr>
                ) : (
                  filteredProfesionales.map((prof) => (
                    <tr key={prof.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prof.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prof.usuarioNombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prof.especialidad}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {prof.horarioDisponible || 'No especificado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/admin/profesionales/${prof.id}/editar`)}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(prof.id, prof.usuarioNombre || 'este profesional')}
                          className="text-red-600 hover:text-red-900"
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
    </div>
  );
}
