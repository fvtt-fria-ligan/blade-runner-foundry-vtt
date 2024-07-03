/* eslint-disable no-shadow */
/**
 * A class representing an item's action.
 */
export default class ItemAction {
  /**
   * @param {number} type The type of action
   * @param {Object} options
   * @param {Item}   options.item
   * @param {string} options.name
   * @param {string} options.macro
   * @param {import('@system/constants').ATTRIBUTES} options.attribute
   * @param {import('@system/constants').SKILLS}     options.skill
   */
  constructor(type, { name, item, attribute, skill, macro }) {
    /**
     * Identifier for this action.
     * @type {string}
     * @constant
     */
    this.id = foundry.utils.randomID(8);

    this.type = type || ItemAction.Types.ROLL_SKILL;
    this.name = name;
    this.item = item;

    switch (this.type) {
      case ItemAction.Types.ROLL_SKILL:
        this.attribute = attribute || 'str';
        this.skill = skill || 'closeCombat';
        break;
      case ItemAction.Types.RUN_MACRO:
        this.macro = macro;
    }
  }

  get actor() {
    return this.item?.actor;
  }

  get title() {
    switch (this.type) {
      case ItemAction.Types.ROLL_SKILL:
        return this.name + ' ('
          + game.i18n.localize(`FLBR.ATTRIBUTE.${this.attribute.toUpperCase()}`)
          + ' + '
          + game.i18n.localize(`FLBR.SKILL.${this.skill.capitalize()}`)
          + ')';
      default:
        return this.name;
    }
  }

  toObject() {
    return {
      // id: this.id,
      type: this.type,
      name: this.name,
      // item: this.item.uuid,
      attribute: this.attribute,
      skill: this.skill,
      macro: this.macro,
    };
  }
}

/** @enum {string} */
ItemAction.Types = {
  ROLL_SKILL: 'skill',
  RUN_MACRO: 'macro',
};
