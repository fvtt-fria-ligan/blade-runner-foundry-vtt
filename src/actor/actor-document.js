import { FLBR } from '../system/config.js';
import { ACTOR_TYPES, CAPACITIES } from '../system/constants.js';

export default class BladeRunnerActor extends Actor {

  /* ------------------------------------------ */
  /*  Properties                                */
  /* ------------------------------------------ */

  get props() {
    return this.data.data;
  }

  get attributes() {
    return this.props.attributes;
  }

  get skills() {
    return this.props.skills;
  }

  get health() {
    return this.props.health;
  }

  get resolve() {
    return this.props.resolve;
  }

  get isBroken() {
    return this.props.isBroken;
  }

  // TODO
  // get bio() {
  //   return this.props.bio;
  // }

  // get metaCurrencies() {
  //   return this.props.metaCurrencies;
  // }

  // get rollData() {
  //   return this.getRollData();
  // }

  /* ------------------------------------------ */
  /*  Create                                    */
  /* ------------------------------------------ */

  /** @override */
  static async create(data, options) {
    switch (data.type) {
      case ACTOR_TYPES.PC:
      case ACTOR_TYPES.NPC:
        if (!data.data.attributes || !data.data.skills) {
          throw new TypeError(`FLBR | "${data.type}" has No attribute nor skill`);
        }
        // Sets the default starting value for attributes.
        for (const attribute in data.data.attributes) {
          data.data.attributes[attribute] = { value: FLBR.startingAttributeLevel };
        }
        // Builds the list of skills.
        for (const skill in FLBR.skillMap) {
          data.data.skills[skill] = { value: FLBR.startingSkillLevel };
        }
        break;
    }
    return super.create(data, options);
  }

  /* ----------------------------------------- */
  /*  Data Preparation                         */
  /* ----------------------------------------- */

  /**
   * Augments the basic Actor data model with additional dynamic data.
   * @override
   */
  prepareData() {
    super.prepareData();

    switch (this.type) {
      case ACTOR_TYPES.PC: this._prepareCharacterData(); break;
      case ACTOR_TYPES.NPC: this._prepareNpcData(); break;
    }
  }

  /* ----------------------------------------- */
  /*  Data Preparation                         */
  /*   → Character & NPC                       */
  /* ----------------------------------------- */

  /** @private */
  _prepareCharacterData() {
    this._prepareCapacities();
  }

  /** @private */
  _prepareNpcData() {
    this._prepareCharacterData();
  }

  /* ----------------------------------------- */

  /**
   * Sets the maxima for each capacities *(e.g. Health & Resolve)*
   * based on the character's attributes, nature and permanent losses.
   * @private
   */
  _prepareCapacities() {
    // Rolls over each legal capacity.
    for (const identifier of Object.values(CAPACITIES)) {
      const capacity = this.data.data[identifier];
      const capData = FLBR.capacitiesMap[identifier];
      // Proceeds if it exists in the character.
      if (capacity && capData) {
        // Gets the nature modifier.
        const natureModifier = FLBR.natureModifierMap[this.type]?.[identifier] ?? 0;
        // Gets any permanent loss.
        const permanentLoss = capacity.permanentLoss ?? 0;

        let max = 0;
        // Sums all specified attributes.
        for (const attribute of capData.attributes) {
          max += this.getAttribute(attribute);
        }
        // Performs some maths.
        max = Math.ceil(max / 4) + natureModifier - permanentLoss;
        max = Math.clamped(max, 0, capData.max);

        // Records the value in the actor data.
        capacity.max = max;
      }
    }
  }

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  /**
   * Gets the value of a specified attribute.
   * @param {string} attributeName The identifier for the attribute
   * @returns {number}
   */
  getAttribute(attributeName) {
    return this.attributes[attributeName]?.value;
  }

  /**
   * Gets the value of a specified skill.
   * @param {string} skillName The identifier for the skill
   * @returns {number}
   */
  getSkill(skillName) {
    return this.skills[skillName]?.value;
  }
}
