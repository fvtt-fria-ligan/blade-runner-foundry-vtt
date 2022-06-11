/**
 * These values should never be changed!
 */

/** @enum {string} */
export const SYSTEM_NAME = 'blade-runner';

/** @enum {number} */
export const DIE_SCORES = {
  A: 12,
  B: 10,
  C: 8,
  D: 6,
};

/** @enum {string} */
export const ATTRIBUTES = {
  STRENGTH: 'str',
  AGILITY: 'agi',
  INTELLIGENCE: 'int',
  EMPATHY: 'emp',
  VEHICLE_MANEUVERABILITY: 'mvr',
};

/** @enum {string} */
export const SKILLS = {
  CLOSE_COMBAT: 'closeCombat',
  FORCE: 'force',
  STAMINA: 'stamina',
  FIREARMS: 'firearms',
  MOBILITY: 'mobility',
  STEALTH: 'stealth',
  MEDICAL_AID: 'medicalAid',
  OBSERVATION: 'observation',
  TECH: 'tech',
  DRIVING: 'driving',
  CONNECTIONS: 'connections',
  INSIGHT: 'insight',
  MANIPULATION: 'manipulation',
};

/** @enum {string} */
export const CAPACITIES = {
  HEALTH: 'health',
  RESOLVE: 'resolve',
};

/** @enum {string} */
export const NATURES = {
  HUMAN: 'human',
  REPLICANT: 'replicant',
};

/** @enum {string} */
export const ARCHETYPES = {
  ANALYST: 'analyst',
  CITY_SPEAKER: 'citySpeaker',
  DOXIE: 'doxie',
  ENFORCER: 'enforcer',
  FIXER: 'fixer',
  INSPECTOR: 'inspector',
  SKIMMER: 'skimmer',
};

/** @enum {string} */
export const RANGES = {
  ENGAGED: 'engaged',
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  EXTREME: 'extreme',
};

/** @enum {string} */
export const COMBAT_ACTIONS = {
  SPRINT: 'action-sprint',
  CRAWL: 'action-crawl',
  UNARMED_ATTACK: 'action-unarmed-attack',
  MELEE_ATTACK: 'action-melee-attack',
  GRAPPLE: 'action-grapple',
  BREAK_FREE: 'action-break-free',
  SHOOT_FIREARM: 'action-shoot-firearm',
  CAREFUL_AIM: 'action-careful-aim',
  THROW_WEAPON: 'action-throw-weapon',
  FIRST_AID: 'action-first-aid',
  MANIPULATE: 'action-manipulate',
  USE_ITEM: 'action-use-item',
};

/** @enum {number} */
export const DAMAGE_TYPES = {
  CRUSHING: 0,
  PIERCING: 1,
};

/** @enum {number} */
export const AVAILABILITIES = {
  INCIDENTAL: 5,
  STANDARD: 4,
  PREMIUM: 3,
  RARE: 2,
  LUXURY: 1,
};

/** @enum {string} */
export const ACTOR_TYPES = {
  CHAR: 'character',
  VEHICLE: 'vehicle',
};

/** @enum {string} */
export const ACTOR_SUBTYPES = {
  PC: 'pc',
  NPC: 'npc',
};

/** @enum {string} */
export const ITEM_TYPES = {
  GENERIC: 'generic',
  SYNTHETIC_AUGMENTATION: 'upgrade',
  ARMOR: 'armor',
  WEAPON: 'weapon',
  EXPLOSIVE: 'explosive',
  SPECIALTY: 'specialty',
  CRITICAL_INJURY: 'injury',
};
