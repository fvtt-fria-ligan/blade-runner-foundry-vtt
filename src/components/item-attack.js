/* eslint-disable no-shadow */
/**
 * A class representing an item's attack mode.
 */
export default class Attack {
  /**
   * @param {Object}    options
   * @param {Item}      options.item
   * @param {string}    options.name
   * @param {number}    options.damage
   * @param {6|8|10|12} options.crit
   * @param {{ min: number, max: number}} range
   * @param {import('@system/constants').DAMAGE_TYPES} options.damageType
   */
  constructor({ name, item, damage, damageType, crit, range }) {
    /**
     * Identifier for this attack.
     * @type {string}
     * @constant
     */
    this.id = foundry.utils.randomID(8);

    this.name = name;
    this.item = item;
    this.damage = damage ?? 1;
    this.damageType = damageType ?? 2;
    this.crit = crit || 6;
    this.range = {
      min: range?.min ?? 0,
      max: range?.max ?? 1,
    };
  }

  get actor() {
    return this.item?.actor;
  }

  toObject() {
    return {
      // id: this.id,
      name: this.name,
      // item: this.item.uuid,
      damage: this.damage,
      damageType: this.damageType,
      crit: this.crit,
      range: this.range,
    };
  }
}
