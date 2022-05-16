import BladeRunnerActorSheet from '@actor/actor-sheet.js';
import { BLADE_RUNNER, ACTOR_TYPES } from '@system/constants.js';

/**
 * Blade Runner RPG Actor Sheet for Character.
 * @extends {BladeRunnerActorSheet} Extends the BR ActorSheet
 */
export default class BladeRunnerCharacterSheet extends BladeRunnerActorSheet {

  /* ------------------------------------------ */
  /*  Sheet Properties                          */
  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [BLADE_RUNNER, 'sheet', 'actor'],
      width: 700,
      height: 780,
      resizable: true,
      scrollY: [],
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'main',
      }],
    });
  }

  /** @override */
  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return '';
    }
    if (this.actor.type === ACTOR_TYPES.NPC) {
      return '';
    }
    return '';
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const sheetData = super.getData(options);
    sheetData.isPC = this.actor.type === ACTOR_TYPES.PC;
    sheetData.isNPC = this.actor.type === ACTOR_TYPES.NPC;
    return sheetData;
  }

}