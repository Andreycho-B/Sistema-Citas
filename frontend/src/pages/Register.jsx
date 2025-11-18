import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/login', { 
        state: { message: 'Registro exitoso. Inicia sesión para continuar.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div 
        className="register-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <motion.div 
          className="register-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="register-title">Únete a nosotros</h1>
          <p className="register-subtitle">Crea tu cuenta y comienza tu viaje</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onFocus={() => setFocusedField('nombre')}
              onBlur={() => setFocusedField('')}
              className={`form-input ${focusedField === 'nombre' ? 'focused' : ''}`}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              className={`form-input ${focusedField === 'email' ? 'focused' : ''}`}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              onFocus={() => setFocusedField('telefono')}
              onBlur={() => setFocusedField('')}
              className={`form-input ${focusedField === 'telefono' ? 'focused' : ''}`}
              placeholder="3001234567"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              className={`form-input ${focusedField === 'password' ? 'focused' : ''}`}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="submit-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Crear cuenta'
            )}
          </motion.button>

          <div className="form-footer">
            <p className="footer-text">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="footer-link">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .register-card {
          width: 100%;
          max-width: 440px;
          padding: 0;
        }

        .register-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .register-title {
          font-size: 3.5rem;
          font-weight: 600;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          color: #000000;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }

        .register-subtitle {
          font-size: 1.125rem;
          font-weight: 400;
          color: #666666;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .error-message {
          background-color: #F0F9FF;
          border: 1px solid #06B6D4;
          color: #0891B2;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          font-weight: 400;
          color: #000000;
          background-color: #FFFFFF;
          border: 1.5px solid #E5E5E5;
          border-radius: 12px;
          outline: none;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          font-family: 'Inter', sans-serif;
        }

        .form-input::placeholder {
          color: #AAAAAA;
          font-weight: 400;
        }

        .form-input:hover {
          border-color: #CCCCCC;
        }

        .form-input.focused,
        .form-input:focus {
          border-color: #06B6D4;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.08);
        }

        .submit-button {
          width: 100%;
          padding: 1.125rem;
          font-size: 1rem;
          font-weight: 600;
          color: #FFFFFF;
          background-color: #000000;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          margin-top: 2rem;
          letter-spacing: 0.01em;
          font-family: 'Inter', sans-serif;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #06B6D4;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.25);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .footer-text {
          font-size: 0.9375rem;
          color: #666666;
          margin: 0;
        }

        .footer-link {
          color: #06B6D4;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #0891B2;
        }

        @media (max-width: 640px) {
          .register-title {
            font-size: 2.5rem;
          }
          
          .register-card {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}