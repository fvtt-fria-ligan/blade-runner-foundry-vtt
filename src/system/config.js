import * as BR from './constants.js';

/** @typedef {string} KeyString */
/** @typedef {string} DieScoreString */
/** @typedef {number} DieSizeNumber */
/** @typedef {string} TranslationString */

/**
 * The Blade Runner RPG configuration.
 * @constant
 * @enum {any}
 */
export const FLBR = {};

FLBR.systemMacroFolder = 'Blade Runner Macros';

/** @type {Map.<DieScoreString, DieSizeNumber>} */
FLBR.scoreMap = new Map();
FLBR.scoreMap.set('–', 0);
for (const [k, v] of Object.entries(BR.DIE_SCORES)) {
  FLBR.scoreMap.set(k, v);
}
/** @type {Map.<DieSizeNumber, DieScoreString>} */
FLBR.dieMap = new Map(Array.from(FLBR.scoreMap, ([n, v]) => [v, n]));

FLBR.vehicleSkill = BR.SKILLS.DRIVING;
FLBR.vehicleAttribute = BR.ATTRIBUTES.VEHICLE_MANEUVERABILITY;

FLBR.attributes = Object.values(BR.ATTRIBUTES).filter(a => a !== FLBR.vehicleAttribute);

FLBR.skillMap = {
  [BR.SKILLS.CLOSE_COMBAT]: BR.ATTRIBUTES.STRENGTH,
  [BR.SKILLS.FORCE]: BR.ATTRIBUTES.STRENGTH,
  [BR.SKILLS.STAMINA]: BR.ATTRIBUTES.STRENGTH,
  [BR.SKILLS.FIREARMS]: BR.ATTRIBUTES.AGILITY,
  [BR.SKILLS.MOBILITY]: BR.ATTRIBUTES.AGILITY,
  [BR.SKILLS.STEALTH]: BR.ATTRIBUTES.AGILITY,
  [BR.SKILLS.MEDICAL_AID]: BR.ATTRIBUTES.INTELLIGENCE,
  [BR.SKILLS.OBSERVATION]: BR.ATTRIBUTES.INTELLIGENCE,
  [BR.SKILLS.TECH]: BR.ATTRIBUTES.INTELLIGENCE,
  [BR.SKILLS.CONNECTIONS]: BR.ATTRIBUTES.EMPATHY,
  [BR.SKILLS.INSIGHT]: BR.ATTRIBUTES.EMPATHY,
  [BR.SKILLS.MANIPULATION]: BR.ATTRIBUTES.EMPATHY,
  [BR.SKILLS.DRIVING]: BR.ATTRIBUTES.VEHICLE_MANEUVERABILITY,
};

FLBR.skills = Object.keys(FLBR.skillMap);

/** @type {Object.<KeyString, TranslationString>} */
FLBR.archetypes = {};
for (const [k, v] of Object.entries(BR.ARCHETYPES)) {
  FLBR.archetypes[v] = `FLBR.ARCHETYPE.${k}`;
}

FLBR.capacitiesMap = {
  [BR.CAPACITIES.HEALTH]: {
    attributes: [BR.ATTRIBUTES.STRENGTH, BR.ATTRIBUTES.AGILITY],
    max: 10,
  },
  [BR.CAPACITIES.RESOLVE]: {
    attributes: [BR.ATTRIBUTES.INTELLIGENCE, BR.ATTRIBUTES.EMPATHY],
    max: 10,
  },
};

FLBR.natures = {
  [BR.NATURES.HUMAN]: 'FLBR.NATURE.Human',
  [BR.NATURES.REPLICANT]: 'FLBR.NATURE.Replicant',
};

FLBR.natureModifierMap = {
  [BR.NATURES.HUMAN]: {
    [BR.CAPACITIES.HEALTH]: 0,
    [BR.CAPACITIES.RESOLVE]: 0,
  },
  [BR.NATURES.REPLICANT]: {
    [BR.CAPACITIES.HEALTH]: 2,
    [BR.CAPACITIES.RESOLVE]: -2,
  },
};

FLBR.maxPushMap = {
  [BR.NATURES.HUMAN]: 1,
  [BR.NATURES.REPLICANT]: 2,
};

FLBR.pushTraumaMap = {
  [BR.NATURES.HUMAN]: {
    [BR.ATTRIBUTES.STRENGTH]: BR.CAPACITIES.HEALTH,
    [BR.ATTRIBUTES.AGILITY]: BR.CAPACITIES.HEALTH,
    [BR.ATTRIBUTES.INTELLIGENCE]: BR.CAPACITIES.RESOLVE,
    [BR.ATTRIBUTES.EMPATHY]: BR.CAPACITIES.RESOLVE,
  },
  [BR.NATURES.REPLICANT]: {
    [BR.ATTRIBUTES.STRENGTH]: BR.CAPACITIES.RESOLVE,
    [BR.ATTRIBUTES.AGILITY]: BR.CAPACITIES.RESOLVE,
    [BR.ATTRIBUTES.INTELLIGENCE]: BR.CAPACITIES.RESOLVE,
    [BR.ATTRIBUTES.EMPATHY]: BR.CAPACITIES.RESOLVE,
  },
};

/**
 * Action Map
 * - The action property name is added in "data-action"
 * - The callback takes the actor as an argument
 * @type {import('@components/actor-action').ActorActionData[]}
 */
FLBR.Actions = [
  {
    id: BR.COMBAT_ACTIONS.SPRINT,
    label: 'FLBR.COMBAT_ACTION.Sprint',
    hint: 'FLBR.COMBAT_ACTION_HINT.Sprint',
    skill: BR.SKILLS.MOBILITY,
    attribute: null,
    callback: null,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.CRAWL,
    label: 'FLBR.COMBAT_ACTION.Crawl',
    hint: 'FLBR.COMBAT_ACTION_HINT.Crawl',
    skill: null,
    callback: () => ui.notifications.warn('Not implemented yet.'),
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.UNARMED_ATTACK,
    label: 'FLBR.COMBAT_ACTION.UnarmedAttack',
    hint: 'FLBR.COMBAT_ACTION_HINT.UnarmedAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.MELEE_ATTACK,
    label: 'FLBR.COMBAT_ACTION.MeleeAttack',
    hint: 'FLBR.COMBAT_ACTION_HINT.MeleeAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.GRAPPLE,
    label: 'FLBR.COMBAT_ACTION.Grapple',
    hint: 'FLBR.COMBAT_ACTION_HINT.Grapple',
    skill: BR.SKILLS.CLOSE_COMBAT,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.BREAK_FREE,
    label: 'FLBR.COMBAT_ACTION.BreakFree',
    hint: 'FLBR.COMBAT_ACTION_HINT.BreakFree',
    skill: BR.SKILLS.CLOSE_COMBAT,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.SHOOT_FIREARM,
    label: 'FLBR.COMBAT_ACTION.ShootFirearm',
    hint: 'FLBR.COMBAT_ACTION_HINT.ShootFirearm',
    skill: BR.SKILLS.FIREARMS,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.CAREFUL_AIM,
    label: 'FLBR.COMBAT_ACTION.CarefulAim',
    hint: 'FLBR.COMBAT_ACTION_HINT.CarefulAim',
    callback: () => ui.notifications.warn('Not implemented yet.'),
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.THROW_WEAPON,
    label: 'FLBR.COMBAT_ACTION.ThrowWeapon',
    hint: 'FLBR.COMBAT_ACTION_HINT.ThrowWeapon',
    skill: BR.SKILLS.FIREARMS,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.FIRST_AID,
    label: 'FLBR.COMBAT_ACTION.FirstAid',
    hint: 'FLBR.COMBAT_ACTION_HINT.FirstAid',
    skill: BR.SKILLS.MEDICAL_AID,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.MANIPULATE,
    label: 'FLBR.COMBAT_ACTION.Manipulate',
    hint: 'FLBR.COMBAT_ACTION_HINT.Manipulate',
    skill: BR.SKILLS.MANIPULATION,
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.USE_ITEM,
    label: 'FLBR.COMBAT_ACTION.UseItem',
    hint: 'FLBR.COMBAT_ACTION_HINT.UseItem',
    callback: () => ui.notifications.warn('Not implemented yet.'),
    actorType: BR.ACTOR_TYPES.CHAR,
  },
  {
    id: BR.COMBAT_ACTIONS.VEHICLE_SPEEDING,
    label: 'FLBR.VEHICLE.Action.Speeding',
    hint: 'FLBR.VEHICLE.Action.SpeedingHint',
    skill: BR.SKILLS.MOBILITY,
    actorType: BR.ACTOR_TYPES.VEHICLE,
  },
  {
    id: BR.COMBAT_ACTIONS.VEHICLE_RAMMING,
    label: 'FLBR.VEHICLE.Action.Ramming',
    hint: 'FLBR.VEHICLE.Action.RammingHint',
    actorType: BR.ACTOR_TYPES.VEHICLE,
  },
  {
    id: BR.COMBAT_ACTIONS.VEHICLE_REPAIR,
    label: 'FLBR.VEHICLE.Action.Repair',
    hint: 'FLBR.VEHICLE.Action.RepairHint',
    skill: BR.SKILLS.TECH,
    actorType: BR.ACTOR_TYPES.VEHICLE,
  },
  {
    id: BR.COMBAT_ACTIONS.VEHICLE_CRASH,
    label: 'FLBR.VEHICLE.Action.Crash',
    hint: 'FLBR.VEHICLE.Action.CrashHint',
    actorType: BR.ACTOR_TYPES.VEHICLE,
  },
];

FLBR.characterSubtypes = {
  [BR.ACTOR_SUBTYPES.PC]: 'ACTOR.SubtypePc',
  [BR.ACTOR_SUBTYPES.NPC]: 'ACTOR.SubtypeNpc',
};

FLBR.physicalItems = [BR.ITEM_TYPES.GENERIC, BR.ITEM_TYPES.WEAPON, BR.ITEM_TYPES.ARMOR, BR.ITEM_TYPES.EXPLOSIVE];

FLBR.ranges = {
  [BR.RANGES.ENGAGED]: 'FLBR.WEAPON_RANGE.Engaged',
  [BR.RANGES.SHORT]: 'FLBR.WEAPON_RANGE.Short',
  [BR.RANGES.MEDIUM]: 'FLBR.WEAPON_RANGE.Medium',
  [BR.RANGES.LONG]: 'FLBR.WEAPON_RANGE.Long',
  [BR.RANGES.EXTREME]: 'FLBR.WEAPON_RANGE.Extreme',
};

FLBR.availabilities = {
  [BR.AVAILABILITIES.INCIDENTAL]: 'FLBR.ITEM_AVAILABILITY.Incidental',
  [BR.AVAILABILITIES.STANDARD]: 'FLBR.ITEM_AVAILABILITY.Standard',
  [BR.AVAILABILITIES.PREMIUM]: 'FLBR.ITEM_AVAILABILITY.Premium',
  [BR.AVAILABILITIES.RARE]: 'FLBR.ITEM_AVAILABILITY.Rare',
  [BR.AVAILABILITIES.LUXURY]: 'FLBR.ITEM_AVAILABILITY.Luxury',
};

FLBR.damageTypes = {
  [BR.DAMAGE_TYPES.NONE]: 'FLBR.WEAPON_DAMAGE_TYPE.None',
  [BR.DAMAGE_TYPES.CRUSHING]: 'FLBR.WEAPON_DAMAGE_TYPE.Crushing',
  [BR.DAMAGE_TYPES.PIERCING]: 'FLBR.WEAPON_DAMAGE_TYPE.Piercing',
  [BR.DAMAGE_TYPES.STRESS]: 'FLBR.WEAPON_DAMAGE_TYPE.Stress',
};

FLBR.blastPowerMap = {
  12: { damage: 4, crit: 12 },
  10: { damage: 3, crit: 10 },
  8: { damage: 2, crit: 8 },
  6: { damage: 1, crit: 6 },
};

FLBR.startingAttributeLevel = 8;
FLBR.startingSkillLevel = 6;

FLBR.deathSaveTest = BR.SKILLS.STAMINA;
FLBR.baselineTest = BR.SKILLS.INSIGHT;

FLBR.maxPromotionPoints = 20;
FLBR.maxHumanityPoints = 20;
FLBR.maxChinyenPoints = 20;
FLBR.maxVehicleHull = 10;

FLBR.maxRolledDice = 3;
FLBR.itemSpecialInputMaxLength = 80;

/* ------------------------------------------ */

/** @type {Object.<string, TranslationString>} */
FLBR.rollModes = {};
for (const [k, v] of Object.entries(CONST.DICE_ROLL_MODES)) {
  FLBR.rollModes[v] = `CHAT.Roll${k.toLowerCase().capitalize()}`;
}

// TODO
// FLBR.yearsOnTheForce = {
//   [BR.YEARS_ON_THE_FORCE.ROOKIE]: {
//     years: [0, 1],
//     modifiers: {
//       attributes: 4,
//       skills: 8,
//       specialties: 0,
//       promos: 'D3',
//       chinyen: -1,
//     },
//   },
//   [BR.YEARS_ON_THE_FORCE.SEASONED]: {
//     years: [2, 7],
//     modifiers: {
//       attributes: 3,
//       skills: 10,
//       specialties: 1,
//       promos: 'D6',
//       chinyen: 0,
//     },
//   },
//   [BR.YEARS_ON_THE_FORCE.VETERAN]: {
//     years: [8, 15],
//     modifiers: {
//       attributes: 2,
//       skills: 12,
//       specialties: 2,
//       promos: 'D8',
//       chinyen: 1,
//     },
//   },
//   [BR.YEARS_ON_THE_FORCE.OLD_TIMER]: {
//     years: [16, 99],
//     modifiers: {
//       attributes: 1,
//       skills: 14,
//       specialties: 3,
//       promos: 'D10',
//       chinyen: 2,
//     },
//   },
// };

/* ------------------------------------------ */
/*  Icons                                     */
/* ------------------------------------------ */

FLBR.Icons = {
  tabs: {
    action: '<i class="fas fa-dice-six"></i>',
    bio: '<i class="fas fa-align-left"></i>',
    combat: '<i class="fas fa-fist-raised"></i>',
    features: '<i class="fas fa-briefcase"></i>',
    inventory: '<i class="fas fa-archive"></i>',
    mods: '<i class="fas fa-puzzle-piece"></i>',
    roll: '<i class="fas fa-dice-six"></i>',
    stats: '<i class="fas fa-horse-head"></i>',
  },
  boxes: {
    empty: '<i class="far fa-square"></i>',
    full: '<i class="fas fa-square"></i>',
    lost: '<i class="far fa-minus-square"></i>',
  },
  dice: {
    success: '<i class="fas fa-eye"></i>',
    failure: '<i class="fas fa-horse-head"></i>',
  },
  links: {
    choice: '<i class="fa-solid fa-list-ol"></i>',
    rolltable: '<i class="fas fa-dice-d20"></i>',
    drawtable: '<i class="fa-solid fa-pen"></i>',
  },
  buttons: {
    action: '<i class="fas fa-play"></i>',
    edit: '<i class="fas fa-edit"></i>',
    delete: '<i class="fas fa-trash"></i>',
    remove: '<i class="fas fa-times"></i>',
    plus: '<i class="fas fa-plus"></i>',
    minus: '<i class="fas fa-minus"></i>',
    advantage: '<i class="fas fa-plus-circle"></i>',
    disadvantage: '<i class="fas fa-minus-circle"></i>',
    // equip: '<i class="fas fa-star"></i>',
    // unequip: '<i class="far fa-star"></i>',
    // stash: '<i class="fas fa-shopping-bag"></i>',
    mount: '<i class="fas fa-wrench"></i>',
    unmount: '<i class="fas fa-thumbtack"></i>',
    attack: '<i class="fas fa-crosshairs"></i>',
    armor: '<i class="fas fa-shield-alt"></i>',
    bomb: '<i class="fas fa-bomb"></i>',
    melee: '<i class="fa-regular fa-sword"></i>',
    gun: '<i class="fa-regular fa-gun"></i>',
    crit: '<i class="fa-regular fa-droplet"></i>',
    crush: '<i class="fa-regular fa-bullseye"></i>',
    pierce: '<i class="fa-regular fa-burst"></i>',
    stress: '<i class="fa-regular fa-wave-pulse"></i>',
    range: '<i class="fa-regular fa-crosshairs-simple"></i>',
    // damage: '<i class="fa-solid fa-burst"></i>',
    // reload: '<i class="fas fa-sync-alt"></i>',
    lethal: '<i class="fas fa-skull"></i>',
    // mental: '<i class="fas fa-brain"></i>',
    vehicle: '<i class="fas fa-car"></i>',
    wheel: '<i class="fa-regular fa-steering-wheel"></i>',
    seat: '<i class="fa-regular fa-person-seat-reclined"></i>',
    chat: '<i class="far fa-comment-dots"></i>',
    roll: '<i class="fas fa-dice-d20"></i>',
  },
};
