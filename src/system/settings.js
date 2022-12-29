// ? scope: world (gm), client (player)
// ? config: true (visible)

import { SETTINGS_KEYS, SYSTEM_ID } from './constants.js';

export function registerSystemSettings() {
  const sysId = game.system.id || SYSTEM_ID;

  game.settings.register(sysId, SETTINGS_KEYS.SYSTEM_MIGRATION_VERSION, {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.DISPLAYED_MESSAGES, {
    name: 'Displayed Messages',
    hint: 'Used to track which messages have been displayed',
    scope: 'world',
    config: false,
    type: Array,
    default: [],
  });
  game.settings.register(sysId, SETTINGS_KEYS.CRUSHING_TABLE, {
    name: 'SETTINGS.BLADE_RUNNER.CrushingTableName',
    hint: 'SETTINGS.BLADE_RUNNER.CrushingTableHint',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.PIERCING_TABLE, {
    name: 'SETTINGS.BLADE_RUNNER.PiercingTableName',
    hint: 'SETTINGS.BLADE_RUNNER.PiercingTableHint',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.EDIT_NATURE_PERMISSION, {
    name: 'SETTINGS.BLADE_RUNNER.EditNaturePermissionName',
    hint: 'SETTINGS.BLADE_RUNNER.EditNaturePermissionHint',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.AUTO_APPLY_DAMAGE, {
    name: 'SETTINGS.BLADE_RUNNER.AutomaticApplyDamageName',
    hint: 'SETTINGS.BLADE_RUNNER.AutomaticApplyDamageHint',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.AUTO_ARMOR_ROLL, {
    name: 'SETTINGS.BLADE_RUNNER.AutomaticArmorRollName',
    hint: 'SETTINGS.BLADE_RUNNER.AutomaticArmorRollHint',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.OPEN_FIRST_WEAPON_ATTACK, {
    name: 'SETTINGS.BLADE_RUNNER.OpenFirstWeaponAttackName',
    hint: 'SETTINGS.BLADE_RUNNER.OpenFirstWeaponAttackHint',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_CREW, {
    name: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnCrewName',
    hint: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnCrewHint',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_UNCREW, {
    name: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnUncrewName',
    hint: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnUncrewHint',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.USE_ACTIVE_EFFECTS, {
    name: 'SETTINGS.BLADE_RUNNER.UseActiveEffectsName',
    hint: 'SETTINGS.BLADE_RUNNER.UseActiveEffectsHint',
    config: true,
    type: Boolean,
    default: false,
  });
}
