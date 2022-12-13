import BladeRunnerActorSheet from '@actor/actor-sheet';
import { SYSTEM_ID, ACTOR_TYPES, ACTOR_SUBTYPES, SKILLS, ATTRIBUTES } from '@system/constants';
import { FLBR } from '@system/config';

/**
 * Blade Runner RPG Actor Sheet for Character.
 * @extends {BladeRunnerActorSheet} Extends the BR ActorSheet
 */
export default class BladeRunnerVehicleSheet extends BladeRunnerActorSheet {

  /* ------------------------------------------ */
  /*  Sheet Properties                          */
  /* ------------------------------------------ */

  /**
   * A convenient shortcut to the vehicle actor in this sheet.
   * @type {import('@actor/actor-document').default & { crew: import('@components/vehicle-crew').default}}
   */
  get vehicle() {
    return this.actor;
  }

  /** @override */
  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'sheet', 'actor', 'vehicle'],
      width: 569,
      height: 700,
      resizable: true,
      scrollY: ['.sheet-body'],
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'combat',
      }],
    });
  }

  /* ------------------------------------------ */
  /*  Sheet Data Preparation                    */
  /* ------------------------------------------ */

  /** @override */
  async getData(options) {
    const sheetData = await super.getData(options);
    // ? Note: the double '!!' turns undefined into a boolean
    // ?   because .partition() fails on undefined.
    const [otherItems, mountedWeapons] = this.vehicle.items.contents.partition(i => !!i.system.mounted);
    sheetData.trunk = otherItems;
    sheetData.mountedWeapons = mountedWeapons;
    sheetData.crew = this.vehicle.crew.contents;
    sheetData.actions = game.bladerunner.actions.filter(a => a.actorType === this.actor.type);
    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Drop Crew Occupants                       */
  /* ------------------------------------------ */

  /** @override */
  async _onDropActor(event, data) {
    await super._onDropActor(event, data);

    if (!this.vehicle.isOwner) return;
    if (data.parent === this.vehicle.id) return;

    const actor = await fromUuid(data.uuid);
    if (!actor) return;

    if (actor.type === ACTOR_TYPES.CHAR) {
      return this.dropCrew(actor);
    }
    return ui.notifications.info(`FLBR.VEHICLE.NotifDropCrew${actor.type.capitalize()}`, { localize: true });
  }

  /* ------------------------------------------ */

  /**
   * Handles the creation of a crew occupant from dropping an actor.
   * @param {BladeRunnerActor} actor
   */
  async dropCrew(actor) {
    if (this.vehicle.crew.full) {
      return ui.notifications.info('FLBR.VEHICLE.NotifCrewFull', { localize: true });
    }
    if (
      actor.system.subtype === ACTOR_SUBTYPES.NPC ||
      !actor.prototypeToken.actorLink
    ) {
      const toCopy = await Dialog.confirm({
        title: game.i18n.localize('FLBR.VEHICLE.CreateActor'),
        content: game.i18n.format('FLBR.VEHICLE.CreateActorHint', {
          name: actor.name,
        }),
        defaultYes: true,
      });
      if (toCopy) {
        const actorData = actor.toObject();
        actorData.name = `${actor.name} (in ${this.vehicle.name})`;
        actor = await Actor.create(actorData); // This creates a new actor with a new ID
      }
    }
    await this.vehicle.addVehicleOccupant(actor);
  }

  /* ------------------------------------------ */
  /*  Drag Passengers                           */
  /* ------------------------------------------ */

  /** @override */
  _onDragStart(event) {
    super._onDragStart(event);

    const elem = event.currentTarget.closest('.vehicle-seat');
    if (!elem) return;
    const actor = this.vehicle.crew.get(elem.dataset.occupantId);
    if (!actor) return;
    const dragData = actor.toDragData();
    dragData.parent = this.vehicle.id;
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  }

  /* ------------------------------------------ */
  /*  Sheet Listeners & Context Menus           */
  /* ------------------------------------------ */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Editable-only Listeners
    if (!game.user.isGM && this.actor.limited) return;
    // if (!this.options.editable) return;
    if (!this.isEditable) return;

    // Stats Roll
    html.find('.mvr-roll').click(this._onManeuverabilityRoll.bind(this));
    html.find('.roll-vehicle-armor').click(this._onVehicleArmorRoll.bind(this));

    // Hull
    new ContextMenu(html, '.hull', [
      {
        name: game.i18n.localize('FLBR.VEHICLE.IncreaseHull'),
        icon: FLBR.Icons.buttons.plus,
        callback: () => this.vehicle.update({
          'system.hull.max': this.vehicle.system.hull.max + 1,
        }),
        condition: () => this.vehicle.system.hull.max < FLBR.maxVehicleHull,
      },
      {
        name: game.i18n.localize('FLBR.VEHICLE.DecreaseHull'),
        icon: FLBR.Icons.buttons.minus,
        callback: () => this.vehicle.update({
          'system.hull.max': this.vehicle.system.hull.max - 1,
        }),
        condition: () => this.vehicle.system.hull.max > 1,
      },
    ]);

    // Crew
    html.find('.vehicle-seat:not(.empty):not(.broken)').click(this._onCrewAction.bind(this));
    html.find('.vehicle-seat.occupied img').each((_index, elem) => {
      elem.setAttribute('draggable', true);
      elem.addEventListener('dragstart', ev => this._onDragStart(ev), false);
    });
    new ContextMenu(html, '.vehicle-seat:not(.button)', [
      {
        name: game.i18n.localize('FLBR.VEHICLE.EditPassenger'),
        icon: FLBR.Icons.buttons.edit,
        callback: el => game.actors.get(el.data('occupant-id'))?.sheet.render(true),
        condition: el => el.hasClass('occupied'),
      },
      {
        name: game.i18n.localize('FLBR.VEHICLE.RemovePassenger'),
        icon: FLBR.Icons.buttons.delete,
        callback: el => this.vehicle.removeVehicleOccupant(el.data('occupant-id')),
        condition: el => el.hasClass('occupied'),
      },
      {
        name: game.i18n.localize('FLBR.VEHICLE.DeleteSeat'),
        icon: FLBR.Icons.buttons.remove,
        callback: () => this.vehicle.update({
          'system.passengers': this.vehicle.system.passengers - 1,
        }),
        condition: () => !this.vehicle.crew.full && this.vehicle.system.passengers > 1,
      },
    ]);

    // Owner-only listeners.
    if (this.actor.isOwner) {
      // html.find('.action-roll[data-action]').each((_index, elem) => {
      //   elem.setAttribute('draggable', true);
      //   elem.addEventListener('dragstart', ev => this._onDragStart(ev), false);
      // });
    }
  }

  /* ------------------------------------------ */

  /** @override */
  async _onActionRoll(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const actionKey = elem.dataset.action;
    const action = game.bladerunner.actions.get(actionKey);
    if (!action) return;

    if (action.onCrew) {
      const actor = await this.vehicle.crew.choose();
      if (!actor) return;
      return action.execute(actor);
    }
    else {
      return action.execute(this.vehicle);
    }
  }

  /* ------------------------------------------ */

  _onCrewAction(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const action = elem.dataset.action;

    if (action === 'add-occupant') {
      return this.vehicle.update({
        'system.passengers': this.vehicle.system.passengers + 1,
      });
    }
    else if (action === 'roll-occupant') {
      return this.vehicle.crew
        .get(elem.dataset.occupantId)
        ?.rollStat(ATTRIBUTES.VEHICLE_MANEUVERABILITY, SKILLS.DRIVING);
    }
  }

  /* ------------------------------------------ */

  _onManeuverabilityRoll(event) {
    event.preventDefault();
    return this.vehicle.roll({
      title: game.i18n.localize('FLBR.ATTRIBUTE.MVR'),
      dice: [this.vehicle.system.maneuverability],
    });
  }

  /* ------------------------------------------ */

  _onVehicleArmorRoll(event) {
    event.preventDefault();
    return this.vehicle.roll({
      title: `${this.vehicle.name}: ${game.i18n.localize('FLBR.ItemArmor')}`,
      dice: new Array(2).fill(this.vehicle.system.armor),
      maxPush: 0,
    });
  }
}
