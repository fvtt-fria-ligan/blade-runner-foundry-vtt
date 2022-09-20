/*
 * ============================================================================
 * BLADE RUNNER RPG
 * Official website: https://frialigan.se/en/games/blade-runner/
 * ============================================================================
 * Contributing: https://github.com/fvtt-fria-ligan/blade-runner-foundry-vtt
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

import { FLBR } from '@system/config';
import { ACTOR_TYPES } from '@system/constants';
import * as YZUR from 'yzur';
import * as Chat from '@system/chat';
import BRRollHandler from '@components/roll/roller';
import { registerSheets } from '@system/sheets';
import { initializeHandlebars } from '@system/handlebars';
import { registerSystemSettings } from '@system/settings';
import { registerDiceSoNice } from './plugins/dice-so-nice.js';
import BladeRunnerActor from '@actor/actor-document';
import BladeRunnerItem from '@item/item-document';
import displayMessages from '@components/messaging-system';

/* ------------------------------------------ */
/*  Foundry VTT Initialization                */
/* ------------------------------------------ */

Hooks.once('init', () => {
  console.log('FLBR | Initializing the Blade Runner RPG Game System');

  // Registers dice.
  YZUR.YearZeroRollManager.register('br', {
    'Roll.chatTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard.hbs',
    'Roll.tooltipTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard-tooltip-partial.hbs',
    'Roll.infosTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard-infos-partial.hbs',
    'Icons.br.base.1': 'F',
  }, { index: 1 });

  // Creates a namespace within the game global.
  // Places our classes in their own namespace for later reference.
  game.bladerunner = {
    config: FLBR,
    roller: BRRollHandler,
  };

  // Records configuration values.
  CONFIG.BLADE_RUNNER = FLBR;
  CONFIG.Actor.documentClass = BladeRunnerActor;
  CONFIG.Item.documentClass = BladeRunnerItem;
  // TODO Combat
  // CONFIG.Combat.documentClass = BladeRunnerCombat;
  // CONFIG.Combatant.documentClass = BladeRunnerCombatant;

  // Patches Core functions.
  // TODO use initiative cards
  CONFIG.Combat.initiative = {
    formula: '1d10 + (@attributes.agi.value / 100)',
    decimals: 2,
  };

  registerSheets();
  initializeHandlebars();
  registerSystemSettings();
});

/* ------------------------------------------ */
/*  Foundry VTT Ready                         */
/* ------------------------------------------ */

Hooks.once('ready', () => {
  // TODO Wait to register hotbar drop hook on ready so that modules could register earlier if they want to.
  // Hooks.on('hotbarDrop', (bar, data, slot) => createT2KMacro(data, slot));

  // TODO Determines whether a system migration is required and feasible.
  // checkMigration();

  // Displays system messages.
  displayMessages();

  console.log('FLBR | READY!');
});

/* ------------------------------------------ */
/*  Foundry VTT Hooks (Other)                 */
/* ------------------------------------------ */

Hooks.once('diceSoNiceReady', dice3d => registerDiceSoNice(dice3d));

/* ------------------------------------------ */

Hooks.on('renderItemSheet', (app, _html) => {
  app._element[0].style.height = 'auto';
});

/* ------------------------------------------ */

Hooks.on('getChatLogEntryContext', Chat.addChatMessageContextOptions);

Hooks.on('renderChatLog', (_app, html, _data) => Chat.addChatListeners(html));
Hooks.on('renderChatMessage', (_msg, html, _data) => Chat.hideChatActionButtons(html));

/* ------------------------------------------ */

// Hooks.on('renderActorSheet', (app, _html) => {
//   app._element[0].style.height = 'auto';
// });

Hooks.on('createActor', async (actor, _data, _options) => {
  const updateData = {};
  switch (actor.type) {
    case ACTOR_TYPES.CHAR:
      if (!actor.system.attributes || !actor.system.skills) {
        throw new TypeError(`FLBR | "${actor.type}" has No attribute nor skill`);
      }
      // Sets the default starting value for each attribute.
      for (const attribute in actor.system.attributes) {
        updateData[`system.attributes.${attribute}.value`] = FLBR.startingAttributeLevel;
      }
      // Builds the list of skills and sets their default values.
      for (const skill in FLBR.skillMap) {
        updateData[`system.skills.${skill}.value`] = FLBR.startingSkillLevel;
      }
      break;
  }
  if (!foundry.utils.isEmpty(updateData)) {
    await actor.update(updateData);
  }
});
