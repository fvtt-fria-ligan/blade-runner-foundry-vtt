import { FLBR } from '@system/config';
import { ACTOR_TYPES, ITEM_TYPES, SETTINGS_KEYS, SYSTEM_ID } from '@system/constants';
import { enrichTextFields } from '@utils/string-util';
import ActorSheetConfig from './actor-sheet-config';

/**
 * Blade Runner RPG Actor Sheet.
 * @extends {foundry.appv1.sheets.ActorSheet} Extends the basic ActorSheet
 */
export default class BladeRunnerActorSheet extends foundry.appv1.sheets.ActorSheet {

  /* ------------------------------------------ */
  /*  Properties                                */
  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      dragDrop: [
        // { dragSelector: '.item-list .item', dropSelector: null },
        { dragSelector: '.embedded-items .embedded-item', dropSelector: null },
        { dragSelector: '.stat-roll[data-attribute]', dropSelector: null },
      ],
    });
  }

  /** @override */
  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    return `systems/${sysId}/templates/actor/${this.actor.type}/${this.actor.type}-sheet.hbs`;
  }

  get rollData() {
    return this.actor.getRollData();
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  async getData(options) {
    const isOwner = this.actor.isOwner;
    const showEffects = game.settings.get(SYSTEM_ID, SETTINGS_KEYS.USE_ACTIVE_EFFECTS);
    const baseData = super.getData(options);
    const sheetData = {
      cssClass: isOwner ? 'editable' : 'locked',
      owner: isOwner,
      limited: this.actor.limited,
      editable: this.isEditable,
      options: this.options,
      isGM: game.user.isGM,
      actor: baseData.actor,
      system: foundry.utils.duplicate(baseData.actor.system),
      items: [...this.actor.items].sort((a, b) => (a.sort || 0) - (b.sort || 0)),
      showEffects,
      effects: showEffects ? [...this.actor.effects] : null,
      rollData: this.rollData,
      config: CONFIG.BLADE_RUNNER,
    };

    await enrichTextFields(sheetData, ['system.description']);

    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Filtering Dropped Items                   */
  /* ------------------------------------------ */

  /** @override */
  async _onDropItemCreate(itemData) {
    const type = itemData.type;
    const alwaysAllowedItems = FLBR.physicalItems;
    const allowedItems = {
      [ACTOR_TYPES.CHAR]: [ITEM_TYPES.SPECIALTY, ITEM_TYPES.SYNTHETIC_AUGMENTATION, ITEM_TYPES.CRITICAL_INJURY],
      [ACTOR_TYPES.VEHICLE]: [],
      [ACTOR_TYPES.LOOT]: [],
    };
    let allowed = true;

    if (!alwaysAllowedItems.includes(type)) {
      if (!allowedItems[this.actor.type].includes(type)) {
        allowed = false;
      }
    }

    if (!allowed) {
      const msg = game.i18n.format('FLBR.ActorSheet.NotifWrongItemType', {
        type: game.i18n.localize(`TYPES.Item.${type}`),
        actor: game.i18n.localize(`TYPES.Actor.${this.actor.type}`),
      });
      console.warn(`FLBR | ${msg}`);
      ui.notifications.warn(msg);
      return false;
    }
    return super._onDropItemCreate(itemData);
  }

  /* ------------------------------------------ */
  /*  Custom Drag Data                          */
  /* ------------------------------------------ */

  /** @override */
  _onDragStart(event) {
    const elem = event.currentTarget;
    const data = elem.dataset;

    if (
      typeof data.attribute !== 'undefined' ||
      typeof data.skill !== 'undefined' ||
      typeof data.action !== 'undefined'
    ) {
      const dragData = {
        actorId: this.actor.id,
        sceneId: this.actor.isToken ? canvas.scene?.id : null,
        tokenId: this.actor.isToken ? this.actor.token.id : null,
        uuid: this.actor.uuid,
        type: data.action ? 'Action' : 'Stat',
        attribute: data.attribute,
        skill: data.skill,
        action: data.action,
      };
      return event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
    return super._onDragStart(event);
  }

  /* ------------------------------------------ */
  /*  Custom Config Sheet                       */
  /* ------------------------------------------ */

  /** @override */
  _onConfigureSheet(event) {
    event.preventDefault();
    new ActorSheetConfig({
      // classes: ['blade-runner', 'dialog'],
      document: this.actor,
    }).render(true);
  }

  /* ------------------------------------------ */
  /*  Sheet Header Buttons                      */
  /* ------------------------------------------ */

  /** @override */
  _getHeaderButtons() {
    const originalButtons = super._getHeaderButtons();

    if (!game.user.isGM && this.actor.limited) return originalButtons;
    if (this.actor.type === ACTOR_TYPES.LOOT) return originalButtons;

    const myButtons = [
      {
        label: game.i18n.localize('FLBR.SHEET_HEADER.GenericRoll'),
        class: 'custom-roll',
        icon: 'fas fa-dice',
        onclick: () => this.actor.roll(),
      },
    ];
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

    // Executing Actions
    html.find('.action-roll').click(this._onActionRoll.bind(this));

    // Item Management
    html.find('.capacities .capacity-boxes').on('click contextmenu', this._onCapacityIncrease.bind(this));

    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));
    html.find('.item-delete-confirmed').click(this._onItemDeleteConfirmed.bind(this));
    html.find('.item-control').click(this._onItemControl.bind(this));
    html.find('.embedded-item').on('contextmenu', this._onItemEdit.bind(this));

    // Active Effects
    if (game.settings.get(SYSTEM_ID, SETTINGS_KEYS.USE_ACTIVE_EFFECTS)) {
      html.find('.add-active-effect').click(this._onAddActiveEffect.bind(this));
      html.find('.active-effect-controls .btn').click(this._onActiveEffectAction.bind(this));
    }
  }

  /* ------------------------------------------ */

  _onActionRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const actionKey = elem.dataset.action;
    return game.bladerunner.actions.get(actionKey)?.execute(this.actor);
  }

  /* ------------------------------------------ */

  _onItemCreate(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const type = elem.dataset.type;
    const itemName = game.i18n.format('FLBR.NewItem', {
      type: game.i18n.localize(`TYPES.Item.${type}`),
    });
    const itemData = { name: itemName, type };
    return this.actor.createEmbeddedDocuments('Item', [itemData])
      // Displays the sheet of the newly created item.
      .then(itmData => {
        const itemId = itmData[0].id;
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
      });
  }

  /* ------------------------------------------ */

  /** @param {MouseEvent} event */
  _onItemDelete(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    elem.style.display = 'none';
    const embeddedItem = elem.closest('.embedded-item');
    const deleteButton = embeddedItem.getElementsByClassName('item-delete-confirmed')[0];
    deleteButton.style.display = 'inline';
  }

  _onItemDeleteConfirmed(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    return this.actor.deleteEmbeddedDocuments('Item', [itemId]);
  }

  /* ------------------------------------------ */

  _onItemEdit(event) {
    event.preventDefault();
    event.currentTarget.dataset.action = 'edit';
    return this._onItemControl(event);
  }

  _onItemControl(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const itemId = elem.closest('.embedded-item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;

    switch (elem.dataset.action) {
      case 'edit': return item.sheet.render(true);
      case 'roll': return item.roll();
      case 'blast': return item._rollExplosive();
      case 'mount': return item.update({ 'system.mounted': true });
      case 'unmount': return item.update({ 'system.mounted': false });
      case 'chat': return item.toMessage();
    }
  }

  /* ------------------------------------------ */

  _onCapacityIncrease(event) { return this._onCapacityChange(event, +1); }
  _onCapacityDecrease(event) { return this._onCapacityChange(event, -1); }

  /** Default => Left-click: +1, Right-click: -1 */
  _onCapacityChange(event, mod = 1) {
    event.preventDefault();
    const elem = event.currentTarget;
    const min = +elem.dataset.min ?? 0;
    const max = +elem.dataset.max || 10;
    const field = elem.dataset.field;
    if (!field) return;

    let count = foundry.utils.getProperty(this.actor, field) ?? 0;

    if (event.type === 'click') count += mod;
    else count -= mod; // contextmenu
    count = Math.clamp(count, min, max);

    return this.actor.update({ [field]: count });
  }

  /* ------------------------------------------ */

  _onAddActiveEffect(event) {
    event.preventDefault();
    return this.actor.createEmbeddedDocuments('ActiveEffect', [{
      label: game.i18n.localize('FLBR.ACTIVE_EFFECT.New'),
      icon: 'icons/svg/aura.svg',
      origin: this.actor.uuid,
    }]);
  }

  _onActiveEffectAction(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const effectId = btn.closest('[data-effect-id]').dataset.effectId;
    const effect = this.actor.effects.get(effectId);
    if (!effect) return;
    switch (event.currentTarget.dataset.action) {
      case 'toggle': return effect.update({ disabled: !effect.disabled });
      case 'edit': return effect.sheet.render(true);
      case 'delete': return effect.delete();
    }
  }
}
