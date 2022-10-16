import { FLBR } from '@system/config';
import { ITEM_TYPES, SKILLS, SYSTEM_ID } from '@system/constants';
import Modifier from '@components/modifier';
import BRRollHandler from '@components/roll/roller';

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

  get damage() {
    return this.system.damage;
  }

  get isOffensive() {
    return typeof this.damage !== 'undefined';
  }

  get hasModifier() {
    if (!this.system.modifiers) return false;
    return !foundry.utils.isEmpty(this.system.modifiers);
  }

  get rollable() {
    return !!(this.system.rollable ?? false);
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
        }
        str = game.i18n.localize(str);
        str += ' ' + Number(m.value) > 0 ? '+' : '−';
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

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  /**
   * Rolls the item.
   * @returns {BRRollHandler} Rendered RollHandler FormApplication
   */
  roll() {
    switch (this.type) {
      case ITEM_TYPES.ARMOR: return this._rollArmor();
      // ! Not this one below ↓
      // case ITEM_TYPES.EXPLOSIVE: return this._rollExplosive();
    }

    if (!this.rollable) return;

    const attributeKey = this.system.attribute;
    const skillKey = this.system.skill;
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`) : null;
    const title = `${this.detailedName} (${attributeName}${skillKey ? ` & ${skillName}` : ''})`;
    const attributeValue = this.actor?.getAttribute(attributeKey);
    const skillValue = this.actor?.getSkill(skillKey);

    const targets = [];
    if (attributeKey) targets.push(attributeKey);
    if (skillKey) targets.push(skillKey);

    const dice = [];
    if (attributeValue) dice.push(attributeValue);
    if (skillValue) dice.push(skillValue);

    const modifiers = this.actor?.getRollModifiers({ targets }) ?? [];
    if (skillKey === SKILLS.FIREARMS) {
      modifiers.push(...Modifier.getRangedCombatModifiers());
    }

    const roller = new BRRollHandler({
      title,
      actor: this.actor,
      attributeKey, skillKey, dice,
      items: [this],
      modifiers,
      maxPush: this.actor?.maxPush,
    }, {
      unlimitedPush: this.actor?.flags.bladerunner?.unlimitedPush,
    });
    return roller.render(true);
  }

  /* ------------------------------------------ */

  _rollArmor() { return this._rollSpecial(this.system.armor); }
  _rollExplosive() { return this._rollSpecial(this.system.blast); }

  async _rollSpecial(value) {
    const execute = await Dialog.confirm({
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
  async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
    // Renders the template with item data.
    const content = await renderTemplate(this.constructor.CHAT_TEMPLATE, {
      name: this.name,
      img: this.img,
      type: this.type,
      system: this.system,
      link: this.link,
      inActor: !!this.actor,
      showProperties: (this.type !== ITEM_TYPES.GENERIC || this.hasModifier),
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

    // Sends the messages or returns its data.
    if (create) return cls.create(msg, { rollMode });
    if (rollMode) msg.applyRollMode(rollMode);

    return msg.toObject();
  }
}
