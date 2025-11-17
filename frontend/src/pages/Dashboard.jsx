import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { citaService } from '../services/citaService';
import { profesionalService } from '../services/profesionalService';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    proximasCitas: 0,
    citasCompletadas: 0,
    profesionales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const profesionales = await profesionalService.obtenerTodosLosProfesionales();
      setStats({
        proximasCitas: 0,
        citasCompletadas: 0,
        profesionales: profesionales.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Agendar Cita',
      description: 'Reserva tu próxima sesión',
      icon: '📅',
      action: () => navigate('/citas/nueva'),
      color: 'cyan'
    },
    {
      title: 'Ver Profesionales',
      description: 'Encuentra tu especialista',
      icon: '👥',
      action: () => navigate('/profesionales'),
      color: 'purple'
    },
    {
      title: 'Explorar Servicios',
      description: 'Descubre nuestras terapias',
      icon: '✨',
      action: () => navigate('/servicios'),
      color: 'blue'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información',
      icon: '👤',
      action: () => navigate('/perfil'),
      color: 'gray'
    }
  ];

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Welcome Section */}
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="welcome-title">Hola, {user?.nombre}</h1>
          <p className="welcome-subtitle">Bienvenido a tu espacio de bienestar emocional</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card cyan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.proximasCitas}</h3>
              <p className="stat-label">Próximas Citas</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card green"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.citasCompletadas}</h3>
              <p className="stat-label">Sesiones Completadas</p>
            </div>
          </motion.div>

          <motion.div 
            className="stat-card purple"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.profesionales}</h3>
              <p className="stat-label">Profesionales Disponibles</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                className={`action-card ${action.color}`}
                onClick={action.action}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="action-icon">{action.icon}</div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="info-grid">
          <motion.div 
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h3 className="info-title">¿Por qué elegirnos?</h3>
            <ul className="info-list">
              <li>✓ Profesionales certificados en salud mental</li>
              <li>✓ Sesiones personalizadas a tus necesidades</li>
              <li>✓ Confidencialidad y privacidad garantizada</li>
              <li>✓ Horarios flexibles y accesibles</li>
            </ul>
          </motion.div>

          <motion.div 
            className="info-card highlight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="info-title">Tu Progreso</h3>
            <p className="info-text">
              Comienza tu camino hacia el bienestar emocional. Agenda tu primera sesión hoy.
            </p>
            <button className="info-button" onClick={() => navigate('/citas/nueva')}>
              Agendar Primera Sesión
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap');

        .dashboard {
          min-height: 100vh;
          background-color: #FAFAFA;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .welcome-section {
          margin-bottom: 3rem;
        }

        .welcome-title {
          font-size: 3rem;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #000000;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
        }

        .welcome-subtitle {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border: 1px solid #E5E5E5;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }

        .stat-card.cyan {
          border-left: 4px solid #06B6D4;
        }

        .stat-card.green {
          border-left: 4px solid #10B981;
        }

        .stat-card.purple {
          border-left: 4px solid #8B5CF6;
        }

        .stat-icon {
          font-size: 3rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.25rem 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #666666;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 1.5rem 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          border: 1px solid #E5E5E5;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }

        .action-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .action-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .action-description {
          font-size: 0.875rem;
          color: #666666;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          border: 1px solid #E5E5E5;
          border-radius: 16px;
          padding: 2rem;
        }

        .info-card.highlight {
          background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
          border-color: #06B6D4;
        }

        .info-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 1rem 0;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          color: #666666;
          margin-bottom: 0.75rem;
          font-size: 0.9375rem;
        }

        .info-text {
          color: #666666;
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
        }

        .info-button {
          width: 100%;
          padding: 0.875rem;
          background-color: #000000;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .info-button:hover {
          background-color: #06B6D4;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 2rem 1rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .stats-grid,
          .actions-grid,
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}