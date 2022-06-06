/**
 * Capitalizes the first letter of a string.
 * @param {string} str The string to capitalize
 * @returns {string}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
