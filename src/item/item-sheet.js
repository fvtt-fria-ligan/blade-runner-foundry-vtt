import { FLBR } from '@system/config';
import { ITEM_TYPES, SYSTEM_ID } from '@system/constants';

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
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'sheet', 'item'],
      width: 250,
      scrollY: ['.sheet-body'],
      resizable: false,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'info' }],
      top: 100,
    });
  }

  /** @override */
  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    return `systems/${sysId}/templates/item/item-sheet.hbs`;
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    const baseData = super.getData(options);
    const sheetData = {
      cssClass: this.isEditable ? 'editable' : 'locked',
      owner: !!this.item.actor?.isOwner,
      // limited: this.actor.limited,
      editable: this.isEditable,
      options: this.options,
      isGM: game.user.isGM,
      inActor: !!this.item.actor,
      isOffensive: this.item.isOffensive,
      // inVehicle: this.item.actor?.type === 'vehicle',
      item: baseData.item,
      system: baseData.item.system,
      // effects: baseData.effects,
      rollable: this.item.system.rollable != undefined ? true : false,
      rollData: this.item.getRollData(),
      config: CONFIG.BLADE_RUNNER,
    };
    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Sheet Header Buttons                      */
  /* ------------------------------------------ */

  /** @override */
  _getHeaderButtons() {
    const originalButtons = super._getHeaderButtons();
    const myButtons = [];

    if (this.item.rollable && this.item.actor) {
      myButtons.push({
        label: game.i18n.localize('FLBR.SHEET_HEADER.ItemRoll'),
        class: 'item-roll',
        icon: this.item.type === ITEM_TYPES.ARMOR ? 'fas fa-shield-alt' : 'fas fa-dice',
        onclick: () => this.item.roll(),
      });
    }
    else if (this.item.type === ITEM_TYPES.EXPLOSIVE) {
      myButtons.push({
        label: game.i18n.localize('FLBR.SHEET_HEADER.BlastPowerRoll'),
        class: 'blast-roll',
        icon: 'fas fa-bomb',
        onclick: () => this.item._rollExplosive(),
      });
    }
    myButtons.push({
      label: game.i18n.localize('FLBR.SHEET_HEADER.ItemPost'),
      class: 'item-post',
      icon: 'far fa-comment-dots',
      onclick: () => this.item.toMessage(),
    });
    return myButtons.concat(originalButtons);
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

    // Input Focus & Update
    const inputs = html.find('input');
    inputs.focus(ev => ev.currentTarget.select());
    inputs.addBack().find('[data-dtype="Number"]').change(this._onChangeInputDelta.bind(this));

    // Roll Modifiers
    html.find('.add-modifier').click(this._onAddModifier.bind(this));
    html.find('.delete-modifier').click(this._onDeleteModifier.bind(this));

    if (this.item.type === ITEM_TYPES.EXPLOSIVE) {
      html.find('.item-property-blast .score-selector').change(this._onBlastChange.bind(this));
    }
  }

  /* ------------------------------------------ */

  /**
   * Changes the value based on an input delta.
   * @param {Event} event
   */
  _onChangeInputDelta(event) {
    event.preventDefault();
    const input = event.target;
    const value = input.value;
    if (value[0] === '+' || value[0] === '-') {
      const delta = parseFloat(value);
      input.value = foundry.utils.getProperty(this.item, input.name) + delta;
    }
    else if (value[0] === '=') {
      input.value = value.slice(1);
    }
  }

  /* ------------------------------------------ */

  _onAddModifier(event) {
    event.preventDefault();
    const modifiers = foundry.utils.duplicate(this.item.system.modifiers ?? {});
    const modifierId = Math.max(-1, ...Object.getOwnPropertyNames(modifiers)) + 1;
    return this.item.update({ [`system.modifiers.${modifierId}`]: { name: '', value: '+1' } });
  }

  _onDeleteModifier(event) {
    event.preventDefault();
    const modifierId = event.currentTarget.dataset.modifierId;
    if (this.item.system.modifiers[modifierId]) {
      this.item.update({ [`system.modifiers.-=${modifierId}`]: null });
    }
  }

  /* ------------------------------------------ */

  _onBlastChange(event) {
    event.preventDefault();
    const blast = +event.currentTarget.value;
    if (!(blast in FLBR.blastPowerMap)) return;
    const { damage, crit } = FLBR.blastPowerMap[blast];
    // TODO system.crit update not working properly in the item sheet, but values are all OK (tested).
    return this.item.update({
      'system.damage': damage,
      'system.crit': crit,
    });
  }
}
