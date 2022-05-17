import { FLBR } from './config.js';

/**
 * Gets the score of a die from its size.
 * @param {number} size The number of faces on the Blade Runner die.
 * @returns {string} The corresponding score.
 */
export function getScore(size) {
  if (typeof size !== 'number') throw new TypeError(`FLBR | Die size Not a Number: "${size}"`);
  const score = FLBR.dieMap.get(size);
  if (score == undefined) throw new TypeError(`FLBR | Die size Incorrect: "${size}"`);
  return score;
}

/* ------------------------------------------ */

/**
 * Gets a DiceQuantities object from given values.
 * @param {number}   attribute     The attribute's size
 * @param {number}  [skill=0]      The skill's size
 * @param {number}  [rof=0]        The RoF's value
 * @param {number}  [modifier=0]   The task modifier
 * @param {boolean} [locate=false] Whether to roll a Location die
 * @see {YearZeroRoll}
 * @returns {import('@lib/yzur.js').DiceQuantities}
 */
export function getDiceQuantities(attribute, skill = 0, rof = 0, locate = false) {
  const DIE_SIZES = [0, 0, 0, 0, 0, 0, 'd', 'd', 'c', 'c', 'b', 'b', 'a'];
  const attributeScore = DIE_SIZES[attribute];
  const skillScore = DIE_SIZES[skill];
  const dice = {};
  if (attributeScore === skillScore && attribute >= 6) {
    dice[`${attributeScore}`] = 2;
  }
  else {
    if (attribute >= 6) dice[`${attributeScore}`] = 1;
    if (skill >= 6) dice[`${skillScore}`] = 1;
  }
  if (rof) dice.ammo = rof;
  if (locate) dice.loc = 1;
  return dice;
}
