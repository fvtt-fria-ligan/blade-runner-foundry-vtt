/**
 * Gets a table from its ID or name.
 * @param {string} idOrName ID or name of the table to find
 * @returns {RollTable}
 */
export function getTable(idOrName) {
  let table = game.tables.get(idOrName);
  if (!table) table = game.tables.getName(idOrName);
  return table;
}
