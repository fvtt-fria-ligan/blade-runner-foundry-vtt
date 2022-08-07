// ? scope: world (gm), client (player)
// ? config: true (visible)

import { SETTINGS_KEYS, SYSTEM_NAME } from './constants.js';

export function registerSystemSettings() {
  const sysName = game.system.data.name || SYSTEM_NAME;

  game.settings.register(sysName, SETTINGS_KEYS.SYSTEM_MIGRATION_VERSION, {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  game.settings.register(sysName, SETTINGS_KEYS.DISPLAYED_MESSAGES, {
    name: 'Displayed Messages',
    hint: 'Used to track which messages have been displayed',
    scope: 'world',
    config: false,
    type: Array,
    default: [],
  });
}
