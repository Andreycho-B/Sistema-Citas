import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { useToast } from '../hooks/useToast';

export default function AdminCitasPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const data = await citaService.obtenerTodasLasCitas();
      setCitas(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      showToast('Error al cargar citas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await citaService.eliminarCita(id);
      showToast('Cita eliminada exitosamente', 'success');
      await loadCitas();
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      showToast('Error al eliminar cita', 'error');
    }
  };

  const handleCancelar = async (id) => {
    try {
      await citaService.cancelarCita(id);
      showToast('Cita cancelada exitosamente', 'success');
      await loadCitas();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      showToast('Error al cancelar cita', 'error');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      CONFIRMADA: 'bg-blue-100 text-blue-800',
      COMPLETADA: 'bg-green-100 text-green-800',
      CANCELADA: 'bg-red-100 text-red-800'
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
  };

  const citasFiltradas = filtroEstado === 'TODAS' 
    ? citas 
    : citas.filter(cita => cita.estado === filtroEstado);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando citas...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
              <p className="mt-1 text-sm text-gray-600">
                Administra todas las citas del sistema
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="TODAS">Todas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="COMPLETADA">Completadas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>

          {/* Tabla de citas */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron citas
                    </td>
                  </tr>
                ) : (
                  citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cita.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cita.usuarioNombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cita.profesionalNombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cita.servicioNombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(cita.fechaHora).toLocaleString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(cita.estado)}`}>
                          {cita.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {cita.estado !== 'CANCELADA' && (
                          <button
                            onClick={() => handleCancelar(cita.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminar(cita.id)}
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
            Total de citas: {citasFiltradas.length}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
