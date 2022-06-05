import { FLBR } from '@system/config.js';
import Modifier from '@system/modifier.js';

export default class BladeRunnerItem extends Item {

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  get props() {
    return this.data.data;
  }

  get qty() {
    return this.props.qty;
  }

  get isPhysical() {
    return FLBR.physicalItems.includes(this.type);
  }

  get isOffensive() {
    return this.props.damage != null;
  }

  get hasModifier() {
    if (!this.props.modifiers) return false;
    return !foundry.utils.isObjectEmpty(this.props.modifiers);
  }

  get rollable() {
    return !!(this.props.rollable ?? false);
  }

  /** 
   * The name with a quantity in parentheses.
   * @type {string}
   */
  get detailedName() {
    let str = this.name;
    if (this.qty > 1) {
      str += ` (${this.qty})`;
    }
    return str;
  }

  /* ------------------------------------------- */

  /**
   * Gets an array of modifiers in this item.
   * @param {Object}         [options]           Additional options to filter the returned array of modifiers
   * @param {string|string[]} options.targets    Filters modifiers based on plausible targets
   * @param {boolean}         options.onlyActive Filters modifiers based on their active status
   * @returns {Modifier[]}
   */
  getModifiers(options = {}) {
    return Modifier.getModifiers(this, 'data.data.modifiers', options);
  }

  /* ------------------------------------------- */
  /*  Event Handlers                             */
  /* ------------------------------------------- */

  // TODO later
  /** @override *
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);

    // When creating an item in a character.
    if (this.actor && this.actor.type === 'character') {
      // When creating an injury in a character.
      if (this.type === 'injury') {
        // If there is a heal time set.
        let healTime = this.data.data.healTime;
        if (healTime) {
          try {
            const roll = Roll.create(healTime);
            await roll.evaluate({ async: true });
            healTime = roll.terms.reduce((sum, t) => sum + t.values.reduce((tot, v) => tot + v, 0), 0);
            healTime = `${healTime} ${game.i18n.localize(`T2K4E.InjurySheet.day${healTime > 1 ? 's' : ''}`)}`;
            this.update({ 'data.healTime': healTime });
          }
          catch (e) {
            console.warn('t2k4 | Item#_onCreate | Invalid formula for Injury heal time roll.');
          }
        }
      }
    }
  }//*/

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  roll() {
    if (!this.rollable) return;
    if (!this.actor) return;
    this.actor.rollStat(this.props.attribute, this.props.skill);
  }
}
