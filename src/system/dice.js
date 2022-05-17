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
