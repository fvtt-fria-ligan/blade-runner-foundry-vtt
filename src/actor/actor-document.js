import Modifier from '@components/modifier';
import BRRollHandler from '@components/roll/roller';
import { FLBR } from '@system/config';
import { ACTOR_TYPES, CAPACITIES, SKILLS } from '@system/constants';

/**
 * @typedef {Object} ActorCapacity
 * @property {number} value
 * @property {number} max
 * @property {number} mod
 * @property {number} permanentLoss
 */

/**
 * Blade Runner Actor Document.
 * @class
 * @extends {Actor}
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

  get rollData() {
    return this.getRollData();
  }

  /* ----------------------------------------- */

  /** @override */
  getRollData() {
    const rollData = super.getRollData();
    for (const [k, v] of Object.entries(this.attributes)) {
      rollData[k] = v.value;
    }
    for (const [k, v] of Object.entries(this.skills)) {
      rollData[k] = v.value;
    }
    return rollData;
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
      const capacity = this.data.data[cap];
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
        max = Math.ceil(max / 4) + natureModifier + capacity.mod + permanentLoss;
        max = Math.clamped(max, 0, capData.max);

        // Records the value in the actor data.
        capacity.max = max;
        if (capacity.value > max) capacity.value = max;
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
   * @returns {Array.<import('@components/modifier').default>} An array of Modifiers
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
   * Rolls a stat (attribute/skill) for this actor.
   * @param {string}   attributeKey   The identifier for the attribute
   * @param {?string}  skillkey       The identifier for the skill
   * @param {Object}  [options={}]    Additional options
   * @param {string}  [options.title] Custom title
   * @returns {BRRollHandler} Rendered RollHandler FormApplication
   */
  rollStat(attributeKey, skillKey, options = {}) {
    if (!attributeKey) {
      return this.rollBlank(options);
    }
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`) : null;

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

    const modifiers = this.getRollModifiers({ targets });
    if (skillKey === SKILLS.FIREARMS) {
      modifiers.push(...Modifier.getRangedCombatModifiers());
    }

    const roller = new BRRollHandler({
      title,
      actor: this,
      attributeKey, skillKey, dice,
      modifiers,
      maxPush: this.maxPush,
    }, {
      unlimitedPush: this.data.flags.bladerunner?.unlimitedPush,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */

  /**
   * Performs a roll from an empty dice pool.
   * @param {Object} [options]       Additional options for the roll
   * @param {string} [options.title] A custom title for the roll if you don't want to use the default
   * @returns {BRRollHandler} Rendered RollHandler FormApplication
   */
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

  /* ------------------------------------------ */

  /**
   * Rolls the actor's empathy and marks a permanent loss in resolve if a bane was rolled.
   * @returns {number} Quantity of resolve permanently lost, or 0
   * @async
   */
  async rollResolve() {
    const title = game.i18n.localize('FLBR.ROLLER.ResolveTest');
    const execute = await Dialog.confirm({
      title,
      content: `<p>${game.i18n.localize('FLBR.ROLLER.ResolveTestHint')}</p>`,
    });
    if (!execute) return;

    const roller = new BRRollHandler({
      title,
      actor: this,
      dice: [this.attributes.emp.value],
      maxPush: 0,
    });

    const { roll } = await roller.executeRoll();

    if (roll.baneCount) {
      ui.notifications.info(game.i18n.format('FLBR.ROLLER.ResolveTestFailed', {
        name: this.name,
      }), {
        permanent: true,
      });
      let loss = +this.resolve.permanentLoss;
      loss--;
      await this.update({ 'data.resolve.permanentLoss': loss });
      return loss;
    }
    return 0;
  }
}
