import BladeRunnerActorSheet from '@actor/actor-sheet.js';
import { SYSTEM_NAME, ACTOR_TYPES } from '@system/constants.js';
import { generateScores } from 'src/utils/get-score.js';

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
      classes: [SYSTEM_NAME, 'sheet', 'actor'],
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
    const br = game.system.data.name || SYSTEM_NAME;
    if (!game.user.isGM && this.actor.limited) {
      return `systems/${br}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.PC}-limited-sheet.hbs`;
    }
    if (this.actor.type === ACTOR_TYPES.NPC) {
      return `systems/${br}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.NPC}-sheet.hbs`;
    }
    return `systems/${br}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.PC}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const sheetData = super.getData(options);
    generateScores(sheetData.data.attributes);
    generateScores(sheetData.data.skills);
    sheetData.isPC = this.actor.type === ACTOR_TYPES.PC;
    sheetData.isNPC = this.actor.type === ACTOR_TYPES.NPC;
    return sheetData;
  }
}
