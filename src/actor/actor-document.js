import { FLBR } from '@system/config';
import { ACTOR_SUBTYPES, ACTOR_TYPES, ATTRIBUTES,
  CAPACITIES, ITEM_TYPES, SETTINGS_KEYS, SKILLS, SYSTEM_ID } from '@system/constants';
import Modifier from '@components/item-modifier';
import BRRollHandler from '@components/roll/roller';
import CrewCollection from '@components/vehicle-crew';

/**
 * @typedef {Object} ActorCapacity
 * @property {number} value
 * @property {number} max
 * @property {number} mod
 * @property {number} permanentLoss
 */

/**
 * @typedef {Object} VehicleOccupant
 * @property {string} id
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

  get attributes() {
    return this.system.attributes;
  }

  get skills() {
    return this.system.skills;
  }

  get isBroken() {
    switch (this.type) {
      case ACTOR_TYPES.VEHICLE:
        return this.system.hull.value <= 0;
      case ACTOR_TYPES.CHAR:
        for (const cap of Object.values(CAPACITIES)) {
          const capacity = this.system[cap];
          if (capacity && capacity.value <= 0) return true;
        }
    }
    return false;
  }

  get maxPush() {
    if (this.type === ACTOR_TYPES.CHAR) {
      return this.system.subtype === ACTOR_SUBTYPES.PC ? FLBR.maxPushMap[this.system.nature] : 0;
    }
    return 1;
  }

  get healthBarColor() {
    const pct = this.system.health?.ratio;
    return foundry.utils.Color.fromRGB([
      1 - (pct / 2),
      pct,
      0,
    ]).css;
  }

  get resolveBarColor() {
    const pct = this.system.resolve?.ratio;
    return foundry.utils.Color.fromRGB([
      0.5 * pct,
      0.7 * pct,
      0.5 + (pct / 2),
    ]).css;
  }

  get rollData() {
    return this.getRollData();
  }

  /* ----------------------------------------- */

  /** @override */
  getRollData() {
    const rollData = super.getRollData();
    if (this.type === ACTOR_TYPES.CHAR) {
      for (const [k, v] of Object.entries(this.attributes)) {
        rollData[k] = v.value;
      }
      for (const [k, v] of Object.entries(this.skills)) {
        rollData[k] = v.value;
      }
    }
    rollData.maxPush = FLBR.maxPushMap[this.system.nature] ?? 1;
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
      case ACTOR_TYPES.VEHICLE: this._prepareVehicleData(); break;
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
      const capacity = this.system[cap];
      const capData = FLBR.capacitiesMap[cap];
      // Proceeds if it exists in the character.
      if (capacity && capData) {
        // Gets the nature modifier.
        const natureModifier = FLBR.natureModifierMap[this.system.nature]?.[cap] ?? 0;
        // Gets any permanent loss.
        const permanentLoss = capacity.permanentLoss ?? 0;

        let max = 0;
        // Sums all specified attributes.
        for (const attribute of capData.attributes) {
          max += this.getAttribute(attribute);
        }

        // Performs some maths.
        max = Math.ceil(max / 4) + natureModifier + capacity.mod + permanentLoss;

        // Adds the modifiers from items.
        max += this.getRollModifiers({ targets: [cap] })
          .reduce((tot, m) => tot + m.value, 0);

        // Clamps within margins defined in the config.
        max = Math.clamped(max, 0, capData.max);

        // Records the value in the actor data.
        capacity.max = max;
        if (capacity.value > max) {
          capacity.value = max;
          // this.updateSource({ [`system.${cap}.value`]: max });
        }
        capacity.ratio = capacity.value / capacity.max;
      }
    }
  }

  /* ----------------------------------------- */
  /*  Data Preparation                         */
  /*   → Vehicle                               */
  /* ----------------------------------------- */

  /** @private */
  _prepareVehicleData() {
    this._prepareHull();
    this._prepareCrew();
  }

  /* ----------------------------------------- */

  /** @private */
  _prepareHull() {
    const hull = this.system.hull;
    if (hull.value > hull.max) {
      hull.value = hull.max;
      this.updateSource({ 'system.hull.value': hull.max });
    }
  }

  /* ----------------------------------------- */

  /** @private */
  _prepareCrew() {
    // Creates the crew collection if it does not exist yet.
    if (!Object.hasOwn(this, 'crew')) {
      const c = new CrewCollection(
        this,
        'system.crew',
        'system.passengers',
      );
      Object.defineProperty(this, 'crew', {
        value: c,
        writable: false,
      });
    }

    // Cleanses the source array of old entries.
    const [, updatedCrew] = this.system.crew.partition(c => game.actors.has(c.id));
    if (this.system.crew.length !== updatedCrew.length) {
      this.updateSource({ 'system.crew': updatedCrew });
    }

    // Updates the crew collection (builds actors).
    this.crew.update();
  }

  /* ----------------------------------------- */
  /*  Crew Management (Vehicles only)          */
  /* ----------------------------------------- */

  /**
   * Adds an actor to the vehicle's crew.
   * @param {BladeRunnerActor} actor The actor to add to the crew
   *   (its ID is used, and its MVR is updated)
   * @returns {Promise.<VehicleOccupant[]>} The crew
   */
  async addVehicleOccupant(actor) {
    if (this.type !== ACTOR_TYPES.VEHICLE) return;
    if (this.crew.full) return;

    /** @type {VehicleOccupant} */
    const occupant = {
      id: actor.id,
    };

    const crew = this.system.crew;
    crew.push(occupant);
    await this.update({ 'system.crew': crew });

    if (game.settings.get(SYSTEM_ID, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_CREW)) {
      await actor.updateCharacterManeuverability(this.system.maneuverability);
    }

    return crew;
  }

  /* ----------------------------------------- */

  /**
   * Removes an actor from the vehicle's crew.
   * @param {string} occupantId The id of the actor to remove from the crew
   * @returns {Promise.<VehicleOccupant[]>} The crew
   */
  async removeVehicleOccupant(occupantId) {
    if (this.type !== ACTOR_TYPES.VEHICLE) return;

    const crew = this.system.crew.filter(c => c.id !== occupantId);
    await this.update({ 'system.crew': crew });

    if (game.settings.get(SYSTEM_ID, SETTINGS_KEYS.UPDATE_ACTOR_MANEUVERABILITY_ON_UNCREW)) {
      await game.actors.get(occupantId)?.updateCharacterManeuverability(0);
    }

    return crew;
  }

  /* ----------------------------------------- */

  /**
   * Updates the character's maneuverability (MVR) with a new value.
   * @param {number} value New MVR value
   */
  async updateCharacterManeuverability(value) {
    if (this.type !== ACTOR_TYPES.CHAR) return;
    if (this.attributes[ATTRIBUTES.VEHICLE_MANEUVERABILITY]?.value !== value) {
      await this.updateSource({
        [`system.attributes.${ATTRIBUTES.VEHICLE_MANEUVERABILITY}.value`]: value,
      });
    }
  }

  /* ------------------------------------------- */
  /*  Roll Modifiers                             */
  /* ------------------------------------------- */

  /**
   * Gets all the modifiers from this actor's items.
   * @param {Object} options Filtering options
   * @returns {Array.<import('@components/item-modifier').default>} An array of Modifiers
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
    return +this.attributes?.[attributeKey]?.value;
  }

  /**
   * Gets the value of a specified skill.
   * @param {string} skillKey The identifier for the skill
   * @returns {number}
   */
  getSkill(skillKey) {
    return +this.skills?.[skillKey]?.value;
  }

  /* ------------------------------------------ */

  /**
   * Performs a roll with this actor.
   * @param {import('@components/roll/roller').RollHandlerData}    [rollData]
   * @param {import('@components/roll/roller').RollHandlerOptions} [options]
   * @param {string} [options.title] A custom title for the roll
   *   if you don't want to use the default
   * @returns {BRRollHandler} Rendered RollHandler FormApplication
   */
  async roll(rollData = {}, options = {}) {
    if (options.title) rollData.title = options.title;
    return BRRollHandler.create({
      title: game.i18n.localize('FLBR.SHEET_HEADER.GenericRoll'),
      actor: this,
      dice: [],
      modifiers: this.getRollModifiers(),
      maxPush: this.maxPush,
      ...rollData,
    }, {
      unlimitedPush: this.flags.bladerunner?.unlimitedPush,
      ...options,
    });
  }

  /* ------------------------------------------ */

  /**
   * Rolls a stat (attribute/skill) for this actor.
   * @param {string}   attributeKey   The identifier for the attribute
   * @param {?string}  skillkey       The identifier for the skill
   * @param {Object}  [options={}]    Additional options
   * @param {string}  [options.title] Custom title
   * @returns {Promise.<BRRollHandler>} Rendered RollHandler FormApplication
   */
  async rollStat(attributeKey, skillKey, options = {}) {
    if (!attributeKey) {
      return this.roll(null, options);
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
      unlimitedPush: this.flags.bladerunner?.unlimitedPush,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */

  /**
   * Rolls the actor's empathy and marks a permanent loss in resolve if a bane was rolled.
   * @returns {Promise.<number>} Quantity of resolve permanently lost, or 0
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

    const msg = await roller.executeRoll();
    const roll = msg.rolls[0];

    if (roll.baneCount) {
      ui.notifications.info(game.i18n.format('FLBR.ROLLER.ResolveTestFailed', {
        name: this.name,
      }), {
        permanent: true,
      });
      let loss = +this.system.resolve.permanentLoss;
      loss--;
      await this.update({ 'system.resolve.permanentLoss': loss });
      return loss;
    }
    return 0;
  }

  /* ------------------------------------------ */

  /**
   * Applies damage to one capacity of the actor (usually health).
   * @param {number}  damage             Quantity of damage
   * @param {string} [capacity='health'] Capacity to damage
   * @returns {BladeRunnerActor} this
   * @async
   */
  async applyDamage(damage, capacity = 'health') {
    if (damage <= 0) return;
    if (!(capacity in this.system)) {
      throw new Error(`FLBR | BladeRunnerActor.applyDamage → Non-existent capacity "${capacity}"`);
    }

    const initialDamage = damage;

    // Rolls all armors, if any, and reduces damage, if success(es) were obtained.
    let armorAblation = 0;
    /** @type {Array.<import('@item/item-document').default>} */
    const armors = this.itemTypes[ITEM_TYPES.ARMOR].filter(i => i.qty > 0);
    for (const armor of armors) {
      const rollMessage = await armor.roll();
      armorAblation += rollMessage?.rolls[0]?.successCount ?? 0;
    };

    damage -= armorAblation;

    if (damage > 0) {
      const max = this.system[capacity].max;
      const oldVal = this.system[capacity].value;
      const newVal = Math.clamped(oldVal - damage, 0, max);
      const diff = newVal - oldVal;

      if (diff !== 0) await this.update({ [`system.${capacity}.value`]: newVal });
    }

    // Prepares the chat message.
    const template = `systems/${SYSTEM_ID}/templates/actor/actor-damage-chatcard.hbs`;
    const content = await renderTemplate(template, {
      name: this.name,
      initialDamage,
      damage,
      deflectedDamage: initialDamage - damage,
      armored: !!armors.length,
      broken: this.isBroken,
      config: CONFIG.BLADE_RUNNER,
    });
    const chatData = {
      content,
      sound: CONFIG.sounds.notification,
      speaker: ChatMessage.getSpeaker({ actor: this, token: this.token }),
      user: game.user.id,
    };
    ChatMessage.applyRollMode(chatData, game.settings.get('core', 'rollMode'));
    await ChatMessage.create(chatData);

    return this;
  }
}
