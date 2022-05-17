/**
 * A Form Application that mimics Dialog,
 * but provides more functionality in terms of data binds and handling of a roll object.
 * Supports Forbidden Lands standard rolls and spell rolls.
 * @see Dialog
 * @extends {FormApplication}
 */
export default class BRRollHandler extends FormApplication {
  /**
   * 
   * @param {string}          [title]    The title of the roll
   * @param {Actor}           [actor]    The actor who rolled the dice, if any
   * @param {Item[]|Item}     [items]    The item(s) used to roll the dice, if any
   * @param {number[]|number} [dice=[6]] The pool of values to roll
   * @param {number}          [modifier]
   * @param {Object} [options] Additional options for the FormApplication instance
   */
  constructor({
    title = 'Blade Runner RPG',
    actor = null,
    items = [],
    attributeName = null,
    skillName = null,
    dice = [6],
    modifier = 0,
    maxPush = 1,
  } = {},
  options = {}) {
    super({}, options);
    this.title = title;
    this.actor = actor;
    this.items = !Array.isArray(items) ? [items] : items;
    this.dice = !Array.isArray(dice) ? [dice] : dice;
    this.roll = {};
    this.modifier = modifier;
    this.maxPush = maxPush;
  }
}
