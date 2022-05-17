import { SYSTEM_NAME } from '@system/constants.js';

/**
 * Blade Runner RPG Item Sheet.
 * @extends {ItemSheet} Extends the basic ItemSheet
 */
export default class BladeRunnerItemSheet extends ItemSheet {

  /* ------------------------------------------ */
  /*  Sheet Properties                          */
  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_NAME, 'sheet', 'item'],
      width: window.innerWidth * 0.08 + 350,
      resizable: true,
    });
  }

  /** @override */
  get template() {
    const br = game.system.data.name || SYSTEM_NAME;
    return `systems/${br}/templates/item/${this.item.type}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const isOwner = this.actor.isOwner;
    const baseData = super.getData(options);
    const sheetData = {
      cssClass: isOwner ? 'editable' : 'locked',
      owner: isOwner,
      // limited: this.actor.limited,
      editable: this.isEditable,
      options: this.options,
      isGM: game.user.isGM,
      inActor: this.item.actor ? true : false,
      // inVehicle: this.item.actor?.type === 'vehicle',
      item: baseData.item,
      data: baseData.item.data.data,
      // effects: baseData.effects,
      rollData: this.item.getRollData(),
      config: CONFIG.BLADE_RUNNER,
    };
    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Sheet Listeners                           */
  /* ------------------------------------------ */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Editable-only Listeners
    if (!game.user.isGM && this.actor.limited) return;
    // if (!this.options.editable) return;
    if (!this.isEditable) return;

    // Input Focus
    html.find('input').focus(ev => ev.currentTarget.select());
  }
}
