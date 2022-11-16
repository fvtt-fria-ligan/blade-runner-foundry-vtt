import { FLBR } from '@system/config';
import { ITEM_TYPES, SETTINGS_KEYS, SKILLS, SYSTEM_ID } from '@system/constants';
import Modifier from '@components/item-modifier';
import BRRollHandler from '@components/roll/roller';
import BladeRunnerDialog from '@components/dialog/dialog';
import BladeRunnerActionChooserDialog from '@components/dialog/action-chooser-dialog';

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

  get isOffensive() {
    return !!this.system.attacks;
  }

  get rollable() {
    return this.type === ITEM_TYPES.ARMOR || !!this.system.actions;
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

  /** @override */
  prepareDerivedData() {
    // Prepares actions.
    if (this.rollable) {
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

  /* ------------------------------------------ */
  /*  Utility Functions                         */
  /* ------------------------------------------ */

  /**
   * Rolls the item.
   * @returns {Promise.<BRRollHandler>} Rendered RollHandler FormApplication
   */
  async roll() {
    switch (this.type) {
      case ITEM_TYPES.ARMOR: return this._rollArmor();
      // ! Not this one below ↓
      // case ITEM_TYPES.EXPLOSIVE: return this._rollExplosive();
    }

    if (!this.rollable) return;

    // Gets the action.
    let actionId;
    if (this.actions.length > 1) {
      actionId = await BladeRunnerDialog.actionChooser(
        this.actions,
        `${this.detailedName}: ${game.i18n.localize('FLBR.DIALOG.ChooseAction')}`,
      );
    }
    else {
      actionId = this.actions[0].id;
    }
    const action = this.system.actions[actionId];

    // Gets the attack.
    let attack;
    if (this.isOffensive) {
      let attackId;
      if (this.attacks.length > 1) {
        attackId = await BladeRunnerDialog.actionChooser(
          this.attacks,
          `${this.detailedName}: ${game.i18n.localize('FLBR.DIALOG.ChooseAttack')}`,
        );
      }
      else {
        attackId = this.attacks[0].id;
      }
      attack = this.system.attacks[attackId];
    }

    const attributeKey = action.attribute;
    const skillKey = action.skill;
    const attributeName = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
    const skillName = skillKey ? game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`) : null;
    const title = `${this.detailedName} (${attributeName}${skillKey ? ` & ${skillName}` : ''})`
      + (attack ? ` - ${attack.name}` : '');
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
      damage: attack?.damage,
      unlimitedPush: this.actor?.flags.bladerunner?.unlimitedPush,
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
      isOffensive: this.isOffensive,
      hasAttack: this.isOffensive && !foundry.utils.isEmpty(this.system.attacks),
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
