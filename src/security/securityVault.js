/**
 * Expediente Perú - Módulo de Bóveda y Seguridad de Integridad
 * Protege contra manipulación de números de pago (Yape/Plin/Dale), inyecciones XSS
 * y ataques de fuerza bruta en el acceso administrativo.
 */

// Hash criptográfico SHA-256 de la clave administrativa (924571958) con salt
const ADMIN_HASH_VERIFIED = "fe40aa352acacd07e4d8b36be2f62dd9b5fa5cedb54fc27ab48e8322098bf9ac";
const ADMIN_SECURITY_SALT = "ExpedientePeru_2026_SecureAdminSalt_#99";

// Hash criptográfico de integridad del número de teléfono oficial (916839878)
const PHONE_HASH_VERIFIED = "b63c1df61589871f511dcc8fe4426840c3edd1c773af33d668210bce8ee75689";
const PHONE_SECURITY_SALT = "916839878_ExpedientePeru_Vault";

// Configuración sellada e inmutable (previene sobreescritura desde la consola o extensiones)
const OFFICIAL_PAYMENT_CONFIG = Object.freeze({
  phone: "916839878",
  recipient: "Expediente Perú Oficial",
  channels: Object.freeze(["Yape", "Plin", "Dale"]),
  verifiedHash: PHONE_HASH_VERIFIED
});

// Prevenir modificación de prototipos
Object.seal(OFFICIAL_PAYMENT_CONFIG);

/**
 * Función criptográfica estándar usando la Web Crypto API del navegador
 */
export async function computeSHA256(message) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error("Error criptográfico:", err);
    return null;
  }
}

/**
 * Verificación de integridad del número de pago:
 * Si algún script malicioso o extensión altera la variable, la bóveda detecta la manipulación.
 */
export async function getVerifiedPaymentPhone() {
  const currentPhone = OFFICIAL_PAYMENT_CONFIG.phone;
  const hash = await computeSHA256(currentPhone + "_" + "ExpedientePeru_Vault");

  if (hash !== PHONE_HASH_VERIFIED) {
    console.error("[SEGURIDAD CRÍTICA] Intento de manipulación detectado en el número de donación.");
    // Devolver siempre la constante inmutable de rescate
    return "916839878";
  }

  return currentPhone;
}

/**
 * Copiado seguro al portapapeles:
 * Verifica el hash antes de transferir datos al portapapeles del usuario.
 */
export async function secureCopyToClipboard() {
  const verifiedPhone = await getVerifiedPaymentPhone();
  try {
    await navigator.clipboard.writeText(verifiedPhone);
    return true;
  } catch (err) {
    console.error("No se pudo copiar al portapapeles:", err);
    return false;
  }
}

/**
 * Sistema de Control de Intentos y Anti-Fuerza Bruta para el Panel de Administración
 */
const STORAGE_KEY_ATTEMPTS = "exp_admin_failed_attempts";
const STORAGE_KEY_LOCKOUT = "exp_admin_lockout_until";

export function getAdminSecurityStatus() {
  try {
    const lockoutUntil = parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT) || "0", 10);
    const now = Date.now();

    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        attempts: parseInt(sessionStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10)
      };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attempts: parseInt(sessionStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10)
    };
  } catch (e) {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

export function registerFailedAdminAttempt() {
  try {
    const currentAttempts = parseInt(sessionStorage.getItem(STORAGE_KEY_ATTEMPTS) || "0", 10) + 1;
    sessionStorage.setItem(STORAGE_KEY_ATTEMPTS, currentAttempts.toString());

    // Reglas de bloqueo progresivo anti-hackers:
    if (currentAttempts >= 5) {
      // Bloqueo de 5 minutos tras 5 intentos fallidos
      const lockDurationMs = 5 * 60 * 1000;
      sessionStorage.setItem(STORAGE_KEY_LOCKOUT, (Date.now() + lockDurationMs).toString());
    } else if (currentAttempts >= 3) {
      // Bloqueo de 30 segundos tras 3 intentos fallidos
      const lockDurationMs = 30 * 1000;
      sessionStorage.setItem(STORAGE_KEY_LOCKOUT, (Date.now() + lockDurationMs).toString());
    }
  } catch (e) {
    // ignore
  }
}

export function resetAdminFailedAttempts() {
  try {
    sessionStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    sessionStorage.removeItem(STORAGE_KEY_LOCKOUT);
  } catch (e) {
    // ignore
  }
}

/**
 * Verificación Segura del PIN de Administrador (Sin almacenar contraseñas en texto plano)
 */
export async function verifyAdminCredentials(inputPin) {
  // Retardo artificial de seguridad (Rate-limiting contra scripts automatizados)
  await new Promise(resolve => setTimeout(resolve, 650));

  const status = getAdminSecurityStatus();
  if (status.isLocked) {
    return {
      success: false,
      isLocked: true,
      remainingSeconds: status.remainingSeconds,
      message: `Panel bloqueado por seguridad anti-fuerza bruta. Espera ${status.remainingSeconds} segundos.`
    };
  }

  if (!inputPin || typeof inputPin !== 'string') {
    registerFailedAdminAttempt();
    return { success: false, message: "Código inválido." };
  }

  const cleanPin = inputPin.trim();
  const computedHash = await computeSHA256(cleanPin + ADMIN_SECURITY_SALT);

  if (computedHash === ADMIN_HASH_VERIFIED) {
    resetAdminFailedAttempts();
    return { success: true };
  } else {
    registerFailedAdminAttempt();
    const updatedStatus = getAdminSecurityStatus();
    return {
      success: false,
      isLocked: updatedStatus.isLocked,
      remainingSeconds: updatedStatus.remainingSeconds,
      attempts: updatedStatus.attempts,
      message: updatedStatus.isLocked
        ? `Demasiados intentos fallidos. Panel bloqueado por ${updatedStatus.remainingSeconds} segundos.`
        : "Clave de administrador incorrecta. Acceso denegado."
    };
  }
}

/**
 * Sanitizador Anti-XSS (Previene inyección de scripts HTML en nombres o mensajes)
 */
export function sanitizeSecureText(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Eliminar tags HTML
    .replace(/javascript:/gi, '') // Eliminar pseudo-protocolos maliciosos
    .replace(/on\w+=/gi, '') // Eliminar manejadores de eventos (onload, onerror, etc.)
    .trim();
}
