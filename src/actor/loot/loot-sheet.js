import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_ID, ACTOR_TYPES } from '@system/constants';

/**
 * Blade Runner RPG Actor Sheet for Character.
 * @extends {BladeRunnerActorSheet} Extends the BR ActorSheet
 */
export default class BladeRunnerLootSheet extends BladeRunnerActorSheet {

  /* ------------------------------------------ */
  /*  Sheet Properties                          */
  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'sheet', 'actor', 'loot'],
      width: 525,
      height: 616,
      resizable: true,
      // scrollY: ['.sheet-body'],
      // tabs: [{
      //   navSelector: '.sheet-tabs',
      //   contentSelector: '.sheet-body',
      //   initial: 'inventory',
      // }],
    });
  }

  /** @override */
  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    // if (!game.user.isGM && this.actor.limited) {
    //   return `systems/${sysId}/templates/actor/${ACTOR_TYPES.LOOT}/${ACTOR_TYPES.LOOT}-limited-sheet.hbs`;
    // }
    return `systems/${sysId}/templates/actor/${ACTOR_TYPES.LOOT}/${ACTOR_TYPES.LOOT}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  // async getData(options) {
  //   const sheetData = await super.getData(options);
  //   return sheetData;
  // }

  /* ------------------------------------------ */
  /*  Sheet Listeners                           */
  /* ------------------------------------------ */

  /** @override */
  // activateListeners(html) {
  //   super.activateListeners(html);

  //   // Editable-only Listeners
  //   if (!game.user.isGM && this.actor.limited) return;
  //   // if (!this.options.editable) return;
  //   if (!this.isEditable) return;
  // }
}
