import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { format, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MisCitasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [citas, setCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas'); // todas, proximas, pasadas, pendientes, confirmadas, completadas, canceladas
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadCitas();
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [filter, citas]);

  const loadCitas = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const citasData = await citaService.obtenerCitasPorUsuario(user.id);
      
      // Ordenar por fecha descendente (más recientes primero)
      citasData.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
      
      setCitas(citasData);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('Error al cargar tus citas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const ahora = new Date();
    
    let filtered = [...citas];
    
    switch(filter) {
      case 'proximas':
        filtered = citas.filter(cita => 
          isAfter(new Date(cita.fechaHora), ahora) && 
          (cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA')
        );
        break;
      case 'pasadas':
        filtered = citas.filter(cita => isBefore(new Date(cita.fechaHora), ahora));
        break;
      case 'pendientes':
        filtered = citas.filter(cita => cita.estado === 'PENDIENTE');
        break;
      case 'confirmadas':
        filtered = citas.filter(cita => cita.estado === 'CONFIRMADA');
        break;
      case 'completadas':
        filtered = citas.filter(cita => cita.estado === 'COMPLETADA');
        break;
      case 'canceladas':
        filtered = citas.filter(cita => cita.estado === 'CANCELADA');
        break;
      default:
        filtered = citas;
    }
    
    setFilteredCitas(filtered);
  };

  const handleCancelarCita = async (citaId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      setActionLoading(citaId);
      await citaService.cancelarCita(citaId);
      await loadCitas(); // Recargar las citas
    } catch (err) {
      console.error('Error al cancelar cita:', err);
      alert('Error al cancelar la cita');
    } finally {
      setActionLoading(null);
    }
  };

  const estadoColor = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    CONFIRMADA: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    COMPLETADA: 'bg-green-100 text-green-800 border-green-300',
    CANCELADA: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const estadoTexto = {
    PENDIENTE: 'Pendiente',
    CONFIRMADA: 'Confirmada',
    COMPLETADA: 'Completada',
    CANCELADA: 'Cancelada',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando tus citas...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
            <button
              onClick={() => navigate('/citas/nueva')}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
            >
              + Agendar Nueva Cita
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'todas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todas ({citas.length})
              </button>
              <button
                onClick={() => setFilter('proximas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'proximas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Próximas
              </button>
              <button
                onClick={() => setFilter('pasadas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'pasadas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pasadas
              </button>
              <button
                onClick={() => setFilter('pendientes')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'pendientes' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('confirmadas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'confirmadas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Confirmadas
              </button>
              <button
                onClick={() => setFilter('completadas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'completadas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completadas
              </button>
              <button
                onClick={() => setFilter('canceladas')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'canceladas' 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Canceladas
              </button>
            </div>
          </div>

          {/* Lista de Citas */}
          {filteredCitas.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No tienes citas que coincidan con este filtro</p>
              <button
                onClick={() => navigate('/citas/nueva')}
                className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition-colors"
              >
                Agendar tu primera cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCitas.map((cita) => (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {cita.servicio.nombre}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoColor[cita.estado]}`}>
                          {estadoTexto[cita.estado]}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Profesional:</span>
                          {cita.profesional.usuario.nombre} - {cita.profesional.especialidad}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Fecha:</span>
                          {format(new Date(cita.fechaHora), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Hora:</span>
                          {format(new Date(cita.fechaHora), "h:mm a", { locale: es })}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Duración:</span>
                          {cita.servicio.duracion}
                        </p>
                        {cita.notas && (
                          <p className="flex items-start gap-2 mt-2">
                            <span className="font-medium">Notas:</span>
                            <span className="text-sm">{cita.notas}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 ml-4">
                      {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && 
                       isAfter(new Date(cita.fechaHora), new Date()) && (
                        <button
                          onClick={() => handleCancelarCita(cita.id)}
                          disabled={actionLoading === cita.id}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === cita.id ? 'Cancelando...' : 'Cancelar Cita'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
