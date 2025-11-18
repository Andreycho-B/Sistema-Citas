import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado (default: "PPP")
 * @returns {string} Fecha formateada
 */
export function formatDate(date, formatStr = "PPP") {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Fecha inválida';
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una fecha y hora en formato legible
 * @param {string|Date} date - Fecha y hora a formatear
 * @returns {string} Fecha y hora formateada
 */
export function formatDateTime(date) {
  return formatDate(date, "PPP 'a las' p");
}

/**
 * Formatea solo la hora
 * @param {string|Date} date - Fecha con hora a formatear
 * @returns {string} Hora formateada
 */
export function formatTime(date) {
  return formatDate(date, "h:mm a");
}

/**
 * Formatea un precio en formato de moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: "USD")
 * @returns {string} Precio formateado
 */
export function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error al formatear moneda:', error);
    return `$${amount}`;
  }
}

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export function formatPhone(phone) {
  if (!phone) return '';
  
  // Eliminar caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según longitud
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalizeWords(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Formatea una duración en minutos a formato legible
 * @param {number} minutes - Duración en minutos
 * @returns {string} Duración formateada
 */
export function formatDuration(minutes) {
  if (!minutes) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} h`;
  return `${hours} h ${mins} min`;
}

/**
 * Parsea una duración en formato texto a minutos
 * @param {string} duration - Duración en formato texto (ej: "1 hora", "30 minutos")
 * @returns {number} Duración en minutos
 */
export function parseDuration(duration) {
  if (!duration) return 0;
  
  const lowerDuration = duration.toLowerCase();
  let minutes = 0;
  
  // Buscar horas
  const hoursMatch = lowerDuration.match(/(\d+)\s*(h|hora|horas)/);
  if (hoursMatch) {
    minutes += parseInt(hoursMatch[1]) * 60;
  }
  
  // Buscar minutos
  const minutesMatch = lowerDuration.match(/(\d+)\s*(m|min|minuto|minutos)/);
  if (minutesMatch) {
    minutes += parseInt(minutesMatch[1]);
  }
  
  return minutes;
}
