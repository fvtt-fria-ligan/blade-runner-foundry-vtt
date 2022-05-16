import BladeRunnerCharacterSheet from '@actor/character/character-sheet.js';
import { ACTOR_TYPES, BLADE_RUNNER, ITEM_TYPES } from './constants.js';

export function registerSheets() {
  const br = game.system.data.name || BLADE_RUNNER;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet(br, BladeRunnerCharacterSheet, { types: [ACTOR_TYPES.PC, ACTOR_TYPES.NPC], makeDefault: true });
  Actors.registerSheet(br, undefined, { types: [ACTOR_TYPES.VEHICLE], makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.GENERIC], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.SYNTHETIC_AUGMENTATION], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.ARMOR], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.WEAPON], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.EXPLOSIVE], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.SPECIALTY], makeDefault: true });
  Items.registerSheet(br, undefined, { types: [ITEM_TYPES.CRITICAL_INJURY], makeDefault: true });
}