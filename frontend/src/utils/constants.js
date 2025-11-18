// Estados de citas
export const ESTADO_CITA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
};

// Roles de usuario
export const ROLES = {
  USER: 'USER',
  PROFESSIONAL: 'PROFESSIONAL',
  ADMIN: 'ADMIN'
};

// Colores por estado
export const ESTADO_COLORS = {
  [ESTADO_CITA.PENDIENTE]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300'
  },
  [ESTADO_CITA.CONFIRMADA]: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-300'
  },
  [ESTADO_CITA.COMPLETADA]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  [ESTADO_CITA.CANCELADA]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300'
  }
};

// Textos de estado
export const ESTADO_TEXTO = {
  [ESTADO_CITA.PENDIENTE]: 'Pendiente',
  [ESTADO_CITA.CONFIRMADA]: 'Confirmada',
  [ESTADO_CITA.COMPLETADA]: 'Completada',
  [ESTADO_CITA.CANCELADA]: 'Cancelada'
};

// Configuración de API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor verifica tu conexión a internet.',
  UNAUTHORIZED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor intenta nuevamente.'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  CITA_CREADA: 'Cita agendada exitosamente',
  CITA_ACTUALIZADA: 'Cita actualizada exitosamente',
  CITA_CANCELADA: 'Cita cancelada exitosamente',
  PERFIL_ACTUALIZADO: 'Perfil actualizado exitosamente',
  PASSWORD_CHANGED: 'Contraseña actualizada exitosamente',
  SERVICIO_CREADO: 'Servicio creado exitosamente',
  SERVICIO_ACTUALIZADO: 'Servicio actualizado exitosamente',
  SERVICIO_ELIMINADO: 'Servicio eliminado exitosamente'
};

// Duraciones de toast
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
};

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFESIONALES: '/profesionales',
  SERVICIOS: '/servicios',
  MIS_CITAS: '/mis-citas',
  NUEVA_CITA: '/citas/nueva',
  PERFIL: '/perfil',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SERVICIOS_NUEVO: '/admin/servicios/nuevo',
  PROFESSIONAL_DASHBOARD: '/professional/dashboard'
};
