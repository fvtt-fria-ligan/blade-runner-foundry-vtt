import { ITEM_TYPES, SYSTEM_NAME } from '@system/constants';

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
    const sysName = game.system.data.name || SYSTEM_NAME;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysName, 'sheet', 'item'],
      width: 250, // window.innerWidth * 0.08 + 350,
      scrollY: ['.sheet-body'],
      resizable: false,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'info' }],
    });
  }

  /** @override */
  get template() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return `systems/${sysName}/templates/item/item-sheet.hbs`;
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
      data: baseData.item.data.data,
      // effects: baseData.effects,
      rollable: this.item.props.rollable != undefined ? true : false,
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
      input.value = foundry.utils.getProperty(this.item.data, input.name) + delta;
    }
    else if (value[0] === '=') {
      input.value = value.slice(1);
    }
  }

  /* ------------------------------------------ */

  _onAddModifier(event) {
    event.preventDefault();
    const modifiers = foundry.utils.duplicate(this.item.data.data.modifiers ?? {});
    const modifierId = Math.max(-1, ...Object.getOwnPropertyNames(modifiers)) + 1;
    return this.item.update({ [`data.modifiers.${modifierId}`]: { name: '', value: '+1' } });
  }

  _onDeleteModifier(event) {
    event.preventDefault();
    const modifierId = event.currentTarget.dataset.modifierId;
    if (this.item.data.data.modifiers[modifierId]) {
      this.item.update({ [`data.modifiers.-=${modifierId}`]: null });
    }
  }
}
