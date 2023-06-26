/**
 * These values should never be changed!
 */

/** @enum {string} */
export const SYSTEM_ID = 'blade-runner';

/** @enum {number} */
export const DIE_SCORES = {
  /** @type {12} */ A: 12,
  /** @type {10} */ B: 10,
  /** @type {8} */ C: 8,
  /** @type {6} */ D: 6,
};

/** @enum {string} */
export const ATTRIBUTES = {
  /** @type {'str'} */ STRENGTH: 'str',
  /** @type {'agi'} */ AGILITY: 'agi',
  /** @type {'int'} */ INTELLIGENCE: 'int',
  /** @type {'emp'} */ EMPATHY: 'emp',
  /** @type {'mvr'} */ VEHICLE_MANEUVERABILITY: 'mvr',
};

/** @enum {string} */
export const SKILLS = {
  /** @type {'force'} */ FORCE: 'force',
  /** @type {'closeCombat'} */ CLOSE_COMBAT: 'closeCombat',
  /** @type {'stamina'} */ STAMINA: 'stamina',
  /** @type {'firearms'} */ FIREARMS: 'firearms',
  /** @type {'mobility'} */ MOBILITY: 'mobility',
  /** @type {'stealth'} */ STEALTH: 'stealth',
  /** @type {'medicalAid'} */ MEDICAL_AID: 'medicalAid',
  /** @type {'observation'} */ OBSERVATION: 'observation',
  /** @type {'tech'} */ TECH: 'tech',
  /** @type {'driving'} */ DRIVING: 'driving',
  /** @type {'connections'} */ CONNECTIONS: 'connections',
  /** @type {'insight'} */ INSIGHT: 'insight',
  /** @type {'manipulation'} */ MANIPULATION: 'manipulation',
};

/** @enum {string} */
export const CAPACITIES = {
  /** @type {'health'} */ HEALTH: 'health',
  /** @type {'resolve'} */ RESOLVE: 'resolve',
};

/** @enum {string} */
export const NATURES = {
  /** @type {'human'} */ HUMAN: 'human',
  /** @type {'replicant'} */ REPLICANT: 'replicant',
};

/** @enum {string} */
export const ARCHETYPES = {
  /** @type {'analyst'} */ ANALYST: 'analyst',
  /** @type {'citySpeaker'} */ CITY_SPEAKER: 'citySpeaker',
  /** @type {'doxie'} */ DOXIE: 'doxie',
  /** @type {'enforcer'} */ ENFORCER: 'enforcer',
  /** @type {'fixer'} */ FIXER: 'fixer',
  /** @type {'inspector'} */ INSPECTOR: 'inspector',
  /** @type {'skimmer'} */ SKIMMER: 'skimmer',
};

/** @enum {string} */
export const RANGES = {
  /** @type {0} */ ENGAGED: 0,
  /** @type {1} */ SHORT: 1,
  /** @type {2} */ MEDIUM: 2,
  /** @type {3} */ LONG: 3,
  /** @type {4} */ EXTREME: 4,
};

/** @enum {string} */
export const COMBAT_ACTIONS = {
  /** @type {'action-sprint'} */ SPRINT: 'action-sprint',
  /** @type {'action-crawl'} */ CRAWL: 'action-crawl',
  /** @type {'action-unarmed-attack'} */ UNARMED_ATTACK: 'action-unarmed-attack',
  /** @type {'action-melee-attack'} */ MELEE_ATTACK: 'action-melee-attack',
  /** @type {'action-grapple'} */ GRAPPLE: 'action-grapple',
  /** @type {'action-break-free'} */ BREAK_FREE: 'action-break-free',
  /** @type {'action-shoot-firearm'} */ SHOOT_FIREARM: 'action-shoot-firearm',
  /** @type {'action-careful-aim'} */ CAREFUL_AIM: 'action-careful-aim',
  /** @type {'action-throw-weapon'} */ THROW_WEAPON: 'action-throw-weapon',
  /** @type {'action-first-aid'} */ FIRST_AID: 'action-first-aid',
  /** @type {'action-manipulate'} */ MANIPULATE: 'action-manipulate',
  /** @type {'action-use-item'} */ USE_ITEM: 'action-use-item',
  /** @type {'action-vehicle-crash'} */ VEHICLE_CRASH: 'action-vehicle-crash',
  /** @type {'action-vehicle-massive-crash'} */ VEHICLE_MASSIVE_CRASH: 'action-vehicle-massive-crash',
  /** @type {'action-vehicle-ramming'} */ VEHICLE_RAMMING: 'action-vehicle-ramming',
  /** @type {'action-vehicle-repair'} */ VEHICLE_REPAIR: 'action-vehicle-repair',
  /** @type {'action-vehicle-speeding'} */ VEHICLE_SPEEDING: 'action-vehicle-speeding',
  /** @type {'action-vehicle-explode'} */ VEHICLE_EXPLODE: 'action-vehicle-explode',
};

/** @enum {number} */
export const DAMAGE_TYPES = {
  /** @type {0} */ NONE: 0,
  /** @type {1} */ CRUSHING: 1,
  /** @type {2} */ PIERCING: 2,
  /** @type {3} */ STRESS: 3,
};

/** @enum {number} */
export const AVAILABILITIES = {
  /** @type {5} */ INCIDENTAL: 5,
  /** @type {4} */ STANDARD: 4,
  /** @type {3} */ PREMIUM: 3,
  /** @type {2} */ RARE: 2,
  /** @type {1} */ LUXURY: 1,
};

/** @enum {string} */
export const ACTOR_TYPES = {
  /** @type {'character'} */ CHAR: 'character',
  /** @type {'vehicle'} */ VEHICLE: 'vehicle',
  /** @type {'loot'} */ LOOT: 'loot',
};

/** @enum {string} */
export const ACTOR_SUBTYPES = {
  /** @type {'pc'} */ PC: 'pc',
  /** @type {'npc'} */ NPC: 'npc',
};

/** @enum {string} */
export const ITEM_TYPES = {
  /** @type {'generic'} */ GENERIC: 'generic',
  /** @type {'upgrade'} */ SYNTHETIC_AUGMENTATION: 'upgrade',
  /** @type {'armor'} */ ARMOR: 'armor',
  /** @type {'weapon'} */ WEAPON: 'weapon',
  /** @type {'explosive'} */ EXPLOSIVE: 'explosive',
  /** @type {'specialty'} */ SPECIALTY: 'specialty',
  /** @type {'injury'} */ CRITICAL_INJURY: 'injury',
};

/** @enum {string} */
export const SETTINGS_KEYS = {
  /** @type {'systemMigrationVersion'} */ SYSTEM_MIGRATION_VERSION: 'systemMigrationVersion',
  /** @type {'messages'} */ DISPLAYED_MESSAGES: 'messages',
  /** @type {'autoApplyDamage'} */ AUTO_APPLY_DAMAGE: 'autoApplyDamage',
  /** @type {'autoArmorRoll'} */ AUTO_ARMOR_ROLL: 'autoArmorRoll',
  /** @type {'crashTable'} */ CRASH_TABLE: 'crashTable',
  /** @type {'crushingTable'} */ CRUSHING_TABLE: 'crushingTable',
  /** @type {'editNaturePermission'} */ EDIT_NATURE_PERMISSION: 'editNaturePermission',
  /** @type {'openFirstWeaponAttack'} */ OPEN_FIRST_WEAPON_ATTACK: 'openFirstWeaponAttack',
  /** @type {'piercingTable'} */ PIERCING_TABLE: 'piercingTable',
  /** @type {'updateActorMvrOnCrew'} */ UPDATE_ACTOR_MANEUVERABILITY_ON_CREW: 'updateActorMvrOnCrew',
  /** @type {'updateActorMvrOnUncrew'} */ UPDATE_ACTOR_MANEUVERABILITY_ON_UNCREW: 'updateActorMvrOnUncrew',
  /** @type {'useActiveEffects'} */ USE_ACTIVE_EFFECTS: 'useActiveEffects',
};
