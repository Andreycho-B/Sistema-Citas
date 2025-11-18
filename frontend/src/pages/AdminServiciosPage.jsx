import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { servicioService } from '../services/servicioService';
import { useToast } from '../hooks/useToast';

export default function AdminServiciosPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServicios, setFilteredServicios] = useState([]);

  useEffect(() => {
    loadServicios();
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

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await servicioService.obtenerTodosLosServicios();
      setServicios(data);
      setFilteredServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      showToast('Error al cargar servicios', 'error');
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
      await loadServicios();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      showToast('Error al eliminar servicio', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando servicios...</p>
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
                onClick={() => navigate('/admin/servicios/nuevo')}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
              >
                + Nuevo Servicio
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
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
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
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  filteredServicios.map((servicio) => (
                    <tr key={servicio.id} className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          onClick={() => navigate(`/admin/servicios/${servicio.id}/editar`)}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(servicio.id, servicio.nombre)}
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
            Total de servicios: {filteredServicios.length}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
