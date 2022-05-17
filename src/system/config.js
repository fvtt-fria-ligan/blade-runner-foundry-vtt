import * as BR from './constants.js';

/**
 * The Blade Runner RPG configuration.
 * @constant
 * @enum
 */
export const FLBR = {};

/** @type {Map.<string, number>} */
FLBR.scoreMap = new Map();
FLBR.scoreMap.set('—', 0);
for (const score in BR.DIE_SCORES) {
  FLBR.scoreMap.set(score, BR.DIE_SCORES[score]);
}
/** @type {Map.<number, string>} */
FLBR.dieMap = new Map(Array.from(FLBR.scoreMap, ([n, v]) => [v, n]));

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

FLBR.startingAttributeLevel = 8;
FLBR.startingSkillLevel = 6;

// TODO
FLBR.archetypes = Object.values(BR.ARCHETYPES);
// FLBR.archetypes = {
//   [BR.ARCHETYPES.ANALYST]: {
//     label: 'FLBR.Archetype.Analyst',
//     allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
//   },
//   [BR.ARCHETYPES.CITY_SPEAKER]: {
//     label: 'FLBR.Archetype.CitySpeaker',
//     allowedNatures: [BR.NATURES.HUMAN],
//   },
//   [BR.ARCHETYPES.ENFORCER]: {
//     label: 'FLBR.Archetype.Enforcer',
//     allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
//   },
//   [BR.ARCHETYPES.DOXIE]: {
//     label: 'FLBR.Archetype.Doxie',
//     allowedNatures: [BR.NATURES.REPLICANT],
//   },
//   [BR.ARCHETYPES.FIXER]: {
//     label: 'FLBR.Archetype.Fixed',
//     allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
//   },
//   [BR.ARCHETYPES.INSPECTOR]: {
//     label: 'FLBR.Archetype.Inspector',
//     allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
//   },
//   [BR.ARCHETYPES.SKIMMER]: {
//     label: 'FLBR.Archetype.Skimmer',
//     allowedNatures: [BR.NATURES.HUMAN],
//   },
// };

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

FLBR.maxPromotionPoints = 20;
FLBR.maxHumanityPoints = 20;
FLBR.maxChinyenPoints = 20;

FLBR.natures = {
  [BR.NATURES.HUMAN]: 'FLBR.Nature.Human',
  [BR.NATURES.REPLICANT]: 'FLBR.Nature.Replicant',
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

FLBR.physicalItems = [BR.ITEM_TYPES.GENERIC, BR.ITEM_TYPES.WEAPON, BR.ITEM_TYPES.ARMOR, BR.ITEM_TYPES.EXPLOSIVE];

FLBR.ranges = [BR.RANGES.ENGAGED, BR.RANGES.SHORT, BR.RANGES.MEDIUM, BR.RANGES.LONG, BR.RANGES.EXTREME];

FLBR.actionSkillMap = {
  [BR.COMBAT_ACTIONS.SPRINT]: {
    label: 'FLBR.CombatAction.Sprint',
    skill: BR.SKILLS.MOBILITY,
  },
  [BR.COMBAT_ACTIONS.CRAWL]: {
    label: 'FLBR.CombatAction.Crawl',
    skill: null,
  },
  [BR.COMBAT_ACTIONS.UNARMED_ATTACK]: {
    label: 'FLBR.CombatAction.UnarmedAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.MELEE_ATTACK]: {
    label: 'FLBR.CombatAction.MeleeAttack',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.GRAPPLE]: {
    label: 'FLBR.CombatAction.Grapple',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.BREAK_FREE]: {
    label: 'FLBR.CombatAction.BreakFree',
    skill: BR.SKILLS.CLOSE_COMBAT,
  },
  [BR.COMBAT_ACTIONS.SHOOT_FIREARM]: {
    label: 'FLBR.CombatAction.ShootFirearm',
    skill: BR.SKILLS.FIREARMS,
  },
  [BR.COMBAT_ACTIONS.CAREFUL_AIM]: {
    label: 'FLBR.CombatAction.CarefulAim',
    skill: null,
  },
  [BR.COMBAT_ACTIONS.THROW_WEAPON]: {
    label: 'FLBR.CombatAction.ThrowWeapon',
    skill: BR.SKILLS.FIREARMS,
  },
  [BR.COMBAT_ACTIONS.FIRST_AID]: {
    label: 'FLBR.CombatAction.FirstAid',
    skill: BR.SKILLS.MEDICAL_AID,
  },
  [BR.COMBAT_ACTIONS.MANIPULATE]: {
    label: 'FLBR.CombatAction.Manipulate',
    skill: BR.SKILLS.MANIPULATION,
  },
  [BR.COMBAT_ACTIONS.USE_ITEM]: {
    label: 'FLBR.CombatAction.UseItem',
    skill: 'any',
  },
};

FLBR.deathSaveTest = BR.SKILLS.STAMINA;
FLBR.baselineTest = BR.SKILLS.INSIGHT;

FLBR.blastPowerMap = {
  12: { damage: 4, crit: 12 },
  10: { damage: 3, crit: 10 },
  8: { damage: 2, crit: 8 },
  6: { damage: 1, crit: 6 },
};

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
  boxes: {
    empty: '<i class="far fa-square"></i>',
    full: '<i class="fas fa-square"></i>',
  },
  buttons: {
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
    // reload: '<i class="fas fa-sync-alt"></i>',
    lethal: '<i class="fas fa-skull"></i>',
    // mental: '<i class="fas fa-brain"></i>',
  },
};
