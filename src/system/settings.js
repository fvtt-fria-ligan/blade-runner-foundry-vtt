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
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.PIERCING_TABLE, {
    name: 'SETTINGS.BLADE_RUNNER.PiercingTableName',
    hint: 'SETTINGS.BLADE_RUNNER.PiercingTableHint',
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.CRASH_TABLE, {
    name: 'SETTINGS.BLADE_RUNNER.CrashTableName',
    hint: 'SETTINGS.BLADE_RUNNER.CrashTableHint',
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
  game.settings.register(sysId, SETTINGS_KEYS.EDIT_NATURE_PERMISSION, {
    name: 'SETTINGS.BLADE_RUNNER.EditNaturePermissionName',
    hint: 'SETTINGS.BLADE_RUNNER.EditNaturePermissionHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.AUTO_APPLY_DAMAGE, {
    name: 'SETTINGS.BLADE_RUNNER.AutomaticApplyDamageName',
    hint: 'SETTINGS.BLADE_RUNNER.AutomaticApplyDamageHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.AUTO_ARMOR_ROLL, {
    name: 'SETTINGS.BLADE_RUNNER.AutomaticArmorRollName',
    hint: 'SETTINGS.BLADE_RUNNER.AutomaticArmorRollHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.OPEN_FIRST_WEAPON_ATTACK, {
    name: 'SETTINGS.BLADE_RUNNER.OpenFirstWeaponAttackName',
    hint: 'SETTINGS.BLADE_RUNNER.OpenFirstWeaponAttackHint',
    scope: 'client',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_CREW, {
    name: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnCrewName',
    hint: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnCrewHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(sysId, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_UNCREW, {
    name: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnUncrewName',
    hint: 'SETTINGS.BLADE_RUNNER.UpdateActorManeuverabilityOnUncrewHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.USE_ACTIVE_EFFECTS, {
    name: 'SETTINGS.BLADE_RUNNER.UseActiveEffectsName',
    hint: 'SETTINGS.BLADE_RUNNER.UseActiveEffectsHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
  game.settings.register(sysId, SETTINGS_KEYS.DO_NOT_USE_HANDWRITTEN_FONT, {
    name: 'SETTINGS.BLADE_RUNNER.DoNotUseHandwrittenFontName',
    hint: 'SETTINGS.BLADE_RUNNER.DoNotUseHandwrittenFontHint',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
    onChange: s => changeEditorFont(s),
  });
}

/**
 * @param {boolean} useAlternateFont
 */
export function changeEditorFont(useAlternateFont) {
  const root = document.querySelector(':root');
  let ff = getComputedStyle(root).getPropertyValue('--font-editor');
  if (useAlternateFont) {
    ff = ff.replace('"Caveat", ', '');
  }
  else if (!ff.includes('Caveat')) {
    ff = '"Caveat", ' + ff;
  }
  else {
    return;
  }
  root.style.setProperty('--font-editor', ff);
}
