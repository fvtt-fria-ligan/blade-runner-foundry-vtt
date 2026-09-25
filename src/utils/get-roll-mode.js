/**
 * Gets a user's roll mode
 * @returns {string}
 */
export function getUserRollMode() {
  const v14RollModes = CONFIG.ChatMessage?.modes;
  return v14RollModes ? game.settings.get('core', 'messageMode') : game.settings.get('core', 'rollMode');
}
