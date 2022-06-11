import * as BR from './constants.js';
import { capitalize } from '@utils/string-util.js';

/** @typedef {string} KeyString */
/** @typedef {string} DieScoreString */
/** @typedef {number} DieSizeNumber */
/** @typedef {string} TranslationString */

/**
 * The Blade Runner RPG configuration.
 * @constant
 * @enum
 */
export const FLBR = {};

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

FLBR.actionSkillMap = {
  [BR.COMBAT_ACTIONS.SPRINT]: {
    label: 'FLBR.COMBAT_ACTION.Sprint',
    skill: BR.SKILLS.MOBILITY,
  },
  [BR.COMBAT_ACTIONS.CRAWL]: {
    label: 'FLBR.COMBAT_ACTION.Crawl',
    skill: null,
  },
  [BR.COMBAT_ACTIONS.UNARMED_ATTACK]: {
    label: 'FLBR.COMBAT_ACTION.UnarmedAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.MELEE_ATTACK]: {
    label: 'FLBR.COMBAT_ACTION.MeleeAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.GRAPPLE]: {
    label: 'FLBR.COMBAT_ACTION.Grapple',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.BREAK_FREE]: {
    label: 'FLBR.COMBAT_ACTION.BreakFree',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.SHOOT_FIREARM]: {
    label: 'FLBR.COMBAT_ACTION.ShootFirearm',
    skill: BR.SKILLS.FIREARMS,
  },
  [BR.COMBAT_ACTIONS.CAREFUL_AIM]: {
    label: 'FLBR.COMBAT_ACTION.CarefulAim',
    skill: null,
  },
  [BR.COMBAT_ACTIONS.THROW_WEAPON]: {
    label: 'FLBR.COMBAT_ACTION.ThrowWeapon',
    skill: BR.SKILLS.FIREARMS,
  },
  [BR.COMBAT_ACTIONS.FIRST_AID]: {
    label: 'FLBR.COMBAT_ACTION.FirstAid',
    skill: BR.SKILLS.MEDICAL_AID,
  },
  [BR.COMBAT_ACTIONS.MANIPULATE]: {
    label: 'FLBR.COMBAT_ACTION.Manipulate',
    skill: BR.SKILLS.MANIPULATION,
  },
  [BR.COMBAT_ACTIONS.USE_ITEM]: {
    label: 'FLBR.COMBAT_ACTION.UseItem',
    skill: 'any',
  },
};

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
  [BR.DAMAGE_TYPES.CRUSHING]: 'FLBR.WEAPON_DAMAGE_TYPE.Crushing',
  [BR.DAMAGE_TYPES.PIERCING]: 'FLBR.WEAPON_DAMAGE_TYPE.Piercing',
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

FLBR.maxRolledDice = 3;
FLBR.itemSpecialInputMaxLength = 80;

/* ------------------------------------------ */

/** @type {Object.<string, TranslationString>} */
FLBR.rollModes = {};
for (const [k, v] of Object.entries(CONST.DICE_ROLL_MODES)) {
  FLBR.rollModes[v] = `CHAT.Roll${capitalize(k.toLowerCase())}`;
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
  },
  buttons: {
    action: '<i class="fas fa-play"></i>',
    edit: '<i class="fas fa-edit"></i>',
    delete: '<i class="fas fa-trash"></i>',
    remove: '<i class="fas fa-times"></i>',
    plus: '<i class="fas fa-plus"></i>',
    minus: '<i class="fas fa-minus"></i>',
    equip: '<i class="fas fa-star"></i>',
    unequip: '<i class="far fa-star"></i>',
    // stash: '<i class="fas fa-shopping-bag"></i>',
    // unmount: '<i class="fas fa-thumbtack"></i>',
    // mount: '<i class="fas fa-wrench"></i>',
    attack: '<i class="fas fa-crosshairs"></i>',
    armor: '<i class="fas fa-shield-alt"></i>',
    boom: '<i class="fas fa-bomb"></i>',
    // reload: '<i class="fas fa-sync-alt"></i>',
    lethal: '<i class="fas fa-skull"></i>',
    // mental: '<i class="fas fa-brain"></i>',
    vehicle: '<i class="fas fa-car"></i>',
    chat: '<i class="far fa-comment-dots"></i>',
    roll: '<i class="fas fa-dice-d20"></i>',
  },
};
