// ? scope: world (gm), client (player)
// ? config: true (visible)

import { SYSTEM_NAME } from './constants.js';

export function registerSystemSettings() {
  const sysName = game.system.data.name || SYSTEM_NAME;

  game.settings.register(sysName, 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  game.settings.register(sysName, 'messages', {
    name: 'Displayed Messages',
    hint: 'Used to track which messages have been displayed',
    scope: 'world',
    config: false,
    type: Array,
    default: [],
  });
}
