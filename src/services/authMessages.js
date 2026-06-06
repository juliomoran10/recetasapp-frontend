export const AUTH_ERRORS = {
  invalid_credentials: 'Usuario o contraseña incorrectos.',
  username_exists: 'Ese usuario ya existe.',
  email_exists: 'Ese correo ya está registrado.',
  missing_fields: 'Completa todos los campos.',
  invalid_email: 'Por favor, introduce un correo electrónico válido.',
  invalid_password: 'La contraseña debe tener entre 8 y 20 caracteres, incluir una mayúscula, un número y un símbolo.',
  invalid_or_expired_token: 'El código ingresado no es válido o ha expirado.',
  unauthorized: 'Tu sesión ha expirado. Inicia sesión de nuevo.',
  email_not_found: 'No encontramos un correo registrado con ese valor.',
  invalid_code: 'El código ingresado no es válido.',
  network_error: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
};

export function getAuthErrorMessage(code) {
  return AUTH_ERRORS[code] || 'No se pudo completar la operación.';
}
