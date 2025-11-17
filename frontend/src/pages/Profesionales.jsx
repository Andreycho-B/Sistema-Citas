import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { profesionalService } from '../services/profesionalService';

export default function Profesionales() {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProfesionales();
  }, []);

  const loadProfesionales = async () => {
    try {
      const data = await profesionalService.obtenerTodosLosProfesionales();
      setProfesionales(data);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfesionales = profesionales.filter(prof =>
    prof.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="page-content">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="page-title">Nuestros Profesionales</h1>
          <p className="page-subtitle">Encuentra al especialista ideal para ti</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="search-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </motion.div>

        {/* Profesionales Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando profesionales...</p>
          </div>
        ) : filteredProfesionales.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <h3>No se encontraron profesionales</h3>
            <p>No hay profesionales disponibles en este momento</p>
          </div>
        ) : (
          <div className="professionals-grid">
            {filteredProfesionales.map((profesional, index) => (
              <motion.div
                key={profesional.id}
                className="professional-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="professional-avatar">
                  {profesional.usuario?.nombre?.charAt(0) || 'P'}
                </div>
                <h3 className="professional-name">
                  {profesional.usuario?.nombre || 'Nombre no disponible'}
                </h3>
                <span className="professional-specialty">
                  {profesional.especialidad}
                </span>
                <p className="professional-email">
                  {profesional.usuario?.email}
                </p>
                <button className="contact-button">
                  Agendar Cita
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,600&display=swap');

        .page-container {
          min-height: 100vh;
          background-color: #FAFAFA;
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #666666;
          margin: 0;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          border: 1.5px solid #E5E5E5;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .search-input:focus {
          border-color: #06B6D4;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.08);
        }

        .professionals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .professional-card {
          background: white;
          border: 1px solid #E5E5E5;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .professional-card:hover {
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }

        .professional-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: white;
          margin: 0 auto 1.5rem;
        }

        .professional-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .professional-specialty {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background-color: #F0F9FF;
          color: #06B6D4;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .professional-email {
          font-size: 0.9375rem;
          color: #666666;
          margin: 0 0 1.5rem 0;
        }

        .contact-button {
          width: 100%;
          padding: 0.875rem;
          background-color: #000000;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .contact-button:hover {
          background-color: #06B6D4;
          transform: translateY(-2px);
        }

        .loading-container {
          text-align: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #E5E5E5;
          border-top-color: #06B6D4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          color: #666666;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .page-content {
            padding: 2rem 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .professionals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}