import { chooseActor } from '@utils/get-actor';

export default class CrewCollection extends foundry.utils.Collection {
  constructor(parentVehicle, sourcePropertyName, passengersPropertyName) {
    super();
    this.vehicle = parentVehicle;
    this._source = sourcePropertyName;
    this._passengers = passengersPropertyName;
  }

  /* ------------------------------------------ */

  get source() {
    return foundry.utils.getProperty(this.vehicle, this._source);
  }

  get max() {
    return foundry.utils.getProperty(this.vehicle, this._passengers);
  }

  get full() {
    return this.size >= this.max;
  }

  /* ------------------------------------------ */

  /**
   * Updates the collection entries with the source array.
   * @returns {this}
   */
  update() {
    this.clear();
    for (const occupant of this.source) {
      const { id } = occupant;
      const actor = game.actors.get(id);
      this.set(id, actor);
    }
    return this;
  }

  /* ------------------------------------------ */

  /**
   * Displays a dialog to choose an actor from the crew.
   * @param {Object} [options]       Additional options for the dialog
   * @param {string} [options.title] Custom title for the dialog
   * @param {string} [options.notes] Custom notes/message for the dialog
   * @returns {Promise.<import('@actor/actor-document').default>}
   */
  async choose(options = {}) {
    if (!this.size) return;
    return chooseActor(this.contents, {
      title: options.title ?? `${this.vehicle.name}: ${game.i18n.localize('FLBR.VEHICLE.ChoosePassenger')}`,
      notes: options.notes ?? game.i18n.localize('FLBR.VEHICLE.ChoosePassengerHint'),
    });
  }
}
