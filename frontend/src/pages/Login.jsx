import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">
            Bienvenido
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Tu espacio de bienestar emocional
          </p>
        </div>

        {/* Card with glassmorphism */}
        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-2xl text-sm backdrop-blur-xl animate-shake">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 ml-1">
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-all duration-300 backdrop-blur-xl
                    ${focused === 'email' ? 'border-purple-500 bg-white/10' : 'border-white/10'}`}
                  placeholder="tu@email.com"
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 
                  transition-all duration-300 ${focused === 'email' ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-all duration-300 backdrop-blur-xl
                    ${focused === 'password' ? 'border-purple-500 bg-white/10' : 'border-white/10'}`}
                  placeholder="••••••••"
                  required
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 
                  transition-all duration-300 ${focused === 'password' ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl
                font-medium shadow-lg hover:shadow-purple-500/50 
                transform hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">o</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  Crear cuenta
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8 animate-fade-in-delayed">
          Diseñado con atención al detalle para tu bienestar
        </p>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delayed {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-gradient { animation: gradient 8s ease-in-out infinite; }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}