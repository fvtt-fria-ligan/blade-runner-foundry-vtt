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
import * as BRMacro from '@system/macros';
import BRRollHandler from '@components/roll/roller';
import { registerSheets } from '@system/sheets';
import { initializeHandlebars } from '@system/handlebars';
import { registerSystemSettings } from '@system/settings';
import { enrichTextEditors } from '@system/enricher';
import { registerDiceSoNice } from './plugins/dice-so-nice';
import { overrideInlineRollListener } from '@components/roll/inline-roll';
import BladeRunnerActor from '@actor/actor-document';
import BladeRunnerItem from '@item/item-document';
import displayMessages from '@components/messaging-system';

/* ------------------------------------------ */
/*  Foundry VTT Initialization                */
/* ------------------------------------------ */

Hooks.once('init', async () => {
  console.log('Blade Runner RPG | Initializing the Game System');

  // Registers dice.
  YZUR.YearZeroRollManager.register('br', {
    'Roll.chatTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard.hbs',
    'Roll.tooltipTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard-tooltip-partial.hbs',
    'Roll.infosTemplate': 'systems/blade-runner/templates/components/roll/roll-chatcard-infos-partial.hbs',
    'Icons.br.base.1': 'F',
  }, { index: 1 });

  // TODO Temporary fix
  Roll.prototype.constructor.create = function (formula, data = {}, options = {}) {
    const isYZURFormula = options.yzur ?? (
      'game' in data ||
      'game' in options ||
      'maxPush' in options ||
      /np|p(?:\d+|@maxPush)/i.test(formula)
    );
    const n = isYZURFormula ? 1 : 0;
    const cls = CONFIG.Dice.rolls[n];
    return new cls(formula, data, options);
  };

  // Creates a namespace within the game global.
  // Places our classes in their own namespace for later reference.
  game.bladerunner = {
    config: FLBR,
    roller: BRRollHandler,
    macros: {
      rollAction: BRMacro.rollAction,
      rollDice: BRMacro.showRollDialog,
      rollItem: BRMacro.rollItem,
      rollStat: BRMacro.rollStat,
    },
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
    formula: '1d10 + (@agi / 100)',
    decimals: 2,
  };

  registerSheets();
  registerSystemSettings();
  enrichTextEditors();
  await initializeHandlebars();

  console.log('Blade Runner RPG | Ready!');
  Hooks.call('bladeRunnerReady', game.bladerunner, CONFIG.BLADE_RUNNER);
});

/* ------------------------------------------ */
/*  Foundry VTT Ready                         */
/* ------------------------------------------ */

Hooks.once('ready', () => {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to.
  BRMacro.setupMacroFolder();
  Hooks.on('hotbarDrop', (_bar, data, slot) => BRMacro.createBladeRunnerMacro(data, slot));

  // TODO Determines whether a system migration is required and feasible.
  // checkMigration();

  // Displays system messages.
  displayMessages();

  // Replaces the a.inline listener with our own.
  overrideInlineRollListener();
});

/* ------------------------------------------ */
/*  Foundry VTT Hooks (Other)                 */
/* ------------------------------------------ */

Hooks.once('diceSoNiceReady', dice3d => registerDiceSoNice(dice3d));

/* ------------------------------------------ */

Hooks.on('renderItemSheet', (app, _html) => {
  app._element[0].style.height = 'auto';
});

// Hooks.on('renderActorSheet', (app, _html) => {
//   app._element[0].style.height = 'auto';
// });

/* ------------------------------------------ */

Hooks.on('getChatLogEntryContext', Chat.addChatMessageContextOptions);

Hooks.on('renderChatLog', (_app, html, _data) => Chat.addChatListeners(html));
Hooks.on('renderChatMessage', (_msg, html, _data) => Chat.hideChatActionButtons(html));

/* ------------------------------------------ */

Hooks.on('createActor', async (actor, _data, _options) => {
  const updateData = {
    'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    'prototypeToken.displayBars': CONST.TOKEN_DISPLAY_MODES.OWNER,
  };

  switch (actor.type) {
    case ACTOR_TYPES.CHAR:
      // TODO clean code
      // if (actor.system.subtype === ACTOR_SUBTYPES.PC) {
      //   // updateData['prototypeToken.actorLink'] = true;
      //   // updateData['prototypeToken.bar2.attribute'] = CAPACITIES.RESOLVE;
      // }
      if (!actor.system.attributes || !actor.system.skills) {
        throw new TypeError(`FLBR | "${actor.type}" has No attribute nor skill`);
      }
      if (foundry.utils.isEmpty(actor.system.skills)) {
        // Sets the default starting value for each attribute.
        for (const attribute in actor.system.attributes) {
          updateData[`system.attributes.${attribute}.value`] = FLBR.startingAttributeLevel;
        }
        // Builds the list of skills and sets their default values.
        for (const skill in FLBR.skillMap) {
          updateData[`system.skills.${skill}.value`] = FLBR.startingSkillLevel;
        }
      }
      break;
  }
  if (!foundry.utils.isEmpty(updateData)) {
    await actor.update(updateData);
  }
});


/* -------------------------------------------- */
/*  Chat Commands                               */
/* -------------------------------------------- */

Hooks.on('chatMessage', async (_chatlog, content, _chatData) => {
  const regex = /^\/([a-z]+)(?: (.+))?$/i;
  if (content.match(regex)) {
    const [, command, args] = regex.exec(content);

    if (command === 'table' || command === 't') {
      let table = game.tables.get(args);
      if (!table) table = game.tables.getName(args);
      if (table) {
        await table.draw();
        return false;
      }
    }
    return true;
  }
});

// async function fixNumbers() {
//   const items = [];
//   game.items.contents.forEach(i => items.push(i));
//   game.actors.contents.forEach(a => items.push(...a.items));
//   console.warn(items);
//   for (const item of items) {
//     const updateData = {};
//     const sys = item.system;
//     if (sys.availability != undefined) {
//       updateData['system.availability'] = +sys.availability;
//     }
//     if (sys.blast != undefined) {
//       updateData['system.blast'] = +sys.blast;
//     }
//     if (item.isOffensive) {
//       for (const atk of item.attacks) {
//         updateData[`system.attacks.${atk.id}.damageType`] = +sys.attacks[atk.id].damageType;
//         updateData[`system.attacks.${atk.id}.crit`] = +sys.attacks[atk.id].crit;
//         updateData[`system.attacks.${atk.id}.range.min`] = +sys.attacks[atk.id].range.min;
//         updateData[`system.attacks.${atk.id}.range.max`] = +sys.attacks[atk.id].range.max;
//       }
//     }
//     if (!foundry.utils.isEmpty(updateData)) {
//       console.warn('Updating item', item.name, 'with data', updateData);
//       await item.update(updateData);
//     }
//   }
// }
