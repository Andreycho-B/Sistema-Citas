import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: '🏠' },
    { path: '/profesionales', label: 'Profesionales', icon: '👥' },
    { path: '/servicios', label: 'Servicios', icon: '✨' },
    { path: '/citas', label: 'Mis Citas', icon: '📅' },
  ];

  // Agregar items según rol
  if (user?.roles?.includes('ADMIN')) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  if (user?.roles?.includes('PROFESSIONAL')) {
    navItems.push({ path: '/profesional', label: 'Panel Pro', icon: '💼' });
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="brand-name">Bienestar</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.nombre}</span>
            <span className="user-role">
              {user?.roles?.includes('ADMIN') ? 'Administrador' : 
               user?.roles?.includes('PROFESSIONAL') ? 'Profesional' : 'Usuario'}
            </span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Salir
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .navbar {
          background-color: #FFFFFF;
          border-bottom: 1px solid #E5E5E5;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #000000;
          font-weight: 600;
          font-size: 1.125rem;
          transition: opacity 0.2s ease;
        }

        .navbar-brand:hover {
          opacity: 0.7;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-name {
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border-radius: 10px;
          text-decoration: none;
          color: #666666;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background-color: #F5F5F5;
          color: #000000;
        }

        .nav-link.active {
          background-color: #F0F9FF;
          color: #06B6D4;
        }

        .nav-icon {
          font-size: 1.125rem;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .user-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #000000;
        }

        .user-role {
          font-size: 0.75rem;
          color: #666666;
        }

        .logout-button {
          padding: 0.5rem 1rem;
          background-color: #000000;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-button:hover {
          background-color: #06B6D4;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .nav-links {
            display: none;
          }

          .user-info {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}