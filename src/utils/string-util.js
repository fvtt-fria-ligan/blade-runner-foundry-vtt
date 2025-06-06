/**
 * Capitalizes the first letter of a string.
 * @param {string} str The string to capitalize
 * @returns {string}
 */
export function capitalize(str) {
  if (!str.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Enriches HTML text with Foundry links.
 * @param {Object}   sheetData  The data object
 * @param {string[]} fieldNames Field names that contain the text to enrich
 */
export async function enrichTextFields(sheetData, fieldNames) {
  for (const fieldName of fieldNames) {
    if (foundry.utils.hasProperty(sheetData, fieldName)) {
      foundry.utils.setProperty(
        sheetData,
        fieldName,
        await foundry.applications.ux.TextEditor.enrichHTML(
          foundry.utils.getProperty(sheetData, fieldName),
          { async: true },
        ),
      );
    }
  }
}
