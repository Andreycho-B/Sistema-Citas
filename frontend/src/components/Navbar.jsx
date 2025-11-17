import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-anton text-indigo-600">BienestarEmocional</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-indigo-600 font-montserrat font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/profesionales" 
              className="text-gray-700 hover:text-indigo-600 font-montserrat font-medium transition-colors"
            >
              Profesionales
            </Link>
            <Link 
              to="/servicios" 
              className="text-gray-700 hover:text-indigo-600 font-montserrat font-medium transition-colors"
            >
              Servicios
            </Link>
            <Link 
              to="/mis-citas" 
              className="text-gray-700 hover:text-indigo-600 font-montserrat font-medium transition-colors"
            >
              Mis Citas
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-montserrat text-gray-700">
              Hola, <span className="font-semibold">{user?.nombre}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-montserrat text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}