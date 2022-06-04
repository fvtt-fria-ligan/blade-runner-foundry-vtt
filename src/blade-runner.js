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

import { FLBR } from './system/config.js';
import * as YZUR from '@lib/yzur.js';
import { registerSheets } from './system/sheets.js';
import { initializeHandlebars } from './system/handlebars.js';
import { registerSystemSettings } from './system/settings.js';
import BladeRunnerActor from './actor/actor-document.js';
import BladeRunnerItem from './item/item-document.js';
import { ACTOR_TYPES } from '@system/constants.js';

/* ------------------------------------------ */
/*  Foundry VTT Initialization                */
/* ------------------------------------------ */

/**
 * Debugging
 */
/** @__PURE__ */ (async () => {
  CONFIG.debug.hooks = true;
  console.warn('HOOKS DEBUG ACTIVATED: ', CONFIG.debug.hooks);
})();

Hooks.once('init', () => {
  console.log('FLBR | Initializing the Blade Runner RPG Game System');

  // Registers dice.
  YZUR.YearZeroRollManager.register('br', {}, { index: 1 });

  // Creates a namespace within the game global.
  // Places our classes in their own namespace for later reference.
  game.bladerunner = {
    config: FLBR,
    roll: '',
  };

  // Records configuration values.
  CONFIG.BLADE_RUNNER = FLBR;
  CONFIG.Actor.documentClass = BladeRunnerActor;
  CONFIG.Item.documentClass = BladeRunnerItem;
  // CONFIG.Combat.documentClass = BladeRunnerCombat;
  // CONFIG.Combatant.documentClass = BladeRunnerCombatant;

  // Patches Core functions.
  CONFIG.Combat.initiative = {
    formula: '1d10 + (@attributes.agi.value / 100)',
    decimals: 2,
  };

  registerSheets();
  initializeHandlebars();
  registerSystemSettings();
});

Hooks.once('ready', () => {
  // TODO Wait to register hotbar drop hook on ready so that modules could register earlier if they want to.
  // Hooks.on('hotbarDrop', (bar, data, slot) => createT2KMacro(data, slot));

  // TODO Determines whether a system migration is required and feasible.
  // checkMigration();

  console.log('FLBR | READY!');

  // Debugging.
  game.actors.getName('Bob')?.sheet?.render(true);
});

// TODO Hooks.once('diceSoNiceReady', dice3d => registerDsN(dice3d));

Hooks.on('renderItemSheet', (app, _html) => {
  app._element[0].style.height = 'auto';
});

// Hooks.on('renderActorSheet', (app, _html) => {
//   app._element[0].style.height = 'auto';
// });

Hooks.on('createActor', async (actor, _data, _options) => {
  const actorData = actor.data.data;
  const updateData = {};
  switch (actor.type) {
    case ACTOR_TYPES.PC:
    case ACTOR_TYPES.NPC:
      if (!actorData.attributes || !actorData.skills) {
        throw new TypeError(`FLBR | "${actor.type}" has No attribute nor skill`);
      }
      // Sets the default starting value for each attribute.
      for (const attribute in actorData.attributes) {
        updateData[`data.attributes.${attribute}.value`] = FLBR.startingAttributeLevel;
      }
      // Builds the list of skills and sets their default values.
      for (const skill in FLBR.skillMap) {
        updateData[`data.skills.${skill}.value`] = FLBR.startingSkillLevel;
      }
      break;
  }
  if (!foundry.utils.isObjectEmpty(updateData)) {
    await actor.update(updateData);
  }
});