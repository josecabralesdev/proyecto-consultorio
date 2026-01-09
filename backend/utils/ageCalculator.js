/**
 * Extrae la fecha de nacimiento del carnet de identidad cubano
 * Formato CI: AAMMDDXSSSS (11 dígitos)
 * - AA: Año (2 dígitos)
 * - MM: Mes
 * - DD: Día
 * - X: Dígito del siglo (0-5 = 1900s, 6-9 = 2000s)
 * - SSSS: Serie
 */
const parseCIDate = (carnetIdentidad) => {
  if (!carnetIdentidad || carnetIdentidad.length < 7) {
    return null;
  }

  // Limpiar el CI de espacios o caracteres no numéricos
  const ci = carnetIdentidad.replace(/\D/g, '');

  if (ci.length < 7) {
    return null;
  }

  const yearDigits = parseInt(ci.substring(0, 2), 10);
  const month = parseInt(ci.substring(2, 4), 10);
  const day = parseInt(ci.substring(4, 6), 10);
  const centuryDigit = parseInt(ci.substring(6, 7), 10);

  // Validar mes y día
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // Determinar el siglo basado en el séptimo dígito
  // 0-5: Siglo XX (1900-1999)
  // 6-9: Siglo XXI (2000-2099)
  let year;
  if (centuryDigit >= 0 && centuryDigit <= 5) {
    year = 1900 + yearDigits;
  } else {
    year = 2000 + yearDigits;
  }

  // Validar que la fecha sea válida
  const birthDate = new Date(year, month - 1, day);

  if (isNaN(birthDate.getTime())) {
    return null;
  }

  // Verificar que la fecha no sea futura
  if (birthDate > new Date()) {
    // Si es futura con siglo XXI, probar con siglo XX
    if (centuryDigit >= 6) {
      year = 1900 + yearDigits;
      const altDate = new Date(year, month - 1, day);
      if (altDate <= new Date()) {
        return altDate;
      }
    }
    return null;
  }

  return birthDate;
};

/**
 * Calcula la edad en años a partir de una fecha de nacimiento
 */
const calculateAge = (birthDate) => {
  if (!birthDate) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Calcula la edad a partir del carnet de identidad
 */
const getAgeFromCI = (carnetIdentidad) => {
  const birthDate = parseCIDate(carnetIdentidad);
  return calculateAge(birthDate);
};

/**
 * Obtiene información completa de la fecha de nacimiento desde el CI
 */
const getBirthInfoFromCI = (carnetIdentidad) => {
  const birthDate = parseCIDate(carnetIdentidad);

  if (!birthDate) {
    return {
      fecha_nacimiento: null,
      edad: null,
      edad_texto: null
    };
  }

  const age = calculateAge(birthDate);

  return {
    fecha_nacimiento: birthDate.toISOString().split('T')[0],
    edad: age,
    edad_texto: age !== null ? `${age} años` : null
  };
};

module.exports = {
  parseCIDate,
  calculateAge,
  getAgeFromCI,
  getBirthInfoFromCI
};