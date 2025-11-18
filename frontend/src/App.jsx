import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profesionales from './pages/Profesionales';
import AdminDashboard from './pages/AdminDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ServiciosPage from './pages/ServiciosPage';
import CrearServicioPage from './pages/CrearServicioPage';


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
		  // ...
		  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
		  // ...
		  <Route path="/admin/servicios/nuevo" element={<ProtectedRoute><CrearServicioPage /></ProtectedRoute>} />
          <Route path="/professional/dashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
          <Route path="/profesionales" element={<ProtectedRoute><Profesionales /></ProtectedRoute>} />
		  <Route path="/servicios" element={<ProtectedRoute><ServiciosPage /></ProtectedRoute>} />
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
