import { FLBR } from '@system/config';
import { ACTOR_SUBTYPES, ACTOR_TYPES, ATTRIBUTES,
  CAPACITIES, DAMAGE_TYPES, ITEM_TYPES, SETTINGS_KEYS, SKILLS, SYSTEM_ID } from '@system/constants';
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

  get isVehicle() {
    return this.type === ACTOR_TYPES.VEHICLE;
  }

  /**
   * Whether this actor is broken or wrecked.
   * @type {boolean}
   * @readonly
   */
  get isBroken() {
    switch (this.type) {
      case ACTOR_TYPES.CHAR:
        for (const cap of Object.values(CAPACITIES)) {
          const capacity = this.system[cap];
          if (capacity && capacity.value <= 0) return true;
        }
        return false;
      case ACTOR_TYPES.VEHICLE:
        return this.system.hull.value <= 0;
      default:
        return undefined;
    }
  }

  get maxPush() {
    switch (this.type) {
      case ACTOR_TYPES.CHAR:
        return this.system.subtype === ACTOR_SUBTYPES.PC ? FLBR.maxPushMap[this.system.nature] : 0;
      default:
        return 1;
    }
  }

  get armored() {
    switch (this.type) {
      case ACTOR_TYPES.CHAR:
        return this.itemTypes[ITEM_TYPES.ARMOR].filter(i => i.qty > 0).length;
      case ACTOR_TYPES.VEHICLE:
        return this.system.armor > 0;
      default:
        return false;
    }
  }

  /**
   * The health bar (bar1) CSS color code according to the actor's health value.
   * Based on the calculation made in the Token document.
   * @type {string}
   * @readonly
   */
  get healthBarColor() {
    const pct = this.system.health?.ratio;
    return foundry.utils.Color.fromRGB([
      1 - (pct / 2),
      pct,
      0,
    ]).css;
  }

  /**
   * The resolve bar (bar2) CSS color code according to the actor's resolve value.
   * Based on the calculation made in the Token document.
   * @type {string}
   * @readonly
   */
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
    const updatedCrew = this.system.crew.filter(p => game.actors.has(p.id));
    if (updatedCrew.length !== this.system.crew.length) {
      this.updateSource({ 'system.crew': updatedCrew });
    }

    // Updates the crew collection (builds actors).
    this.crew.update();
  }

  /* ----------------------------------------- */
  /*  Actor Creation                           */
  /* ----------------------------------------- */

  /** @override */
  async _preCreate(data, options, userId) {
    await super._preCreate(data, options, userId);

    const updateData = {
      'prototypeToken.displayName': CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    };

    switch (this.type) {
      case ACTOR_TYPES.CHAR:
        updateData['prototypeToken.displayBars'] = CONST.TOKEN_DISPLAY_MODES.OWNER;
        if (!this.system.attributes || !this.system.skills) {
          throw new TypeError(`FLBR | "${this.type}" has No attribute nor skill`);
        }
        if (foundry.utils.isEmpty(this.system.skills)) {
          // Sets the default starting value for each attribute.
          for (const attribute in this.system.attributes) {
            updateData[`system.attributes.${attribute}.value`] = FLBR.startingAttributeLevel;
          }
          // Builds the list of skills and sets their default values.
          for (const skill in FLBR.skillMap) {
            updateData[`system.skills.${skill}.value`] = FLBR.startingSkillLevel;
          }
        }
        break;
      case ACTOR_TYPES.VEHICLE:
        updateData['prototypeToken.displayBars'] = CONST.TOKEN_DISPLAY_MODES.OWNER;
        updateData['prototypeToken.bar1.attribute'] = 'hull';
        // updateData['prototypeToken.bar2.attribute'] = null;
        updateData.img = `systems/${SYSTEM_ID}/assets/icons/steering-wheel.svg`;
        break;
      case ACTOR_TYPES.LOOT:
        // updateData['prototypeToken.bar1.attribute'] = null;
        updateData.img = `systems/${SYSTEM_ID}/assets/icons/cardboard-box-closed.svg`;
        break;
    }
    if (!foundry.utils.isEmpty(updateData)) {
      await this.updateSource(updateData);
    }
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
    if (!this.isVehicle) return;
    if (this.crew.full) return;
    if (this.crew.has(actor.id)) {
      return ui.notifications.info('FLBR.VEHICLE.NotifPassengerAlreadyPresent', { localize: true });
    }

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
    if (!this.isVehicle) return;

    const crew = this.system.crew.filter(p => p.id !== occupantId);
    if (crew.length !== this.system.crew.length) {
      await this.update({ 'system.crew': crew });
    }

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
  /*  Utility Methods                           */
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

  /**
   * Kills the actor, reducing its HP to 0.
   * @returns {Promise.<void>}
   */
  async kill() {
    let capacity;
    switch (this.type) {
      case ACTOR_TYPES.CHAR: capacity = 'health'; break;
      case ACTOR_TYPES.VEHICLE: capacity = 'hull'; break;
      default: return;
    }
    await this.update({ [`system.${capacity}.value`]: 0 });
  }

  /* ------------------------------------------ */
  /*  Roll Methods                              */
  /* ------------------------------------------ */

  /**
   * Performs a roll with this actor.
   * @param {import('@components/roll/roller').RollHandlerData}    [rollData]
   * @param {import('@components/roll/roller').RollHandlerOptions} [options]
   * @param {string} [options.title] A custom title for the roll
   *   if you don't want to use the default
   * @returns {Promise.<BRRollHandler>} Rendered RollHandler FormApplication
   */
  async roll(rollData = {}, options = {}) {
    if (options.title) rollData.title = options.title;
    if (!rollData.title) rollData.title = `${this.name}: ${game.i18n.localize('FLBR.SHEET_HEADER.GenericRoll')}`;
    if (!rollData.modifiers) rollData.modifiers = this.getRollModifiers();
    const roller = new BRRollHandler({
      actor: this,
      dice: [],
      maxPush: this.maxPush,
      ...rollData,
    }, {
      unlimitedPush: this.flags.bladerunner?.unlimitedPush,
      ...options,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */
  /*  Roll Methods for Characters               */
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

    let title = `${this.name}: `;
    if (options.title) title = options.title;
    else if (skillName) title += `${skillName} (${attributeName})`;
    else title += attributeName;

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
  /*  Roll Methods for Vehicles                 */
  /* ------------------------------------------ */

  /**
   * Rolls a ramming attack with an actor of this vehicle.
   */
  async rollRamming() {
    if (!this.isVehicle) return;

    const actor = await this.crew.choose();
    if (!actor) return;

    const driving = FLBR.vehicleSkill;
    const hullDamage = Math.ceil(this.system.hull.max / 2);

    return this.roll({
      title: `${this.name} | ${actor.name}: `
        + `${game.i18n.localize('FLBR.VEHICLE.Action.Ramming')} `
        + `(${game.i18n.localize(`FLBR.SKILL.${driving.capitalize()}`)})`,
      actor: actor,
      attributeKey: FLBR.vehicleAttribute,
      skillKey: driving,
      dice: [this.system.maneuverability, actor.skills[driving]?.value],
      modifiers: [...this.getRollModifiers(), ...actor.getRollModifiers()],
      maxPush: actor.maxPush,
    }, {
      damage: hullDamage,
      damageType: DAMAGE_TYPES.CRUSHING,
      crit: Math.max(12, hullDamage * 2),
      unlimitedPush: this.flags.bladerunner?.unlimitedPush || actor.flags.bladerunner?.unlimitedPush,
    });
  }

  /* ------------------------------------------ */
  /*  Methods for Damage Control                */
  /* ------------------------------------------ */

  /**
   * Applies damage to one capacity of the actor (usually health).
   * @param {number}   damage               Quantity of damage
   * @param {Object}  [options]             Additional options
   * @param {string}  [options.capacity]    Capacity to damage
   * @param {boolean} [options.ignoreArmor] Whether to ignore the armor roll
   * @returns {Promise.<this>}
   * @async
   */
  async applyDamage(damage, { capacity, ignoreArmor } = {}) {
    if (!capacity) {
      switch (this.type) {
        case ACTOR_TYPES.CHAR: capacity = 'health'; break;
        case ACTOR_TYPES.VEHICLE: capacity = 'hull'; break;
        default: return this;
      }
    }
    return this._applyDamage(damage, capacity, ignoreArmor);
  }

  /* ------------------------------------------ */

  /**
   * @see {BladeRunnerActor.applyDamage}
   * @param {number}   damage
   * @param {string}   capacity
   * @param {boolean} [ignoreArmor=false]
   * @returns {Promise.<this>}
   */
  async _applyDamage(damage, capacity, ignoreArmor = false) {
    if (damage <= 0) return;
    if (!(capacity in this.system)) {
      throw new Error(`FLBR | BladeRunnerActor.applyDamage → Non-existent capacity "${capacity}"`);
    }

    const initialDamage = damage;

    if (!ignoreArmor && this.armored) {
      damage -= await this.getArmorAblation();
    }

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
      armored: this.armored,
      broken: this.isBroken,
      vroom: this.isVehicle,
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

  /* ------------------------------------------ */

  /**
   * Rolls the actor's armor and returns the ablation value.
   * @returns {Promise.<number>}
   */
  async getArmorAblation() {
    let armorAblation = 0;

    // For characters:
    if (this.type === ACTOR_TYPES.CHAR) {
      // Rolls all armors, if any, and reduces damage, if success(es) were obtained.
      /** @type {Array.<import('@item/item-document').default>} */
      const armors = this.itemTypes[ITEM_TYPES.ARMOR].filter(i => i.qty > 0);
      for (const armor of armors) {
        const rollMessage = await armor.roll();
        if (rollMessage) {
          if (game.dice3d && game.dice3d.isEnabled()) await game.dice3d.waitFor3DAnimationByMessageID(rollMessage.id);
          armorAblation += rollMessage.rolls[0].successCount ?? 0;
        }
      };
    }
    // For vehicles:
    else if (this.isVehicle) {
      const armorRoll = Roll.create(`2d${this.system.armor}p0`, {}, {
        name: `${this.name}: ${game.i18n.localize('FLBR.ItemArmor')}`,
        yzur: true,
      });
      await armorRoll.roll({ async: true });
      const armorRollMessage = await armorRoll.toMessage();
      if (game.dice3d && game.dice3d.isEnabled()) await game.dice3d.waitFor3DAnimationByMessageID(armorRollMessage.id);
      armorAblation = armorRoll.successCount;
    }
    return armorAblation;
  }

  /* ------------------------------------------ */
  /*  Vehicle Crashes & Explosions              */
  /* ------------------------------------------ */

  /**
   * Crashes the vehicle, inflicting damage to the crew.
   * @param {boolean} [massive=false] Whether the crash is massive (more damage)
   * @returns {Promise.<this>} The crashed vehicle Actor
   */
  async crashVehicle(massive = false) {
    if (!this.isVehicle) return;

    let formula = massive ? FLBR.vehicleMassiveCrashDamage : FLBR.vehicleCrashDamage;

    const toCrash = await Dialog.confirm({
      title: `${this.name}: ${game.i18n.localize('FLBR.VEHICLE.Action.Crash')}`,
      content: game.i18n.format('FLBR.VEHICLE.Action.CrashDialog', {
        damage: `<code>${formula}</code>`,
      }),
    });
    if (!toCrash) return;

    // Rolls the vehicle's armor ablation.
    const armorAblation = this.armored ? await this.getArmorAblation() : 0;

    // Rolls the quantity of crash damage.
    const rollData = this.rollData;
    rollData.armor = armorAblation;
    formula += ' - @armor';
    const crashDamageRoll = Roll.create(formula, rollData, {
      name: `${this.name}: ${game.i18n.localize('FLBR.VEHICLE.Action.Crash')}`,
    });
    await crashDamageRoll.roll({ async: true });
    const crashDamageRollMessage = await crashDamageRoll.toMessage({
      flavor: `${game.i18n.localize('FLBR.VEHICLE.Action.Crash')}: ${formula}`,
    });
    if (game.dice3d && game.dice3d.isEnabled()) {
      await game.dice3d.waitFor3DAnimationByMessageID(crashDamageRollMessage.id);
    }
    const crashDamage = crashDamageRoll.total;

    // Inflicts crash damage to each passenger.
    if (crashDamage > 0 && game.settings.get(SYSTEM_ID, SETTINGS_KEYS.AUTO_APPLY_DAMAGE)) {
      for (const passenger of this.crew) {
        const attributeKey = ATTRIBUTES.AGILITY;
        const skillKey = SKILLS.MOBILITY;
        const mitigationRoll = await BRRollHandler.waitForRoll({
          title: `${this.name} | ${passenger.name}: Crash Damage Mitigation (MOBILITY)`,
          actor: passenger,
          attributeKey, skillKey,
          dice: [passenger.attributes[attributeKey].value, passenger.skills[skillKey].value],
          modifiers: [...passenger.getRollModifiers()],
          maxPush: 0,
        }, {
          disabledPush: true,
        }).catch(err => console.warn(err));

        const mitigation = mitigationRoll?.successCount || 0;
        await passenger.applyDamage(crashDamage - mitigation, { ignoreArmor: true });
      }
    }

    // Crashes the vehicle.
    await this.kill();
    return this;
  }

  /* ------------------------------------------ */

  /**
   * Explodes the vehicle, inflicting damage to the crew.
   * @returns {Promise.<this>} The exploded vehicle Actor
   */
  async explodeVehicle() {
    if (!this.isVehicle) return;

    const toExplode = await Dialog.confirm({
      title: `${this.name}: ${game.i18n.localize('FLBR.VEHICLE.Action.Explode')}`,
      content: game.i18n.localize('FLBR.VEHICLE.Action.ExplodeHint'),
    });
    if (!toExplode) return;

    const blastPower = FLBR.vehicleExplosionBlastPower;
    const blast = FLBR.blastPowerMap[FLBR.vehicleExplosionBlastPower];

    /** @type {import('yzur').YearZeroRoll} */
    const damageType = DAMAGE_TYPES.PIERCING;
    const blastRoll = Roll.create(`2d${blastPower}p0`, {}, {
      damage: blast.damage,
      damageType,
      damageTypeName: game.i18n.localize(FLBR.damageTypes[damageType]),
      crit: blast.crit,
      yzur: true,
    });
    await blastRoll.roll({ async: true });
    const blastRollMessage = await blastRoll.toMessage({
      flavor: game.i18n.localize('FLBR.VEHICLE.Action.Explode'),
    });
    if (game.dice3d && game.dice3d.isEnabled()) await game.dice3d.waitFor3DAnimationByMessageID(blastRollMessage.id);

    // Inflicts blast damage to each passenger.
    if (blastRoll.successCount > 0 && game.settings.get(SYSTEM_ID, SETTINGS_KEYS.AUTO_APPLY_DAMAGE)) {
      const damage = blast.damage + (blastRoll.successCount - 1) + 1;
      for (const passenger of this.crew) {
        await passenger.applyDamage(damage);
      }
    }

    // Explodes the vehicle.
    await this.kill();
    return this;
  }
}
