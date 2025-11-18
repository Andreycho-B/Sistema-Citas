/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima (default: 6)
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password, minLength = 6) {
  const errors = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
    return { valid: false, errors };
  }
  
  if (password.length < minLength) {
    errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida que dos contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} True si coinciden
 */
export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && cleaned.length >= 10;
}

/**
 * Valida que una fecha sea futura
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} True si es futura
 */
export function isFutureDate(date) {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Valida que una fecha esté dentro de un rango
 * @param {string|Date} date - Fecha a validar
 * @param {string|Date} minDate - Fecha mínima
 * @param {string|Date} maxDate - Fecha máxima
 * @returns {boolean} True si está en el rango
 */
export function isDateInRange(date, minDate, maxDate) {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const minDateObj = typeof minDate === 'string' ? new Date(minDate) : minDate;
  const maxDateObj = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;
  
  return dateObj >= minDateObj && dateObj <= maxDateObj;
}

/**
 * Valida un campo requerido
 * @param {any} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Valida la longitud de un texto
 * @param {string} text - Texto a validar
 * @param {number} minLength - Longitud mínima
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} True si está en el rango
 */
export function isValidLength(text, minLength = 0, maxLength = Infinity) {
  if (!text) return minLength === 0;
  return text.length >= minLength && text.length <= maxLength;
}

/**
 * Valida un número en un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True si está en el rango
 */
export function isNumberInRange(value, min = -Infinity, max = Infinity) {
  if (typeof value !== 'number' || isNaN(value)) return false;
  return value >= min && value <= max;
}

/**
 * Valida un formulario completo
 * @param {object} formData - Datos del formulario
 * @param {object} rules - Reglas de validación
 * @returns {object} { valid: boolean, errors: object }
 */
export function validateForm(formData, rules) {
  const errors = {};
  let valid = true;
  
  for (const field in rules) {
    const value = formData[field];
    const fieldRules = rules[field];
    const fieldErrors = [];
    
    // Validar requerido
    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push(fieldRules.requiredMessage || `${field} es requerido`);
    }
    
    // Validar email
    if (fieldRules.email && value && !isValidEmail(value)) {
      fieldErrors.push(fieldRules.emailMessage || 'Email inválido');
    }
    
    // Validar longitud
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      fieldErrors.push(fieldRules.minLengthMessage || `Debe tener al menos ${fieldRules.minLength} caracteres`);
    }
    
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      fieldErrors.push(fieldRules.maxLengthMessage || `Debe tener máximo ${fieldRules.maxLength} caracteres`);
    }
    
    // Validar rango numérico
    if (fieldRules.min !== undefined && value < fieldRules.min) {
      fieldErrors.push(fieldRules.minMessage || `Debe ser mayor o igual a ${fieldRules.min}`);
    }
    
    if (fieldRules.max !== undefined && value > fieldRules.max) {
      fieldErrors.push(fieldRules.maxMessage || `Debe ser menor o igual a ${fieldRules.max}`);
    }
    
    // Validación personalizada
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        fieldErrors.push(customError);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      valid = false;
    }
  }
  
  return { valid, errors };
}
