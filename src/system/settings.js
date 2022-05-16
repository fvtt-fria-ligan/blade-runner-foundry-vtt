// config: true (visible)
// scope: world (gm), client (player)

import { BLADE_RUNNER } from './constants.js';

export function registerSystemSettings() {
  const br = game.system.data.name || BLADE_RUNNER;

  game.settings.register(br, 'systemMigrationVersion', {
    config: false,
    scope: 'world',
    name: 'System Migration Version',
    type: String,
    default: '',
  });

  game.settings.register(br, 'showTaskCheckOptions', {
    config: true,
    scope: 'client',
    name: 'SETTINGS.showTaskCheckOptions.name',
    hint: 'SETTINGS.showTaskCheckOptions.hint',
    type: Boolean,
    default: true,
  });

  game.settings.register(br, 'closeRollTooltipDelay', {
    config: true,
    scope: 'client',
    name: 'SETTINGS.closeRollTooltipDelay.name',
    hint: 'SETTINGS.closeRollTooltipDelay.hint',
    type: Number,
    default: 60,
  });
}