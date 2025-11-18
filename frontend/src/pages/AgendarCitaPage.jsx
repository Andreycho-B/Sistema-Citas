import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { profesionalService } from '../services/profesionalService';
import { servicioService } from '../services/servicioService';

export default function AgendarCitaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    usuarioId: user?.id || '',
    profesionalId: '',
    servicioId: '',
    fechaHora: '',
    notas: ''
  });
  
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profesionalesRes, serviciosRes] = await Promise.all([
        profesionalService.obtenerTodosLosProfesionales(),
        servicioService.obtenerTodosLosServicios()
      ]);
      
      setProfesionales(profesionalesRes);
      setServicios(serviciosRes);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar profesionales y servicios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validaciones básicas
      if (!formData.profesionalId || !formData.servicioId || !formData.fechaHora) {
        setError('Por favor completa todos los campos obligatorios');
        setSubmitting(false);
        return;
      }

      // Validar que la fecha sea futura
      const fechaSeleccionada = new Date(formData.fechaHora);
      const ahora = new Date();
      if (fechaSeleccionada <= ahora) {
        setError('La fecha y hora debe ser futura');
        setSubmitting(false);
        return;
      }

      const citaData = {
        usuarioId: parseInt(formData.usuarioId),
        profesionalId: parseInt(formData.profesionalId),
        servicioId: parseInt(formData.servicioId),
        fechaHora: formData.fechaHora,
        notas: formData.notas || ''
      };

      await citaService.agendarCita(citaData);
      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error al agendar cita:', err);
      setError(err.response?.data?.message || 'Error al agendar la cita. Por favor intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Agendar Nueva Cita</h1>
          
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ¡Cita agendada exitosamente! Redirigiendo al dashboard...
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Servicio */}
            <div>
              <label htmlFor="servicioId" className="block text-sm font-medium text-gray-700 mb-2">
                Servicio *
              </label>
              <select
                id="servicioId"
                name="servicioId"
                value={formData.servicioId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - ${servicio.precio} ({servicio.duracion})
                  </option>
                ))}
              </select>
            </div>

            {/* Selección de Profesional */}
            <div>
              <label htmlFor="profesionalId" className="block text-sm font-medium text-gray-700 mb-2">
                Profesional *
              </label>
              <select
                id="profesionalId"
                name="profesionalId"
                value={formData.profesionalId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Selecciona un profesional</option>
                {profesionales.map(profesional => (
                  <option key={profesional.id} value={profesional.id}>
                    {profesional.usuario.nombre} - {profesional.especialidad}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div>
              <label htmlFor="fechaHora" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                id="fechaHora"
                name="fechaHora"
                value={formData.fechaHora}
                onChange={handleChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Selecciona una fecha y hora futura para tu cita
              </p>
            </div>

            {/* Notas */}
            <div>
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={4}
                placeholder="Agrega cualquier información adicional que consideres relevante..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || success}
                className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Agendando...' : 'Agendar Cita'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={submitting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
