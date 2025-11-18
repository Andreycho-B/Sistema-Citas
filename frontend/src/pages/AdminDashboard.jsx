import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { usuarioService } from '../services/usuarioService'; // Necesitarás crear este servicio
import { profesionalService } from '../services/profesionalService';
import { citaService } from '../services/citaService';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// Tarjeta de estadística simple y elegante
const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}
    whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="text-4xl opacity-50">{icon}</div>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalProfesionales: 0,
    totalCitas: 0,
    citasEsteMes: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [usuarios, profesionales, citas] = await Promise.all([
        usuarioService.obtenerTodosLosUsuarios(),
        profesionalService.obtenerTodosLosProfesionales(),
        citaService.obtenerTodasLasCitas(),
      ]);

      const ahora = new Date();
      const inicioMes = startOfMonth(ahora);
      const finMes = endOfMonth(ahora);

      const citasEsteMes = citas.filter(cita => {
        const fechaCita = new Date(cita.fechaHora);
        return isWithinInterval(fechaCita, { start: inicioMes, end: finMes });
      });

      setStats({
        totalUsuarios: usuarios.length,
        totalProfesionales: profesionales.length,
        totalCitas: citas.length,
        citasEsteMes: citasEsteMes.length,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas de admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Cargando panel de administración...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-gray-900 font-serif italic">
            Panel de Administración
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Gestiona y supervisa toda la plataforma.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Usuarios Totales" value={stats.totalUsuarios} icon="👥" color="border-cyan-500" />
          <StatCard title="Profesionales" value={stats.totalProfesionales} icon="⚕️" color="border-purple-500" />
          <StatCard title="Total de Citas" value={stats.totalCitas} icon="📅" color="border-green-500" />
          <StatCard title="Citas este Mes" value={stats.citasEsteMes} icon="📈" color="border-orange-500" />
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12 bg-white p-8 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/usuarios')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-600">Ver, editar o eliminar usuarios.</p>
            </button>
            <button 
              onClick={() => navigate('/admin/profesionales')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Gestionar Profesionales</h3>
              <p className="text-sm text-gray-600">Aprobar y administrar profesionales.</p>
            </button>
            <button 
              onClick={() => navigate('/admin/servicios')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Gestionar Servicios</h3>
              <p className="text-sm text-gray-600">Crear y editar servicios.</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}