import BRRollHandler from '@components/roll/roller';
import { FLBR } from '@system/config';
import { ACTOR_TYPES, CAPACITIES } from '@system/constants';
import { capitalize } from '@utils/string-util';

/**
 * @typedef {Object} ActorCapacity
 * @property {number} value
 * @property {number} max
 * @property {number} mod
 * @property {number} permanentLoss
 */

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

  get archetype() {
    return this.props.archetype;
  }

  get nature() {
    return this.props.nature;
  }

  get health() {
    return this.props.health;
  }

  get resolve() {
    return this.props.resolve;
  }

  get isBroken() {
    for (const cap of Object.values(CAPACITIES)) {
      const capacity = this.props[cap];
      if (capacity && capacity.value <= 0) return true;
    }
    return false;
  }

  get maxPush() {
    return FLBR.maxPushMap[this.nature];
  }

  // TODO
  // get rollData() {
  //   return this.getRollData();
  // }

  /* ------------------------------------------ */
  /*  Create                                    */
  /* ------------------------------------------ */

  // /** @override */
  // static async create(data, options) {
  //   console.warn(data, options);
  //   switch (data.type) {
  //     case ACTOR_TYPES.CHAR:
  //       if (!data.data.attributes || !data.data.skills) {
  //         throw new TypeError(`FLBR | "${data.type}" has No attribute nor skill`);
  //       }
  //       // Sets the default starting value for attributes.
  //       for (const attribute in data.data.attributes) {
  //         data.data.attributes[attribute] = { value: FLBR.startingAttributeLevel };
  //       }
  //       // Builds the list of skills.
  //       for (const skill in FLBR.skillMap) {
  //         data.data.skills[skill] = { value: FLBR.startingSkillLevel };
  //       }
  //       break;
  //   }
  //   return super.create(data, options);
  // }

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
      case ACTOR_TYPES.CHAR: this._prepareCharacterData(); break;
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

  /* ----------------------------------------- */

  /**
   * Sets the maxima for each capacities *(e.g. Health & Resolve)*
   * based on the character's attributes, nature and permanent losses.
   * @see {ActorCapacity}
   * @private
   */
  _prepareCapacities() {
    // Rolls over each legal capacity.
    for (const cap of Object.values(CAPACITIES)) {
      const capacity = this.props[cap];
      const capData = FLBR.capacitiesMap[cap];
      // Proceeds if it exists in the character.
      if (capacity && capData) {
        // Gets the nature modifier.
        const natureModifier = FLBR.natureModifierMap[this.nature]?.[cap] ?? 0;
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
        capacity.ratio = capacity.value / capacity.max;
      }
    }
  }

  /* ------------------------------------------- */
  /*  Roll Modifiers                             */
  /* ------------------------------------------- */

  /**
   * Gets all the modifiers from this actor's items.
   * @param {Object} options Filtering options
   * @returns {Array.<import('@system/modifier').default>} An array of Modifiers
   */
  getRollModifiers(options) {
    const modifiers = [];
    // Iterates over each item owned by the actor.
    for (const i of this.items) {
      // If there are modifiers...
      if (i.hasModifier) {
        // // Physical items must be equipped to give their modifier.
        // // if (i.isPhysical && !i.isEquipped) continue;
        const mods = i.getModifiers(options);
        if (mods.length > 0) modifiers.push(...mods);
      }
    }
    return modifiers;
  }

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  /**
   * Gets the value of a specified attribute.
   * @param {string} attributeKey The identifier for the attribute
   * @returns {number}
   */
  getAttribute(attributeKey) {
    return +this.attributes[attributeKey]?.value;
  }

  /**
   * Gets the value of a specified skill.
   * @param {string} skillKey The identifier for the skill
   * @returns {number}
   */
  getSkill(skillKey) {
    return +this.skills[skillKey]?.value;
  }

  /* ------------------------------------------ */

  /**
   * Rolls a stat of this actor.
   * @param {string}   attributeKey   The identifier for the attribute
   * @param {?string}  skillkey       The identifier for the skill
   * @param {Object}  [options={}]    Additional options
   * @param {string}  [options.title] Custom title
   * @returns {BRRollHandler}
   */
  rollStat(attributeKey, skillKey, options = {}) {
    if (!attributeKey) {
      return this.rollBlank(options);
    }
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${capitalize(skillKey)}`) : null;

    // ? const title = options.title ?? skillName ?? attributeName;
    let title;
    if (options.title) title = options.title;
    else if (skillName) title = `${skillName} (${attributeName})`;
    else title = attributeName;

    const attributeValue = this.getAttribute(attributeKey);
    const skillValue = this.getSkill(skillKey);

    const targets = [attributeKey];
    if (skillKey) targets.push(skillKey);

    const dice = [];
    if (attributeValue) dice.push(attributeValue);
    if (skillValue) dice.push(skillValue);

    const roller = new BRRollHandler({
      title,
      actor: this,
      attributeKey, skillKey, dice,
      modifiers: this.getRollModifiers({ targets }),
      maxPush: this.maxPush,
    }, {
      unlimitedPush: this.data.flags.bladerunner?.unlimitedPush,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */

  rollBlank(options) {
    return BRRollHandler.create({
      title: options.title ?? game.i18n.localize('FLBR.SHEET_HEADER.GenericRoll'),
      actor: this,
      dice: [],
      modifiers: this.getRollModifiers(),
      maxPush: this.maxPush,
    }, {
      unlimitedPush: this.data.flags.bladerunner?.unlimitedPush,
    });
  }
}
