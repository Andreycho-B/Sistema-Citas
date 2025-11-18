import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profesionales from './pages/Profesionales';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsuariosPage from './pages/AdminUsuariosPage';
import AdminProfesionalesPage from './pages/AdminProfesionalesPage';
import AdminServiciosPage from './pages/AdminServiciosPage';
import AdminCitasPage from './pages/AdminCitasPage';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import MisServiciosPage from './pages/MisServiciosPage';
import ServiciosPage from './pages/ServiciosPage';
import CrearServicioPage from './pages/CrearServicioPage';
import AgendarCitaPage from './pages/AgendarCitaPage';
import MisCitasPage from './pages/MisCitasPage';
import PerfilPage from './pages/PerfilPage';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Nuevas rutas para diferentes roles */}
		  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
		  <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsuariosPage /></ProtectedRoute>} />
		  <Route path="/admin/profesionales" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProfesionalesPage /></ProtectedRoute>} />
		  <Route path="/admin/servicios" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminServiciosPage /></ProtectedRoute>} />
		  <Route path="/admin/citas" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCitasPage /></ProtectedRoute>} />
		  <Route path="/admin/servicios/nuevo" element={<ProtectedRoute allowedRoles={['ADMIN']}><CrearServicioPage /></ProtectedRoute>} />
          <Route path="/professional/dashboard" element={<ProtectedRoute allowedRoles={['PROFESSIONAL', 'ADMIN']}><ProfessionalDashboard /></ProtectedRoute>} />
          <Route path="/professional/mis-servicios" element={<ProtectedRoute allowedRoles={['PROFESSIONAL', 'ADMIN']}><MisServiciosPage /></ProtectedRoute>} />
          <Route path="/profesionales" element={<ProtectedRoute><Profesionales /></ProtectedRoute>} />
			  <Route path="/servicios" element={<ProtectedRoute><ServiciosPage /></ProtectedRoute>} />
			  <Route path="/citas/nueva" element={<ProtectedRoute><AgendarCitaPage /></ProtectedRoute>} />
			  <Route path="/mis-citas" element={<ProtectedRoute><MisCitasPage /></ProtectedRoute>} />
			  <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
          {/* Redirigir raíz a dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Ruta no encontrada */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
