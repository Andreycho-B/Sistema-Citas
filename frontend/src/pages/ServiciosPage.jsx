import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { servicioService } from '../services/servicioService';
import { useNavigate } from 'react-router-dom';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const data = await servicioService.obtenerTodosLosServicios();
        setServicios(Array.isArray(data) ? data : []); // Verificación de seguridad
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        setServicios([]); // Asegura que sea un array en caso de error
      } finally {
        setLoading(false);
      }
    };

    loadServicios();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')) {
      try {
        await servicioService.eliminarServicio(id);
        setServicios(servicios.filter(s => s.id !== id));
      } catch (error) {
        console.error("Error al eliminar servicio:", error);
        alert('No se pudo eliminar el servicio.');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando servicios...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 font-serif italic">
              Nuestros Servicios
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Gestiona las terapias y programas que ofrecemos.
            </p>
          </div>
          <motion.button
            onClick={() => navigate('/admin/servicios/nuevo')}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Crear Nuevo Servicio
          </motion.button>
        </motion.div>

        {/* Services Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => (
            <motion.div
              key={servicio.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-900">{servicio.nombre}</h3>
              <p className="mt-2 text-gray-600">{servicio.descripcion}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-2xl font-bold text-cyan-600">${servicio.precio}</span>
                <span className="text-sm text-gray-500">{servicio.duracion}</span>
              </div>
              <div className="mt-6 flex gap-2">
                <motion.button
                  onClick={() => navigate(`/admin/servicios/editar/${servicio.id}`)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Editar
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(servicio.id)}
                  className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-md font-medium hover:bg-red-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}