import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_NAME, ACTOR_TYPES } from '@system/constants';

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
    const sysName = game.system.data.name || SYSTEM_NAME;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysName, 'sheet', 'actor', 'character'],
      width: 430,
      height: 600,
      resizable: true,
      // scrollY: ['.tab-bio'],
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'stats',
      }],
    });
  }

  /** @override */
  get template() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    if (!game.user.isGM && this.actor.limited) {
      return `systems/${sysName}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.PC}-limited-sheet.hbs`;
    }
    if (this.actor.type === ACTOR_TYPES.NPC) {
      return `systems/${sysName}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.NPC}-sheet.hbs`;
    }
    return `systems/${sysName}/templates/actor/${ACTOR_TYPES.PC}/${ACTOR_TYPES.PC}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const sheetData = super.getData(options);
    sheetData.isPC = this.actor.type === ACTOR_TYPES.PC;
    sheetData.isNPC = this.actor.type === ACTOR_TYPES.NPC;
    sheetData.driving = this.actor.skills.driving?.value;
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

    // Stats Roll
    html.find('.stat .rollable').click(this._onStatRoll.bind(this));
  }

  /* ------------------------------------------ */

  _onStatRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const stat = elem.closest('.stat');
    const attrKey = stat.dataset.attribute;
    const skillKey = stat.dataset.skill;
    return this.actor.rollStat(attrKey, skillKey);
  }
}
