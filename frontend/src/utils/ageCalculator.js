/**
 * Extrae la fecha de nacimiento del carnet de identidad cubano
 * Formato CI: AAMMDDXSSSS (11 dígitos)
 */
export const parseCIDate = (carnetIdentidad) => {
  if (!carnetIdentidad || carnetIdentidad.length < 7) {
    return null;
  }

  const ci = carnetIdentidad.replace(/\D/g, '');

  if (ci.length < 7) {
    return null;
  }

  const yearDigits = parseInt(ci.substring(0, 2), 10);
  const month = parseInt(ci.substring(2, 4), 10);
  const day = parseInt(ci.substring(4, 6), 10);
  const centuryDigit = parseInt(ci.substring(6, 7), 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  let year;
  if (centuryDigit >= 0 && centuryDigit <= 5) {
    year = 1900 + yearDigits;
  } else {
    year = 2000 + yearDigits;
  }

  const birthDate = new Date(year, month - 1, day);

  if (isNaN(birthDate.getTime())) {
    return null;
  }

  if (birthDate > new Date()) {
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
export const calculateAge = (birthDate) => {
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
export const getAgeFromCI = (carnetIdentidad) => {
  const birthDate = parseCIDate(carnetIdentidad);
  return calculateAge(birthDate);
};

/**
 * Obtiene información completa de la fecha de nacimiento
 */
export const getBirthInfoFromCI = (carnetIdentidad) => {
  const birthDate = parseCIDate(carnetIdentidad);

  if (!birthDate) {
    return {
      fechaNacimiento: null,
      edad: null,
      edadTexto: null
    };
  }

  const age = calculateAge(birthDate);

  return {
    fechaNacimiento: birthDate.toISOString().split('T')[0],
    edad: age,
    edadTexto: age !== null ? `${age} años` : null
  };
};

/**
 * Formatea una fecha de nacimiento para mostrar
 */
export const formatBirthDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};