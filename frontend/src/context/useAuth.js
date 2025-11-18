// src/context/useAuth.js
import { useContext } from 'react';
import AuthContext from './AuthContext'; // <-- ¡CAMBIO CLAVE! Sin llaves {}

// Hook personalizado para acceder al contexto de autenticación de forma segura.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}