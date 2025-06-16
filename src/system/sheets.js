/* eslint-disable max-len */
import BladeRunnerCharacterSheet from '@actor/character/character-sheet.js';
import BladeRunnerLootSheet from '@actor/loot/loot-sheet.js';
import BladeRunnerVehicleSheet from '@actor/vehicle/vehicle-sheet.js';
import BladeRunnerItemSheet from '@item/item-sheet.js';
import { ACTOR_TYPES, SYSTEM_ID, ITEM_TYPES } from './constants.js';

export function registerSheets() {
  const br = game.system.id || SYSTEM_ID;

  foundry.documents.collections.Actors.unregisterSheet('core', foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(br, BladeRunnerCharacterSheet, { types: [ACTOR_TYPES.CHAR], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet(br, BladeRunnerVehicleSheet, { types: [ACTOR_TYPES.VEHICLE], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet(br, BladeRunnerLootSheet, { types: [ACTOR_TYPES.LOOT], makeDefault: true });

  foundry.documents.collections.Items.unregisterSheet('core', foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.GENERIC], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.SYNTHETIC_AUGMENTATION], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.ARMOR], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.WEAPON], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.EXPLOSIVE], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.SPECIALTY], makeDefault: true });
  foundry.documents.collections.Items.registerSheet(br, BladeRunnerItemSheet, { types: [ITEM_TYPES.CRITICAL_INJURY], makeDefault: true });
}
