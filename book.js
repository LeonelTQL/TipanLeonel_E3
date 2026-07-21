/**
 * Valida si el código del libro cumple el formato AAA999.
 * @param {string} code - Código del libro.
 * @returns {boolean}
 */
function isValidBookCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }
  const regex = /^[A-Z]{3}\d{3}$/;
  return regex.test(code);
}

/**
 * Calcula la multa por días de retraso a $0.50 por día.
 * @param {number} daysLate - Número de días de retraso.
 * @returns {number|null} Multa calculada o null si el valor es inválido (< 0).
 */
function calculateFine(daysLate) {
  const days = Number(daysLate);
  if (isNaN(days) || days < 0) {
    return null;
  }
  const fine = days * 0.50;
  return Number(fine.toFixed(2));
}
//TipanLeonel
module.exports = {
  isValidBookCode,
  calculateFine
};
