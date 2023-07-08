import ItemAction from '@components/item-action';
import ItemAttack from '@components/item-attack';
import { FLBR } from '@system/config';
import { ITEM_TYPES, SETTINGS_KEYS, SYSTEM_ID } from '@system/constants';
import { enrichTextFields } from '@utils/string-util';

/**
 * Blade Runner RPG Item Sheet.
 * @extends {ItemSheet} Extends the basic ItemSheet
 */
export default class BladeRunnerItemSheet extends ItemSheet {

  /**
   * Used to store the state of collapsible menus in an accordion
   * to keep it open between each sheet update.
   * @author FloRad (Savage Worlds)
   * @type {Object.<string, boolean>}
   */
  collapsibleStates = {};

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
  async getData(options) {
    const showEffects = game.settings.get(SYSTEM_ID, SETTINGS_KEYS.USE_ACTIVE_EFFECTS);
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
      isConsumable: this.item.isConsumable,
      inVehicle: this.item.actor?.isVehicle,
      item: baseData.item,
      system: foundry.utils.duplicate(baseData.item.system),
      showEffects,
      effects: showEffects ? this.item.effects.contents : null,
      rollable: this.item.rollable,
      rollData: this.item.getRollData(),
      collapsibleStates: this.collapsibleStates,
      config: CONFIG.BLADE_RUNNER,
    };

    await enrichTextFields(sheetData, ['system.description']);

    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Sheet Header Buttons                      */
  /* ------------------------------------------ */

  /** @override */
  _getHeaderButtons() {
    const originalButtons = super._getHeaderButtons();
    const myButtons = [];

    if (this.item.hasAction && this.item.actor) {
      myButtons.push({
        label: game.i18n.localize('FLBR.SHEET_HEADER.ItemRoll'),
        class: 'item-roll',
        icon: 'fas fa-dice',
        onclick: () => this.item.roll(),
      });
    }
    if (this.item.type === ITEM_TYPES.ARMOR) {
      myButtons.push({
        label: game.i18n.localize('FLBR.SHEET_HEADER.ArmorRoll'),
        class: 'item-roll',
        icon: 'fas fa-shield-alt',
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
    this._setupAccordions();

    // Editable-only Listeners
    if (!game.user.isGM && this.actor.limited) return;
    // if (!this.options.editable) return;
    if (!this.isEditable) return;

    // Input Focus & Update
    const inputs = html.find('input');
    inputs.focus(ev => ev.currentTarget.select());
    inputs.addBack().find('[data-dtype="Number"]').change(this._onChangeInputDelta.bind(this));

    // Item Actions
    html.find('.add-action').click(this._onAddItemAction.bind(this));
    html.find('.delete-action').click(this._onDeleteItemAction.bind(this));

    // Item Attacks
    html.find('.add-attack').click(this._onAddItemAttack.bind(this));
    html.find('.delete-attack').click(this._onDeleteItemAttack.bind(this));

    // Roll Modifiers
    html.find('.add-modifier').click(this._onAddModifier.bind(this));
    html.find('.delete-modifier').click(this._onDeleteModifier.bind(this));

    // Active Effects
    if (game.settings.get(SYSTEM_ID, SETTINGS_KEYS.USE_ACTIVE_EFFECTS)) {
      html.find('.add-active-effect').click(this._onAddActiveEffect.bind(this));
      html.find('.active-effect-controls .btn').click(this._onActiveEffectAction.bind(this));
    }

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

  _onAddItemAction(event) {
    event.preventDefault();
    const itemAction = new ItemAction(null, {
      name: game.i18n.localize('FLBR.ItemNewAction'),
      // item: this,
    });
    return this.item.update({ [`system.actions.${itemAction.id}`]: itemAction.toObject() });
  }

  _onDeleteItemAction(event) {
    event.preventDefault();
    const itemActionId = event.currentTarget.dataset.actionId;
    if (this.item.system.actions[itemActionId]) {
      this.item.update({ [`system.actions.-=${itemActionId}`]: null });
    }
  }

  /* ------------------------------------------ */

  _onAddItemAttack(event) {
    event.preventDefault();
    const itemAttack = new ItemAttack({
      name: game.i18n.localize('FLBR.ItemNewAttack'),
      // item: this,
    });
    this.collapsibleStates[itemAttack.id] = true;
    return this.item.update({ [`system.attacks.${itemAttack.id}`]: itemAttack.toObject() });
  }

  _onDeleteItemAttack(event) {
    event.preventDefault();
    const itemAttackId = event.currentTarget.dataset.attackId;
    if (this.item.system.attacks[itemAttackId]) {
      this.item.update({ [`system.attacks.-=${itemAttackId}`]: null });
    }
  }

  /* ------------------------------------------ */

  _onAddModifier(event) {
    event.preventDefault();
    const modifiers = foundry.utils.duplicate(this.item.system.modifiers ?? {});
    const modifierId = Math.max(-1, ...Object.getOwnPropertyNames(modifiers)) + 1;
    return this.item.update({ [`system.modifiers.${modifierId}`]: { name: 'attribute.str', value: '+1' } });
  }

  _onDeleteModifier(event) {
    event.preventDefault();
    const modifierId = event.currentTarget.dataset.modifierId;
    if (this.item.system.modifiers[modifierId]) {
      this.item.update({ [`system.modifiers.-=${modifierId}`]: null });
    }
  }

  /* ------------------------------------------ */

  _onAddActiveEffect(event) {
    event.preventDefault();
    return this.item.createEmbeddedDocuments('ActiveEffect', [{
      label: game.i18n.localize('FLBR.ACTIVE_EFFECT.New'),
      icon: 'icons/svg/aura.svg',
      origin: this.item.uuid,
    }]);
  }

  _onActiveEffectAction(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const effectId = btn.closest('[data-effect-id]').dataset.effectId;
    const effect = this.item.effects.get(effectId);
    if (!effect) return;
    switch (event.currentTarget.dataset.action) {
      case 'toggle': return effect.update({ disabled: !effect.disabled });
      case 'edit': return effect.sheet.render(true);
      case 'delete': return effect.delete();
    }
  }

  /* ------------------------------------------ */

  _onBlastChange(event) {
    event.preventDefault();
    const blast = +event.currentTarget.value;
    if (!(blast in FLBR.blastPowerMap)) return;
    if (this.item.attacks.length <= 0) return;
    const { damage, crit } = FLBR.blastPowerMap[blast];
    // TODO system.crit update not working properly in the item sheet, but values are all OK (tested).
    const updatedAttacks = foundry.utils.duplicate(this.item.system.attacks);
    for (const id in updatedAttacks) {
      updatedAttacks[id].damage = damage;
      updatedAttacks[id].crit = crit;
    }
    return this.item.update({ 'system.attacks': updatedAttacks });
  }

  /* ------------------------------------------ */

  _setupAccordions() {
    this.form
      ?.querySelectorAll('.item-attacks-list details')
      .forEach((el, i) => {
        const id = el.dataset.actionId;

        if (i === 0 && game.settings.get(SYSTEM_ID, SETTINGS_KEYS.OPEN_FIRST_WEAPON_ATTACK)) {
          el.open = true;
        }
        else if (this.collapsibleStates[id]) {
          el.open = true;
        }

        el.querySelector('summary')?.addEventListener('click', () => {
          this.collapsibleStates[id] = !this.collapsibleStates[id];
        });
      });
  }
}
