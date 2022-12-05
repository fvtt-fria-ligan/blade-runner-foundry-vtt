import BladeRunnerCharacterSheet from '@actor/character/character-sheet.js';
import BladeRunnerLootSheet from '@actor/loot/loot-sheet.js';
import BladeRunnerVehicleSheet from '@actor/vehicle/vehicle-sheet.js';
import BladeRunnerItemSheet from '@item/item-sheet.js';
import { ACTOR_TYPES, SYSTEM_ID, ITEM_TYPES } from './constants.js';

export function registerSheets() {
  const br = game.system.id || SYSTEM_ID;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet(br, BladeRunnerCharacterSheet, { types: [ACTOR_TYPES.CHAR], makeDefault: true });
  Actors.registerSheet(br, BladeRunnerVehicleSheet, { types: [ACTOR_TYPES.VEHICLE], makeDefault: true });
  Actors.registerSheet(br, BladeRunnerLootSheet, { types: [ACTOR_TYPES.LOOT], makeDefault: true });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.GENERIC], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.SYNTHETIC_AUGMENTATION], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.ARMOR], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.WEAPON], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.EXPLOSIVE], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.SPECIALTY], makeDefault: true });
  Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.CRITICAL_INJURY], makeDefault: true });
}
