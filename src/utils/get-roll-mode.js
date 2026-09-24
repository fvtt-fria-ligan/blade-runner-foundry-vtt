/**
 * Gets the user's default roll mode, using an id valid for the running Foundry version.
 * Foundry v14 replaced the `core.rollMode` client setting (legacy ids such as `gmroll`)
 * with `core.messageMode` (ids such as `gm`, matching `CONFIG.ChatMessage.modes`).
 * @returns {string}
 */
export function getDefaultRollMode() {
  if (CONFIG.ChatMessage?.modes) return game.settings.get('core', 'messageMode');
  return game.settings.get('core', 'rollMode');
}
