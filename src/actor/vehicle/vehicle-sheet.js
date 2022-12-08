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
   * A convenient shortcut to this actor.
   * @type {import('@actor/actor-document').default}
   */
  get vehicle() {
    return this.actor;
  }

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
    const [items, mountedWeapons] = sheetData.items.partition(i => i.system.mounted);
    sheetData.items = items;
    sheetData.mountedWeapons = mountedWeapons;
    sheetData.crew = this.vehicle.crew.contents;
    return sheetData;
  }

  /* ------------------------------------------ */
  /*  Drop Crew Occupants                       */
  /* ------------------------------------------ */

  /** @override */
  async _onDropActor(event, data) {
    await super._onDropActor(event, data);

    if (!this.vehicle.isOwner) return;

    const actor = await fromUuid(data.uuid);
    if (!actor) return;

    if (actor.type === ACTOR_TYPES.CHAR) {
      return this.dropCrew(actor);
    }
    return ui.notifications.info(`FLBR.VehicleNotifDropCrew${actor.type.capitalize()}`, { localize: true });
  }

  /* ------------------------------------------ */

  /**
   * Handles the creation of a crew occupant from dropping an actor.
   * @param {BladeRunnerActor} actor
   */
  async dropCrew(actor) {
    if (this.vehicle.crew.full) {
      return ui.notifications.info('FLBR.VehicleNotifCrewFull', { localize: true });
    }
    if (
      actor.system.subtype === ACTOR_SUBTYPES.NPC ||
      !actor.prototypeToken.actorLink
    ) {
      const clone = await Dialog.confirm({
        title: game.i18n.localize('FLBR.VehicleCreateActor'),
        content: game.i18n.format('FLBR.VehicleCreateActorHint', {
          name: actor.name,
        }),
        defaultYes: true,
      });
      if (clone) {
        const actorData = actor.toObject();
        actorData.name = `${actor.name} (in ${this.vehicle.name})`;
        actor = await Actor.create(actorData);
      }
    }
    await this.vehicle.addVehicleOccupant(actor);
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

    // Crew
    html.find('.vehicle-seat.rollable').click(this._onCrewAction.bind(this));
    new ContextMenu(html, '.vehicle-seat:not(.button)', [
      {
        name: 'Edit Crew',
        icon: FLBR.Icons.buttons.edit,
        callback: el => game.actors.get(el.data('occupant-id'))?.sheet.render(true),
        condition: el => el.hasClass('occupied'),
      },
      {
        name: 'Remove Crew',
        icon: FLBR.Icons.buttons.delete,
        callback: el => this.vehicle.removeVehicleOccupant(el.data('occupant-id')),
        condition: el => el.hasClass('occupied'),
      },
      {
        name: 'Delete Seat',
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

  _onCrewAction(event) {
    event.preventDefault();
    const elem = event.currentTarget;
    const action = elem.dataset.action;

    if (action === 'add-occupant') {
      const seats = this.vehicle.system.passengers;
      return this.vehicle.update({ 'system.passengers': seats + 1 });
    }
    else if (action === 'roll-occupant') {
      const actor = game.actors.get(elem.dataset.occupantId);
      if (actor) {
        actor.rollStat(ATTRIBUTES.VEHICLE_MANEUVERABILITY, SKILLS.DRIVING);
      }
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
