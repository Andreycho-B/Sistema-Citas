import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { profesionalService } from '../services/profesionalService'; // <-- Importa el servicio
import { format, isToday, isTomorrow, isPast, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Tarjeta para mostrar una cita en la agenda
const AgendaCard = ({ cita }) => {
  const estadoColor = {
    PENDIENTE: 'border-l-yellow-400 bg-yellow-50',
    CONFIRMADA: 'border-l-cyan-400 bg-cyan-50',
    COMPLETADA: 'border-l-green-400 bg-green-50',
    CANCELADA: 'border-l-gray-400 bg-gray-50',
  };

  const estadoTexto = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada',
  };

  const fechaCita = new Date(cita.fechaHora);
  let fechaFormateada = format(fechaCita, "EEEE d 'de' MMMM", { locale: es });

  if (isToday(fechaCita)) fechaFormateada = "Hoy";
  if (isTomorrow(fechaCita)) fechaFormateada = "Mañana";

  return (
    <motion.div 
      className={`p-4 bg-white rounded-lg border-l-4 shadow-sm ${estadoColor[cita.estado]} transition-all`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{cita.servicio.nombre}</p>
          <p className="text-sm text-gray-600">con {cita.usuario.nombre}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{fechaFormateada}</p>
          <p className="text-lg font-bold text-gray-900">{format(fechaCita, 'HH:mm')}</p>
        </div>
      </div>
      <div className="mt-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoColor[cita.estado]}`}>
          {estadoTexto[cita.estado]}
        </span>
      </div>
    </motion.div>
  );
};

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [stats, setStats] = useState({ hoy: 0, semana: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const loadMyAgenda = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // CORRECCIÓN: Usamos el servicio en lugar de fetch
      const profesional = await profesionalService.obtenerProfesionalPorUsuarioId(user.id);

      if (!profesional) {
        console.warn("El usuario no tiene un perfil de profesional asociado.");
        return;
      }

      const citasData = await citaService.obtenerCitasPorProfesional(profesional.id);
      
      const ahora = new Date();
      const inicioHoy = startOfDay(ahora);
      const finSemana = new Date(ahora);
      finSemana.setDate(ahora.getDate() + 7);

      const citasHoy = citasData.filter(c => isToday(new Date(c.fechaHora)));
      const citasSemana = citasData.filter(c => {
        const fecha = new Date(c.fechaHora);
        return !isPast(fecha) && isWithinInterval(fecha, { start: inicioHoy, end: finSemana });
      });

      citasData.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

      setCitas(citasData);
      setStats({ hoy: citasHoy.length, semana: citasSemana.length, total: citasData.length });

    } catch (error) {
      console.error("Error al cargar agenda del profesional:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMyAgenda();
  }, [loadMyAgenda]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando tu agenda...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 font-serif italic">
            Bienvenido, {user?.nombre}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Este es tu panel de control personal.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <motion.div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cyan-500" whileHover={{ y: -4 }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-cyan-100 rounded-md">
                <p className="text-2xl">📅</p>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Citas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hoy}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500" whileHover={{ y: -4 }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                <p className="text-2xl">📈</p>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Próximos 7 Días</p>
                <p className="text-2xl font-bold text-gray-900">{stats.semana}</p>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500" whileHover={{ y: -4 }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                <p className="text-2xl">👥</p>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total de Sesiones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12 bg-white p-8 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/professional/mis-servicios')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Mis Servicios</h3>
              <p className="text-sm text-gray-600">Gestiona los servicios que ofreces.</p>
            </button>
            <button 
              onClick={() => navigate('/servicios')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Ver Todos los Servicios</h3>
              <p className="text-sm text-gray-600">Explora el catálogo completo.</p>
            </button>
          </div>
        </motion.div>

        {/* Agenda */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tu Agenda</h2>
          
          {citas.length > 0 ? (
            <div className="space-y-4">
              {citas.map(cita => <AgendaCard key={cita.id} cita={cita} />)}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl text-center shadow-sm">
              <span className="text-6xl">🗓️</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">No tienes citas agendadas</h3>
              <p className="mt-2 text-gray-600">Tu agenda está libre por ahora.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}