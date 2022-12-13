import { FLBR } from '@system/config';
import { ACTOR_TYPES, ITEM_TYPES, RANGES, SETTINGS_KEYS, SKILLS, SYSTEM_ID } from '@system/constants';
import Modifier from '@components/item-modifier';
import BRRollHandler from '@components/roll/roller';
import BladeRunnerDialog from '@components/dialog/dialog';
import ItemAction from '@components/item-action';
import ItemAttack from '@components/item-attack';

export default class BladeRunnerItem extends Item {

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  get qty() {
    return this.system.qty;
  }

  get isPhysical() {
    return FLBR.physicalItems.includes(this.type);
  }

  get isConsumable() {
    return typeof this.system.consumable !== 'undefined';
  }

  get isOffensive() {
    return !!this.system.attacks;
  }

  get melee() {
    if (!this.isOffensive) return false;
    const atk = this.attacks[0] || {};
    return atk.min === atk.max === RANGES.ENGAGED;
  }

  get rollable() {
    return !!this.system.actions;
  }

  get hasAttack() {
    return this.isOffensive && this.attacks.length > 0;
  }

  get hasAction() {
    return this.rollable && this.actions.length > 0;
  }

  get hasModifier() {
    if (!this.system.modifiers) return false;
    return !foundry.utils.isEmpty(this.system.modifiers);
  }

  /** 
   * The name with a quantity in parentheses.
   * @type {string}
   */
  get detailedName() {
    let str = '';
    if (this.qty > 1) str += `${this.qty}x `;
    str += this.name;
    return str;
  }

  get modifiersDescription() {
    if (!this.hasModifier) return undefined;

    const out = [];
    for (const m of Object.values(this.system.modifiers)) {
      if (m && m.name) {
        const [t, n] = m.name.split('.');
        let str = 'FLBR.';
        switch (t) {
          case 'attribute':
            str += `ATTRIBUTE.${n.toUpperCase()}`;
            break;
          case 'skill':
            str += `SKILL.${n.capitalize()}`;
            break;
          case 'capacity':
            str += `HEADER.${n.capitalize()}`;
            break;
        }
        str = game.i18n.localize(str);
        if (t === 'capacity') str += ' ' + Number(m.value) > 0 ? '+1' : '−1';
        else str += Number(m.value) > 0 ? '+' : '−';
        out.push(str);
      }
    }
    return out.join(', ');
  }

  /* ------------------------------------------- */

  static get CHAT_TEMPLATE() {
    const sysId = game.system.id || SYSTEM_ID;
    return `systems/${sysId}/templates/item/item-chatcard.hbs`;
  }

  /* ------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    // Prepares actions.
    if (this.system.actions) {
      const itemActions = [];
      // eslint-disable-next-line no-shadow
      for (const [id, { type, name }] of Object.entries(this.system.actions)) {
        itemActions.push({ id, type, name });
      }
      this.actions = itemActions;
    }

    // Prepares attacks.
    if (this.type === ITEM_TYPES.WEAPON || this.type === ITEM_TYPES.EXPLOSIVE) {
      const itemAttacks = [];
      for (const atk in this.system.attacks) {
        itemAttacks.push({
          id: atk,
          name: this.system.attacks[atk].name,
        });
      }
      this.attacks = itemAttacks;
    }
  }

  /* ------------------------------------------- */

  /**
   * Gets an array of modifiers in this item.
   * @param {Object}         [options]           Additional options to filter the returned array of modifiers
   * @param {string|string[]} options.targets    Filters modifiers based on plausible targets
   * @param {boolean}         options.onlyActive Filters modifiers based on their active status
   * @returns {Modifier[]}
   */
  getModifiers(options = {}) {
    const mods = Modifier.getModifiers(this, 'system.modifiers', options);
    return mods ?? [];
  }

  /* ------------------------------------------- */

  /**
   * Consumes 1 unit of the item's quantity.
   * @param {number} [qty=1] Quantity to consume
   * @returns {Promise.<number>} The real quantity consumed
   */
  async consumeUnit(qty = 1) {
    return this.modifyNumberedProperty('qty', -qty);
  }

  /* ------------------------------------------- */

  /**
   * Modifies a numbered property in the item.
   * @param {string}  key  Name of the property in `system` to change
   * @param {number}  mod  Modifier
   * @param {number} [min=0]        Minimum allowed
   * @param {number} [max=Infinity] Maximum allowed
   * @returns {Promise.<number>} The difference
   */
  async modifyNumberedProperty(key, mod, min = 0, max = Infinity) {
    const currentValue = +foundry.utils.getProperty(this.system, key);
    if (typeof currentValue !== 'number') return;
    const newValue = Math.clamped(currentValue + mod, min, max);
    await this.update({ [`system.${key}`]: newValue });
    return newValue - currentValue;
  }

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  /**
   * Rolls the item.
   * @returns {Promise.<BRRollHandler>} Rendered RollHandler FormApplication
   */
  async roll() {
    // Quantity consumption.
    if (this.system.consumable) {
      if (this.qty <= 0) {
        ui.notifications.error(
          game.i18n.format('WARNING.NoItemUnit', {
            name: this.name,
          }),
        );
        return;
      }
      const consumed = -await this.consumeUnit();
      ui.notifications.info(
        game.i18n.format('FLBR.ItemConsumeNotif', {
          name: this.name,
          qty: consumed,
        }),
      );
    }

    switch (this.type) {
      case ITEM_TYPES.ARMOR: return this._rollArmor();
      // ! Not this one below ↓
      // case ITEM_TYPES.EXPLOSIVE: return this._rollExplosive();
    }

    if (!this.rollable) return;

    // Gets the actor.
    let actor;
    if (this.actor?.type === ACTOR_TYPES.VEHICLE) {
      actor = await this.actor.crew.choose();
      if (!actor) return;
    }
    else {
      actor = this.actor;
    }

    // Gets the action.
    let actionId;
    if (this.actions.length > 1) {
      actionId = await BladeRunnerDialog.choose(
        this.actions.map(a => {
          const actData = this.system.actions[a.id];
          const itemAction = new ItemAction(actData.type, actData);
          return [a.id, itemAction.title];
        }),
        `${this.detailedName}: ${game.i18n.localize('FLBR.DIALOG.ChooseAction')}`,
      );
    }
    else {
      actionId = this.actions[0]?.id;
    }
    const action = this.system.actions[actionId];

    if (!action) {
      ui.notifications.warn('WARNING.NoItemAction', { localize: true });
      return;
    }

    if (action.type === ItemAction.Types.RUN_MACRO) {
      let macro = game.macros.get(action.macro);
      if (!macro) macro = game.macros.getName(action.macro);
      if (!macro) {
        ui.notifications.warn(
          game.i18n.format('WARNING.ItemActionMacroNotFound', {
            macro: action.macro,
          }),
        );
        return;
      }
      return macro.execute();
    }

    // Gets the attack.
    let attack;
    if (this.isOffensive) {
      let attackId;
      if (this.attacks.length > 1) {
        attackId = await BladeRunnerDialog.choose(
          this.attacks.map(a => {
            const atk = new ItemAttack(this.system.attacks[a.id]);
            return [a.id, atk.title];
          }),
          `${this.detailedName}: ${game.i18n.localize('FLBR.DIALOG.ChooseAttack')}`,
        );
      }
      else {
        attackId = this.attacks[0]?.id;
      }
      attack = this.system.attacks[attackId];
    }

    // Builds the roll handler.
    const attributeKey = action.attribute;
    const skillKey = action.skill;
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`) : null;
    const title = (this.actor ? `${this.actor.name}: ` : '')
      + `${this.detailedName} (${attributeName}${skillKey ? ` + ${skillName}` : ''})`
      + (attack ? ` → ${attack.name}` : '');
    const attributeValue = actor?.getAttribute(attributeKey);
    const skillValue = actor?.getSkill(skillKey);

    const targets = [];
    if (attributeKey) targets.push(attributeKey);
    if (skillKey) targets.push(skillKey);

    const dice = [];
    if (attributeValue) dice.push(attributeValue);
    if (skillValue) dice.push(skillValue);

    const modifiers = actor?.getRollModifiers({ targets }) ?? [];
    if (skillKey === SKILLS.FIREARMS) {
      modifiers.push(...Modifier.getRangedCombatModifiers());
    }

    const roller = new BRRollHandler({
      title, actor,
      attributeKey, skillKey, dice,
      items: [this],
      modifiers,
      maxPush: actor?.maxPush,
    }, {
      damage: attack?.damage,
      damageType: attack?.damageType,
      crit: attack?.crit,
      unlimitedPush: actor?.flags.bladerunner?.unlimitedPush,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */

  _rollArmor() { return this._rollSpecial(this.system.armor); }
  _rollExplosive() { return this._rollSpecial(this.system.blast); }

  async _rollSpecial(value) {
    const autoArmorRoll =
      this.type === ITEM_TYPES.ARMOR &&
      game.settings.get(game.system.id, SETTINGS_KEYS.AUTO_ARMOR_ROLL);

    const execute = autoArmorRoll || await Dialog.confirm({
      title: game.i18n.localize(`ITEM.Type${this.type.capitalize()}`),
      content: `<p>${this.name}</p>`,
    });
    if (!execute) return;

    const roller = new BRRollHandler({
      title: this.name,
      actor: this.actor,
      dice: [value, value],
      items: [this],
      maxPush: 0,
    });
    return roller.executeRoll();
  }

  /* ------------------------------------------ */

  // eslint-disable-next-line max-len
  /** @typedef {import('@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData').ChatMessageDataConstructorData} ChatMessageDataConstructorData */

  /**
   * Transforms an Item into a ChatMessage.
   * This function can either create the ChatMessage directly, or return the data object that will be used to create.
   * @param {ChatMessageDataConstructorData} [messageData]
   *   The data object to use when creating the message
   * @return {Promise.<ChatMessage|ChatMessageData>} A promise which resolves to the created ChatMessage entity
   *   if create is true
   *   or the Object of prepared chatData otherwise.
   * @async
   */
  async toMessage(messageData = {}, { rollMode, create = true } = {}) {
    // Renders the template with item data.
    const content = await renderTemplate(this.constructor.CHAT_TEMPLATE, {
      name: this.name,
      img: this.img,
      type: this.type,
      system: foundry.utils.duplicate(this.system),
      link: this.link,
      inActor: !!this.actor,
      showProperties: (this.type !== ITEM_TYPES.GENERIC || this.hasModifier),
      isOffensive: this.isOffensive,
      hasAttack: this.hasAttack,
      hasModifier: this.hasModifier,
      modifiersDescription: this.modifiersDescription,
      config: CONFIG.BLADE_RUNNER,
    });

    // Prepares chat data.
    messageData = foundry.utils.mergeObject({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      content,
      sound: CONFIG.sounds.notification,
    }, messageData);

    // Creates the message.
    const cls = getDocumentClass('ChatMessage');
    const msg = new cls(messageData);

    // Gets the default roll mode if undef.
    if (rollMode == undefined) rollMode = game.settings.get('core', 'rollMode');
    if (rollMode) msg.applyRollMode(rollMode);

    // Sends the messages or returns its data.
    if (create) return cls.create(msg);

    return msg.toObject();
  }
}
