import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { profesionalService } from '../services/profesionalService';
import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para mostrar una tarjeta de cita de forma reutilizable
const CitaCard = ({ cita }) => {
  const estadoColor = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMADA: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    COMPLETADA: 'bg-green-100 text-green-800 border-green-200',
    CANCELADA: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <motion.div 
      className={`p-4 border rounded-lg ${estadoColor[cita.estado]}`}
      whileHover={{ scale: 1.02 }}
    >
      <p className="font-semibold">{cita.servicio.nombre}</p>
      <p className="text-sm">con {cita.profesional.usuario.nombre}</p>
      <p className="text-xs mt-1">
        {format(new Date(cita.fechaHora), "PPP 'a las' p", { locale: es })}
      </p>
    </motion.div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ proximasCitas: 0, citasCompletadas: 0, profesionales: 0 });
  const [proximasCitasList, setProximasCitasList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Usamos useCallback para estabilizar la función y evitar advertencias de dependencias en useEffect.
  // Esto mejora el rendimiento al prevenir que la función se recree en cada renderizado.
  const loadStatsAndCitas = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Cargamos estadísticas y citas en paralelo para optimizar la carga.
      const [profesionalesRes, citasRes] = await Promise.all([
        profesionalService.obtenerTodosLosProfesionales(),
        citaService.obtenerCitasPorUsuario(user.id)
      ]);

      const ahora = new Date();
      const proximas = citasRes.filter(cita => 
        isAfter(new Date(cita.fechaHora), ahora) && 
        (cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA')
      );
      
      const completadas = citasRes.filter(cita => cita.estado === 'COMPLETADA');

      setStats({
        proximasCitas: proximas.length,
        citasCompletadas: completadas.length,
        profesionales: profesionalesRes.length
      });
      
      // Ordenamos las próximas citas por fecha para mostrar las más urgentes primero.
      proximas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
      setProximasCitasList(proximas.slice(0, 3));

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // La función depende del usuario. Si el usuario cambia, se recarga la data.

  useEffect(() => {
    loadStatsAndCitas();
  }, [loadStatsAndCitas]); // El efecto ahora depende de la función estabilizada, resolviendo la advertencia.

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 font-serif italic">
            Hola, {user?.nombre}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Bienvenido a tu espacio de bienestar emocional
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <motion.div className="bg-white overflow-hidden shadow rounded-lg" whileHover={{ y: -4 }}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-cyan-500 rounded-md p-3">
                  <p className="text-white text-2xl">📅</p>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Próximas Citas</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.proximasCitas}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white overflow-hidden shadow rounded-lg" whileHover={{ y: -4 }}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <p className="text-white text-2xl">✅</p>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sesiones Completadas</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.citasCompletadas}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="bg-white overflow-hidden shadow rounded-lg" whileHover={{ y: -4 }}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <p className="text-white text-2xl">👥</p>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Profesionales</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.profesionales}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Próximas Citas */}
          <motion.div className="bg-white shadow rounded-lg p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tus Próximas Sesiones</h2>
            {proximasCitasList.length > 0 ? (
              <div className="space-y-3">
                {proximasCitasList.map(cita => <CitaCard key={cita.id} cita={cita} />)}
              </div>
            ) : (
              <p className="text-gray-500">No tienes próximas citas programadas.</p>
            )}
            <button 
              onClick={() => navigate('/citas/nueva')}
              className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors"
            >
              Agendar Nueva Cita
            </button>
          </motion.div>

          {/* Acciones Rápidas */}
          <motion.div className="bg-white shadow rounded-lg p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/profesionales')} className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium">Explorar Profesionales</p>
                <p className="text-sm text-gray-500">Encuentra al especialista ideal para ti.</p>
              </button>
              <button onClick={() => navigate('/servicios')} className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium">Ver Todos los Servicios</p>
                <p className="text-sm text-gray-500">Conoce nuestras terapias y programas.</p>
              </button>
              <button onClick={() => navigate('/perfil')} className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <p className="font-medium">Mi Perfil</p>
                <p className="text-sm text-gray-500">Gestiona tu información personal.</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}