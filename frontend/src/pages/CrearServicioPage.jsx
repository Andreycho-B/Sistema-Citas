import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { servicioService } from '../services/servicioService';

export default function CrearServicioPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '60 minutos',
    precio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- VERIFICACIÓN DE PERMISOS ---
  useEffect(() => {
    // Si el usuario no está logueado o no es ADMIN, redirigirlo.
    if (!user || !user.roles.includes('ADMIN')) {
      navigate('/dashboard'); // O a una página de "No autorizado"
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await servicioService.crearServicio(formData);
      navigate('/servicios'); // Redirige a la lista de servicios tras crearlo
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el servicio.');
    } finally {
      setLoading(false);
    }
  };

  // Si el usuario no es ADMIN, no renderizar nada (o un mensaje de error)
  if (!user || !user.roles.includes('ADMIN')) {
    return null; // O puedes retornar un componente de "Acceso Denegado"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 font-serif italic">
            Crear Nuevo Servicio
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Añade una nueva terapia o programa a la plataforma.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 bg-white shadow-sm rounded-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="Ej: Terapia Cognitivo-Conductual"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              id="descripcion"
              rows={4}
              required
              value={formData.descripcion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="Describe en qué consiste el servicio, sus beneficios, para quién es, etc."
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">Duración</label>
              <input
                type="text"
                name="duracion"
                id="duracion"
                required
                value={formData.duracion}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="Ej: 50 minutos"
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                id="precio"
                required
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="Ej: 99.90"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/servicios')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Creando...' : 'Crear Servicio'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}