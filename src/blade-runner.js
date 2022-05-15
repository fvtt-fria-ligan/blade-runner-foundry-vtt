/*
 * ============================================================================
 * BLADE RUNNER RPG
 * Official website: https://frialigan.se/en/games/blade-runner/
 * ============================================================================
 * Contributing: https://github.com/Stefouch/blade-runner-foundry-vtt
 * ============================================================================
 * Creator: Stefouch
 * Patreon: https://www.patreon.com/Stefouch
 * ============================================================================
 * Source Code License: GPL-3.0-or-later
 *
 * Foundry License: Foundry Virtual Tabletop End User License Agreement
 *   https://foundryvtt.com/article/license/
 *
 * ============================================================================
 */

import { FLBR } from './config.js';
import * as YZUR from 'static/lib/yzur.js';

/* ------------------------------------------- */
/*  Foundry VTT Initialization                 */
/* ------------------------------------------- */

Hooks.once('init', () => {
  console.log('FLBR | Initializing the Blade Runner RPG Game System');

  // Registers dice.
  YZUR.YearZeroRollManager.register('br');

  // Creates a namespace within the game global.
  // Places our classes in their own namespace for later reference.
  game.bladerunner = {
    config: FLBR,
    roller: '',
  };

  // Records configuration values.
  CONFIG.BLADE_RUNNER = FLBR;

  // Patches Core functions.
  CONFIG.Combat.initiative = {
    formula: '1d10 + (@attributes.agi.value / 100)',
    decimals: 2,
  };

  // registerSheets();
  // registerHandlebars();
  // registerSystemSettings();
});

Hooks.once('ready', () => {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to.
  // Hooks.on('hotbarDrop', (bar, data, slot) => createT2KMacro(data, slot));

  // Determines whether a system migration is required and feasible.
  // checkMigration();

  console.log('FLBR | READY!');
});

// Hooks.once('diceSoNiceReady', dice3d => registerDsN(dice3d));

Hooks.on('renderItemSheet', (app, _html) => {
  app._element[0].style.height = 'auto';
});

// Hooks.on('renderActorSheet', (app, _html) => {
//   app._element[0].style.height = 'auto';
// });
