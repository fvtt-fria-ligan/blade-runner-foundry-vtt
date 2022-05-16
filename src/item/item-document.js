import { FLBR } from "src/system/config";
import { ITEM_TYPES } from "src/system/constants";

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

  get hasModifier() {
    if (!this.props.modifiers) return false;
    return !foundry.utils.isObjectEmpty(this.props.modifiers);
  }

  /** 
   * The name with a quantity in parentheses.
   * @type {string}
   */
  get detailedName() {
    let str = this.name;
    if (this.qty > 1) {
      str += `(${this.qty})`;
    }
    return str;
  }

  /* ------------------------------------------- */
  /*  Event Handlers                             */
  /* ------------------------------------------- */

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
}

/* ------------------------------------------- */

BladeRunnerItem.CHAT_TEMPLATE = {};

for (const type of Object.values(ITEM_TYPES)) {
  BladeRunnerItem.CHAT_TEMPLATE[type] = `systems/${game.system.name}/item/${type}/templates/${type}-sheet.hbs`;
}

// BladeRunnerItem.CHAT_TEMPLATE = {
//   [ITEM_TYPES.GENERIC]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.SYNTHETIC_AUGMENTATION]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.ARMOR]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.WEAPON]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.EXPLOSIVE]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.SPECIALTY]: 'systems/blade-runner/xxx.hbs',
//   [ITEM_TYPES.CRITICAL_INJURY]: 'systems/blade-runner/xxx.hbs',
// };