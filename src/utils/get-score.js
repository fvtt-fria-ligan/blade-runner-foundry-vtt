import { FLBR } from '../system/config.js';

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

/**
 * Adds a "score" property to each sub-key of an object that has a "value" property.
 * @param {Object.<string, { value: number }>} data
 * @returns {Object.<string, { value: number, score: string }>} the same object, with added scores
 */
export function generateScores(data) {
  for (const key in data) {
    if ('value' in data[key]) {
      data[key].score = getScore(data[key].value);
    }
  }
  return data;
}

const /* string[] */ bob /* :string[] */ = [];
