import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-anton text-gray-900 mb-2">
            Bienvenido de nuevo, {user?.nombre}
          </h1>
          <p className="text-gray-600 font-montserrat">
            Tu espacio de bienestar emocional y crecimiento personal
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <h3 className="text-lg font-montserrat font-semibold mb-2">
              Próximas Citas
            </h3>
            <p className="text-4xl font-anton">0</p>
            <p className="text-sm mt-2 opacity-90">Citas programadas</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <h3 className="text-lg font-montserrat font-semibold mb-2">
              Sesiones Completadas
            </h3>
            <p className="text-4xl font-anton">0</p>
            <p className="text-sm mt-2 opacity-90">Sesiones realizadas</p>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-pink-600 text-white">
            <h3 className="text-lg font-montserrat font-semibold mb-2">
              Profesionales
            </h3>
            <p className="text-4xl font-anton">12</p>
            <p className="text-sm mt-2 opacity-90">Especialistas disponibles</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-2xl font-anton text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-primary text-center">
              Agendar Cita
            </button>
            <button className="btn-secondary text-center">
              Ver Profesionales
            </button>
            <button className="btn-secondary text-center">
              Explorar Servicios
            </button>
            <button className="btn-secondary text-center">
              Mi Perfil
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-4">
              ¿Por qué elegir BienestarEmocional?
            </h3>
            <ul className="space-y-3 text-gray-700 font-opensans">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Profesionales certificados en salud mental
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Sesiones personalizadas a tus necesidades
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Confidencialidad y privacidad garantizada
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                Horarios flexibles y accesibles
              </li>
            </ul>
          </div>

          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50">
            <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-4">
              Tu Progreso
            </h3>
            <p className="text-gray-700 font-opensans mb-4">
              Comienza tu camino hacia el bienestar emocional. Agenda tu primera sesión hoy.
            </p>
            <button className="btn-primary">
              Agendar Primera Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}