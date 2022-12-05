import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_ID, ACTOR_TYPES } from '@system/constants';
import { FLBR } from '@system/config';

/**
 * Blade Runner RPG Actor Sheet for Character.
 * @extends {BladeRunnerActorSheet} Extends the BR ActorSheet
 */
export default class BladeRunnerVehicleSheet extends BladeRunnerActorSheet {

  /* ------------------------------------------ */
  /*  Sheet Properties                          */
  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'sheet', 'actor', 'vehicle'],
      width: 500,
      height: 600,
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
    // if (!game.user.isGM && this.actor.limited) {
    //   return `systems/${sysId}/templates/actor/${ACTOR_TYPES.VEHICLE}/${ACTOR_TYPES.VEHICLE}-limited-sheet.hbs`;
    // }
    return `systems/${sysId}/templates/actor/${ACTOR_TYPES.VEHICLE}/${ACTOR_TYPES.VEHICLE}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  async getData(options) {
    const sheetData = await super.getData(options);

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
    html.find('.action-roll').click(this._onActionRoll.bind(this));

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

  _onActionRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const actionKey = elem.dataset.action;
    const action = FLBR.Actions.find(a => a.id === actionKey);
    if (!action) return;
    if (typeof action.callback === 'function') return action.callback(this.actor);

    const skillKey = action.skill;
    const attrKey = action.attribute || FLBR.skillMap[skillKey];
    const title = `${elem.innerText} (${game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`)})`;
    return this.actor.rollStat(attrKey, skillKey, { title });
  }
}
