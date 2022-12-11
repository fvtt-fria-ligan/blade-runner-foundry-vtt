import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_ID, ACTOR_SUBTYPES } from '@system/constants';
import { enrichTextFields } from '@utils/string-util';

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
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'sheet', 'actor', 'character'],
      width: 525,
      height: 616,
      resizable: true,
      scrollY: ['.sheet-body'],
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'stats',
      }],
    });
  }

  /** @override */
  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    if (!game.user.isGM && this.actor.limited) {
      return `systems/${sysId}/templates/actor/${this.actor.type}/${this.actor.type}-limited-sheet.hbs`;
    }
    return `systems/${sysId}/templates/actor/${this.actor.type}/${this.actor.type}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  async getData(options) {
    const sheetData = await super.getData(options);
    sheetData.isPC = this.actor.system.subtype === ACTOR_SUBTYPES.PC;
    sheetData.isNPC = this.actor.system.subtype === ACTOR_SUBTYPES.NPC;
    sheetData.driving = this.actor.skills.driving?.value;
    sheetData.actions = game.bladerunner.actions.filter(a => a.actorType === this.actor.type);

    if (this.actor.system.subtype === ACTOR_SUBTYPES.PC) {
      await enrichTextFields(sheetData, [
        'system.bio.keyMemory',
        'system.bio.keyRelationship',
        'system.bio.home',
        'system.bio.appearance',
      ]);
    }

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
    html.find('.stat-roll').click(this._onStatRoll.bind(this));

    // Resolve Permanent Loss
    html.find('.meta-currencies .capacity-boxes').on('click contextmenu', super._onCapacityIncrease.bind(this));
    html.find('.capacity-resolve .capacity-boxes').on('contextmenu', this._onResolveDecrease.bind(this));

    // Owner-only listeners.
    if (this.actor.isOwner) {
      html.find('.action-roll[data-action]').each((_index, elem) => {
        elem.setAttribute('draggable', true);
        elem.addEventListener('dragstart', ev => this._onDragStart(ev), false);
      });
    }
  }

  /* ------------------------------------------ */

  _onStatRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const attrKey = elem.dataset.attribute;
    const skillKey = elem.dataset.skill;
    return this.actor.rollStat(attrKey, skillKey);
  }

  /* ------------------------------------------ */

  _onResolveDecrease(event) {
    event.preventDefault();
    if (this.actor.system.subtype !== ACTOR_SUBTYPES.PC) return;
    if (this.actor.system.resolve.value > 1) return;
    return this.actor.rollResolve();
  }
}
