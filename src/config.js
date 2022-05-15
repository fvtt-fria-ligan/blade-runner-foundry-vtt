import * as BR from './constants.js';

/**
 * @constant
 */
export const FLBR = {};

FLBR.ASCII = '';

// FLBR.dieSizes = [0, 12, 10, 8, 6];
// FLBR.dieScores = ['—', 'A', 'B', 'C', 'D'];
// FLBR.scoreMap = new Map(FLBR.dieScores.map((x, i) => [x, FLBR.dieSizes[i]]));
FLBR.scoreMap = new Map();
FLBR.scoreMap.set('—', 0);
for (const score in BR.DIE_SCORES) {
  FLBR.scoreMap.set(score, BR.DIE_SCORES[score]);
}
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
  [BR.SKILLS.DRIVING]: null,
};

FLBR.startingSkillLevel = 6;

FLBR.nature = {
  [BR.NATURES.HUMAN]: 'FLBR.Nature.Human',
  [BR.NATURES.REPLICANT]: 'FLBR.Nature.Replicant',
};

FLBR.archetype = {
  [BR.ARCHETYPES.ANALYST]: {
    label: 'FLBR.Archetype.Analyst',
    allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
  },
  [BR.ARCHETYPES.CITY_SPEAKER]: {
    label: 'FLBR.Archetype.CitySpeaker',
    allowedNatures: [BR.NATURES.HUMAN],
  },
  [BR.ARCHETYPES.ENFORCER]: {
    label: 'FLBR.Archetype.Enforcer',
    allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
  },
  [BR.ARCHETYPES.DOXIE]: {
    label: 'FLBR.Archetype.Doxie',
    allowedNatures: [BR.NATURES.REPLICANT],
  },
  [BR.ARCHETYPES.FIXER]: {
    label: 'FLBR.Archetype.Fixed',
    allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
  },
  [BR.ARCHETYPES.INSPECTOR]: {
    label: 'FLBR.Archetype.Inspector',
    allowedNatures: [BR.NATURES.HUMAN, BR.NATURES.REPLICANT],
  },
  [BR.ARCHETYPES.SKIMMER]: {
    label: 'FLBR.Archetype.Skimmer',
    allowedNatures: [BR.NATURES.HUMAN],
  },
};

FLBR.yearsOnTheForce = {
  [BR.YEARS_ON_THE_FORCE.ROOKIE]: {
    years: [0, 1],
    modifiers: {
      attributes: 4,
      skills: 8,
      specialties: 0,
      promos: 'D3',
      chinyen: -1,
    },
  },
  [BR.YEARS_ON_THE_FORCE.SEASONED]: {
    years: [2, 7],
    modifiers: {
      attributes: 3,
      skills: 10,
      specialties: 1,
      promos: 'D6',
      chinyen: 0,
    },
  },
  [BR.YEARS_ON_THE_FORCE.VETERAN]: {
    years: [8, 15],
    modifiers: {
      attributes: 2,
      skills: 12,
      specialties: 2,
      promos: 'D8',
      chinyen: 1,
    },
  },
  [BR.YEARS_ON_THE_FORCE.OLD_TIMER]: {
    years: [16, 99],
    modifiers: {
      attributes: 1,
      skills: 14,
      specialties: 3,
      promos: 'D10',
      chinyen: 2,
    },
  },
};
