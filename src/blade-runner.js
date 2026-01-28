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
import { ACTOR_TYPES, CAPACITIES, SETTINGS_KEYS, SYSTEM_ID } from '@system/constants';
import { ActionCollection } from '@components/actor-action';
import * as YZUR from 'yzur';
import * as Chat from '@system/chat';
import * as BRMacro from '@system/macros';
import BRRollHandler from '@components/roll/roller';
import { registerSheets } from '@system/sheets';
import { initializeHandlebars, registerCustomItemTypesTemplates } from '@system/handlebars';
import { changeEditorFont, registerSystemSettings } from '@system/settings';
import { enrichTextEditors } from '@system/enricher';
import { registerDiceSoNice } from './plugins/dice-so-nice';
import itemPilesConfig from './plugins/item-piles';
// ! import { overrideInlineRollListener } from '@components/roll/inline-roll';
import { getManual } from '@utils/get-manual';
import BladeRunnerActor from '@actor/actor-document';
import BladeRunnerItem from '@item/item-document';
import BladeRunnerDialog from '@components/dialog/dialog';
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
  foundry.dice.Roll.prototype.constructor.create = function (formula, data = {}, options = {}) {
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
    roll: YZUR.YearZeroRoll,
    roller: BRRollHandler,
    dialog: BladeRunnerDialog,
    macros: {
      rollAction: BRMacro.rollAction,
      rollDice: BRMacro.showRollDialog,
      rollItem: BRMacro.rollItem,
      rollStat: BRMacro.rollStat,
      displayManual: async () => (await getManual()).sheet.render(true),
    },
    actions: new ActionCollection(FLBR.Actions.map(a => [a.id, a])),
  };

  // Records configuration values.
  CONFIG.BLADE_RUNNER = FLBR;
  CONFIG.Actor.documentClass = BladeRunnerActor;
  CONFIG.Item.documentClass = BladeRunnerItem;

  // Patches Core functions.
  CONFIG.Combat.initiative = {
    formula: '1d10 + (@agi / 100)',
    decimals: 2,
  };

  registerSheets();
  registerSystemSettings();
  enrichTextEditors();
  await initializeHandlebars();

  // Adds a shortcut directory for vehicle actors.
  Object.defineProperty(game, 'vehicles', {
    enumerable: true,
    get: () => new Collection(game.actors
      .filter(a => a.isVehicle)
      .map(a => [a.id, a]),
    ),
  });
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
  // ! overrideInlineRollListener();

  registerCustomItemTypesTemplates();

  console.log('Blade Runner RPG | Ready!');
  Hooks.callAll('bladeRunnerReady', game.bladerunner, CONFIG.BLADE_RUNNER);

  // Change default font for editable text in character sheets.
  if (game.settings.get(SYSTEM_ID, SETTINGS_KEYS.DO_NOT_USE_HANDWRITTEN_FONT)) {
    changeEditorFont(true);
  }
});

/* ------------------------------------------ */
/*  Foundry VTT Hooks (Other)                 */
/* ------------------------------------------ */

Hooks.once('diceSoNiceReady', dice3d => registerDiceSoNice(dice3d));

Hooks.once('yzeCombatReady', yzec => yzec.register({ actorDrawSizeAttribute: 'system.drawSize' }));

Hooks.once('item-piles-ready', () => game.itempiles.API.addSystemIntegration(itemPilesConfig));

/* ------------------------------------------ */

Hooks.on('renderItemSheet', (app, _html) => {
  app._element[0].style.height = 'auto';
});

// Hooks.on('renderActorSheet', (app, _html) => {
//   app._element[0].style.height = 'auto';
// });

/* ------------------------------------------ */
/*  Hooks for updating the vehicles' crew     */
/* ------------------------------------------ */

Hooks.on('updateActor', (actor, updateData, _options, _userId) => {
  const hasCapacityUpdate =
    foundry.utils.hasProperty(updateData, `system.${CAPACITIES.HEALTH}`) ||
    foundry.utils.hasProperty(updateData, `system.${CAPACITIES.RESOLVE}`) ||
    foundry.utils.hasProperty(updateData, 'system.hull');

  if (hasCapacityUpdate) {
    // Notifies if the actor is broken.
    if (actor.isBroken) {
      const statusCondition = game.i18n.localize(
        `FLBR.${actor.isVehicle ? 'Wrecked' : 'Broken'}`,
      );
      ui.notifications.error(
        game.i18n.format('FLBR.SomeoneIsSomething', {
          name: `<b>${actor.name}</b>`,
          status: statusCondition.toLowerCase(),
        }),
      );

    }
    // Refreshes a vehicle sheet if a passenger is updated.
    if (actor.type === ACTOR_TYPES.CHAR) {
      const vehicles = game.vehicles.filter(v => v.sheet?._state === Application.RENDER_STATES.RENDERED);
      for (const vehicle of vehicles) {
        if (vehicle.crew.has(actor.id)) {
          vehicle.sheet.render(true);
        }
      }
    }
  }
});

Hooks.on('deleteActor', async actor => {
  // Removes any deleted actor from vehicles' crew.
  if (actor.type === ACTOR_TYPES.CHAR) {
    const vehicles = game.vehicles;
    for (const vehicle of vehicles) {
      if (vehicle.crew.has(actor.id)) {
        const crew = vehicle.system.crew.filter(p => p.id !== actor.id);
        await vehicle.update({ 'system.crew': crew });
      }
    }
  }
});

/* ------------------------------------------ */

Hooks.on('getChatMessageContextOptions', Chat.addChatMessageContextOptions);

Hooks.on('renderChatMessageHTML', (_msg, html, _data) => Chat.addChatListeners(html));
Hooks.on('renderChatMessageHTML', (_msg, html, _data) => Chat.hideChatActionButtons(html));

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
