import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { servicioService } from '../services/servicioService';
import { profesionalService } from '../services/profesionalService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [profesionalFilter, setProfesionalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [serviciosData, profesionalesData] = await Promise.all([
        servicioService.obtenerTodosLosServicios(),
        profesionalService.obtenerTodosLosProfesionales()
      ]);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
      setProfesionales(Array.isArray(profesionalesData) ? profesionalesData : []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setServicios([]);
      setProfesionales([]);
      showToast('Error al cargar servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    try {
      setLoading(true);
      
      // Si hay término de búsqueda, buscar por nombre
      if (searchTerm.trim()) {
        const data = await servicioService.buscarPorNombre(searchTerm);
        setServicios(Array.isArray(data) ? data : []);
      } 
      // Si hay filtro de precio, buscar por rango
      else if (precioMin || precioMax) {
        const min = precioMin || 0;
        const max = precioMax || 999999;
        const data = await servicioService.buscarPorRangoPrecio(min, max);
        setServicios(Array.isArray(data) ? data : []);
      } 
      // Si no hay filtros, cargar todos
      else {
        await loadData();
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      showToast('Error al buscar servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarFiltros = () => {
    setSearchTerm('');
    setPrecioMin('');
    setPrecioMax('');
    setProfesionalFilter('');
    loadData();
  };

  // Filtrar por profesional en el frontend (después de obtener resultados)
  const serviciosFiltrados = profesionalFilter
    ? servicios.filter(s => s.profesionalId?.toString() === profesionalFilter)
    : servicios;

  const handleReservar = (servicioId) => {
    navigate('/citas/nueva', { state: { servicioId } });
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
        
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Nuestros Servicios
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Encuentra el servicio perfecto para ti
          </p>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-4">
            {/* Búsqueda principal */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar servicios por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handleBuscar}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
              >
                Buscar
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filtros
              </button>
            </div>

            {/* Filtros avanzados */}
            {showFilters && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="999.99"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profesional
                  </label>
                  <select
                    value={profesionalFilter}
                    onChange={(e) => setProfesionalFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Todos los profesionales</option>
                    {profesionales.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.usuarioNombre} - {prof.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={handleLimpiarFiltros}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Resultados */}
        <div className="mb-4 text-sm text-gray-600">
          {serviciosFiltrados.length} servicio(s) encontrado(s)
        </div>

        {/* Grid de servicios */}
        {serviciosFiltrados.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron servicios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosFiltrados.map((servicio, index) => (
              <motion.div
                key={servicio.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{servicio.nombre}</h3>
                    <span className="text-2xl font-bold text-cyan-600">${servicio.precio}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {servicio.descripcion || 'Sin descripción disponible'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duración: {servicio.duracion}
                    </div>
                    
                    {servicio.profesionalNombre && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {servicio.profesionalNombre}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleReservar(servicio.id)}
                    className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                  >
                    Reservar Cita
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
