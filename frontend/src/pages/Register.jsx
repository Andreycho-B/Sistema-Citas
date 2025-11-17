import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-anton text-indigo-900 mb-2">
            Únete a nosotros
          </h1>
          <p className="text-gray-600 font-montserrat">
            Comienza tu camino hacia el bienestar emocional
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-field"
                placeholder="3001234567"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 font-opensans">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}