import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_NAME, ACTOR_TYPES, ACTOR_SUBTYPES } from '@system/constants';
import { FLBR } from '@system/config';
import { capitalize } from '@utils/string-util';

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
      width: 520,
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
    const sysName = game.system.data.name || SYSTEM_NAME;
    if (!game.user.isGM && this.actor.limited) {
      return `systems/${sysName}/templates/actor/${ACTOR_TYPES.CHAR}/${ACTOR_TYPES.CHAR}-limited-sheet.hbs`;
    }
    return `systems/${sysName}/templates/actor/${ACTOR_TYPES.CHAR}/${ACTOR_TYPES.CHAR}-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const sheetData = super.getData(options);
    sheetData.isPC = this.actor.props.subtype === ACTOR_SUBTYPES.PC;
    sheetData.isNPC = this.actor.props.subtype === ACTOR_SUBTYPES.NPC;
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
    html.find('.stat-roll').click(this._onStatRoll.bind(this));
    html.find('.action-roll').click(this._onActionRoll.bind(this));
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
    const skillKey = elem.dataset.skill;
    const attrKey = FLBR.skillMap[skillKey];
    const title = `${elem.innerText} (${game.i18n.localize(`FLBR.SKILL.${capitalize(skillKey)}`)})`;
    return this.actor.rollStat(attrKey, skillKey, { title });
  }
}
