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

  update() {
    this.clear();
    for (const occupant of this.source) {
      const { id } = occupant;
      const actor = game.actors.get(id);
      this.set(id, actor);
    }
    return this;
  }
}
