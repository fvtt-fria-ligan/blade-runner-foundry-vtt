import BRRollHandler from 'src/components/roll/roller.js';
import { FLBR } from '@system/config';
import { ACTOR_TYPES, CAPACITIES } from '@system/constants';
import { capitalize } from '@utils/string-util';

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

  // /** @override */
  // static async create(data, options) {
  //   console.warn(data, options);
  //   switch (data.type) {
  //     case ACTOR_TYPES.PC:
  //     case ACTOR_TYPES.NPC:
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
    for (const cap of Object.values(CAPACITIES)) {
      const capacity = this.data.data[cap];
      const capData = FLBR.capacitiesMap[cap];
      // Proceeds if it exists in the character.
      if (capacity && capData) {
        // Gets the nature modifier.
        const natureModifier = FLBR.natureModifierMap[this.type]?.[cap] ?? 0;
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

  /* ------------------------------------------- */
  /*  Roll Modifiers                             */
  /* ------------------------------------------- */

  getRollModifiers() {
    const modifiers = [];
    // Iterates over each item owned by the actor.
    for (const i of this.items) {
      // If there are modifiers...
      if (i.hasModifier) {
        // // Physical items must be equipped to give their modifier.
        // // if (i.isPhysical && !i.isEquipped) continue;
        const mods = i.getModifiers();
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
   * @param {string}   attributeKey  The identifier for the attribute
   * @param {?string}  skillkey      The identifier for the skill
   * @param {Object}  [options={}]   Additional options
   * @param {string}   options.title Custom title
   * @returns {BRRollHandler}
   */
  rollStat(attributeKey, skillKey, options = {}) {
    if (!attributeKey) {
      console.warn('No rollStat', attributeKey, skillKey, options);
      return ui.notifications.warn('FLBR.NOTIF.NoAttribute', { localize: true });
    }
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${capitalize(skillKey)}`) : null;
    const title = options.title ?? skillName ?? attributeName;
    const attributeValue = this.getAttribute(attributeKey);
    const skillValue = this.getSkill(skillKey);

    const dice = [];
    if (attributeValue) dice.push(attributeValue);
    if (skillValue) dice.push(skillValue);

    const roller = new BRRollHandler({
      title,
      actor: this,
      attributeKey, skillKey, dice,
      modifiers: this.getRollModifiers(),
      maxPush: FLBR.maxPushMap[this.type],
    });
    return roller.render(true);
  }
}
