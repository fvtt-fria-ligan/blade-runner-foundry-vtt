import { YearZeroRoll } from '@lib/yzur';
import { FLBR } from '@system/config';
import { ITEM_TYPES, SYSTEM_NAME } from '@system/constants';

/**
 * A Form Application that mimics Dialog,
 * but provides more functionality in terms of data binds and handling of a roll object.
 * Supports Forbidden Lands standard rolls and spell rolls.
 * @see Dialog
 * @extends {FormApplication}
 */
export default class BRRollHandler extends FormApplication {
  /**
   * @param {string}              [title]        The title of the roll
   * @param {Actor}               [actor={}]     The actor who rolled the dice, if any
   * @param {Item|Item[]}         [items]        The item(s) used to roll the dice, if any
   * @param {string}              [attributeKey] The identifier of the attribute used (important for modifiers)
   * @param {string}              [skillKey]     The identifier of the skill used (important for modifiers)
   * @param {number|number[]}     [dice=[6]]     An array of die faces used to forge the roll
   * @param {number}              [modifier]     Additional value for the final numeric modifier
   * @param {Modifier|Modifier[]} [modifiers]    A group of modifiers that can also be applied to the roll
   * @param {number}              [maxPush=1]    The maximum number of pushes (default is 1)
   * @param {Object}  [options] Additional options for the FormApplication instance
   * @param {boolean} [options.sendMessage=true]    Whether the message should be sent
   * @param {boolean} [options.unlimitedPush=false] Whether to allow unlimited roll pushes
   */
  constructor({
    title = 'Blade Runner RPG',
    actor = {},
    items = [],
    attributeKey = null,
    skillKey = null,
    dice = [6],
    modifier = 0,
    modifiers = [],
    maxPush = 1,
  }, options = {}) {
    super({}, options);

    /** 
     * The title of the roll.
     * @type {string}
     */
    this.title = title;

    /** @typedef {import('@actor/actor-document').default} BladeRunnerActor */

    /**
     * The actor who rolled the dice.
     * @type {BladeRunnerActor}
     */
    this.actor = actor;

    /** @typedef {import('@item/item-document').default} BladeRunnerItem */

    /**
     * The item(s) used to roll the dice.
     * @type {BladeRunnerItem[]}
     */
    this.items = !Array.isArray(items) ? [items] : items;

    /**
     * The first item used to roll the dice.
     * @type {BladeRunnerItem}
     */
    this.item = this.items[0];

    /**
     * The attribute's key.
     * @type {string}
     */
    this.attributeKey = attributeKey;

    /**
     * The attribute's key.
     * @type {string}
     */
    this.skillKey = skillKey;

    /** @typedef {import('@system/modifier').default} Modifier */

    /**
     * A group of modifiers that can also be applied to the roll.
     * @type {Modifier[]>}
     */
    this.modifiers = !Array.isArray(modifiers) ? [modifiers] : modifiers;
    if (this.items.length > 0) {
      this.modifiers.push(...this.items.flatMap(i => i.getModifiers({ targets: [attributeKey, skillKey] })));
    }

    /**
     * Additional value for the final numeric modifier.
     * @type {number}
     */
    this._modifier = modifier;

    /**
     * An array of die faces used to forge the roll.
     * @type {number[]}
     */
    this.dice = !Array.isArray(dice) ? [dice] : dice;

    /**
     * The roll in this FormApplication.
     * @type {YearZeroRoll}
     */
    this.roll = {};

    /**
     * The maximum number of pushes (default is 1).
     * @type {number}
     */
    this.maxPush = maxPush ?? 1;

    /**
     * Quantity of damage brought with this roll.
     * @type {number}
     */
    this.damage = options.damage;

    this.options.sendMessage = options.sendMessage ?? true;
    this.options.unlimitedPush = options.unlimitedPush ?? false;
  }

  /* ------------------------------------------ */

  /** @override */
  get title() { return this.options.title; };
  set title(str) { this.options.title = str; }

  /**
   * The final numeric modifier.
   * @type {number}
   */
  get modifier() {
    return this._modifier + this.modifiers.reduce((sum, m) => sum + (m.active ? m.value : 0), 0);
  }

  set modifier(val) {
    this._modifier = val;
  }

  get advantage() {
    return this.dice.length > 2 || this.modifier > 0;
  }

  get disadvantage() {
    return this.dice.length < 2 || this.modifier < 0;
  }

  get isAttack() {
    return !!this.damage || [ITEM_TYPES.WEAPON, ITEM_TYPES.EXPLOSIVE].includes(this.item?.type);
  }

  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysName, 'roll-application'],
      width: '450',
      // height: '450',
      resizable: false,
    });
  }

  /** @override */
  get template() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return this.options.template || `systems/${sysName}/templates/components/roll/roller.hbs`;
  }

  /* ------------------------------------------ */
  /*  Data Preparation                          */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    return {
      title: this.title,
      dice: this.dice,
      maxPush: this.maxPush,
      modifier: this.modifier >= 0 ? `+${this.modifier}` : this.modifier,
      modifiers: this.modifiers,
      advantage: this.disadvantage ? false : this.advantage,
      disadvantage: this.advantage ? false : this.disadvantage,
      attributeKey: this.attributeKey,
      skillKey: this.skillKey,
      rollMode: game.settings.get('core', 'rollMode'),
      // damage: this.damage,
      // attack: this.isAttack,
      // roll: this.roll,
      config: CONFIG.BLADE_RUNNER,
      options,
    };
  }

  /* ------------------------------------------ */

  /**
   * Generates Speaker data based on the actor passed in the FormApplication.
   * @returns {{ alias: string, actor: string, token: string, scene: string }}
   */
  createSpeaker() {
    return {
      alias: this.options.alias || this.actor?.name,
      actor: this.options.actorId || this.actor?.id,
      token: this.options.tokenId || this.actor?.token?.id,
      scene: this.options.sceneId || this.actor?.token?.parent.id,
    };
  }

  /* ------------------------------------------ */
  /*  Static Methods                            */
  /* ------------------------------------------ */

  /**
   * Creates a Blade Runner Roll Handler FormApplication.
   * @see {@link BRRollHandler} constructor
   * @param {Object} [data]
   * @param {Object} [options]
   * @returns {BRRollHandler} Rendered instance of this FormApplication
   * @static
   */
  static create(data = {}, options = {}) {
    return new this(data, options).render(true);
  }

  /**
   * Guesses the correct Actor making a roll.
   * @param {Object}  data        Object containing id references to the character making a roll
   * @param {string}  data.actor  ID of the actor
   * @param {string} [data.scene] ID of the scene
   * @param {string} [data.token] ID of its token
   * @returns {Actor}
   */
  static getSpeaker({ actor, scene, token }) {
    if (scene && token) return game.scenes.get(scene)?.tokens.get(token)?.actor;
    return game.actors.get(actor);
  }

  /* ------------------------------------------ */
  /*  Form Validation                           */
  /* ------------------------------------------ */

  /**
   * Foundry override **REQUIRED by FormApplications**.
   * This method handles the data that is derived from the FormApplication on a submit event.
   * Not overriding this method will result in a thrown error.
   * @description In this method we pass the formData onto the correct internal rollHandler.
   * @param {JQueryEventConstructor} event
   * @param {Object.<string|null>}   formData
   * @returns private RollHandler
   * @override Required
   * @async
   */
  async _updateObject(event, formData) {
    this._validateForm(event, formData);
    return this._handleFormData(event, formData);
  }

  /* ------------------------------------------ */

  /**
   * Validates whether a form is empty and contains a valid artifact string (if any).
   * @param {JQueryEventConstructor} event
   * @param {Object.<string|null>}   formData
   * @returns {boolean} `true` when OK
   * @throws {Error} When formData or dice is empty
   */
  _validateForm(event, formData) {
    const nok = foundry.utils.isObjectEmpty(formData)
      || !this.dice.length
      || this.dice.includes('0')
      || !['roll', 'advantage', 'disadvantage'].includes(event.submitter.id);
    if (nok) {
      const msg = game.i18n.localize('WARNING.NoDiceInput');
      ui.notifications.warn(msg);
      throw new Error(msg);
    }
    return true;
  }

  /* ------------------------------------------ */

  _handleFormData(event, formData) {
    this.options.rollMode = formData.rollMode;
    const modifier = this._handleModifier(event.submitter.id);
    return this.executeRoll(modifier);
  }

  _handleModifier(buttonId) {
    switch (buttonId) {
      case 'roll': return 0;
      case 'advantage':
        if (this.dice.length > 2) return 0;
        return 1;
      case 'disadvantage':
        if (this.dice.length < 2) return 0;
        return -1;
    }
    return this.modifier;
  }

  /* ------------------------------------------ */
  /*  Roll Creation (YZUR)                      */
  /* ------------------------------------------ */

  getRollOptions() {
    const speaker = this.createSpeaker();
    const unlimitedPush = this.options.unlimitedPush;
    return {
      name: this.title,
      maxPush: unlimitedPush ? 1000 : this.maxPush,
      // type: this.options.type,
      attributeKey: this.attributeKey,
      alias: speaker.alias,
      actorId: speaker.actor,
      actorType: this.options.actorType || this.actor?.type,
      tokenId: speaker.token,
      sceneId: speaker.scene,
      // chance: this.spell.chance,
      // isAttack: this.isAttack,
      // consumable: this.options.consumable,
      damage: this.damage,
      item: this.item?.name || this.items.map(i => i.name),
      itemId: this.item?.id || this.items.map(i => i.id),
      yzur: true,
    };
  }

  /* ------------------------------------------ */

  async executeRoll(modifier) {
    if (modifier) {
      const min = Math.min(...this.dice);
      if (modifier > 0) this.dice.push(min);
      else this.dice = this.dice.filter(d => d !== min);
    }
    const dice = this.dice.map(d => { return { term: `${d}`, number: 1 }; });
    this.roll = YearZeroRoll.forge(dice, {}, this.getRollOptions());

    await this.roll.roll({ async: true });

    if (this.options.sendMessage) {
      return this.roll.toMessage({
        speaker: this.createSpeaker(),
      }, {
        rollMode: this.options.rollMode,
      });
    }
    return this.roll;
  }

  /* ------------------------------------------ */
  /*  Roll <-> Chat Methods                     */
  /* ------------------------------------------ */

  /**
   * Handles the push of a roll in a chat message and updates the actor according to the banes rolled.
   * @param {ChatMessage} message           The message that contains the roll to push.
   * @param {boolean}    [sendMessage=true] Whether to send the pushed roll in a message.
   * @returns {Promise.<ChatMessage|YearZeroRoll>}
   * @static
   * @async
   */
  static async pushRoll(message, { sendMessage = true } = {}) {
    if (!message || !message.roll) return;

    /** @type {YearZeroRoll} */
    const roll = message.roll.duplicate();
    await roll.push({ async: true });

    const speakerData = message.data.speaker;
    const speaker = this.getSpeaker(speakerData);
    if (speaker) await this.updateActor(roll, speaker);

    await message.delete();
    if (sendMessage) return roll.toMessage({ speaker: speakerData });
    return roll;
  }

  /* ------------------------------------------ */

  /**
   * Handles cancellation .
   * @param {ChatMessage} message The message that contains the roll
   * @returns {Promise.<ChatMessage>} The updated message
   */
  static async cancelPush(message) {
    if (!message || !message.roll) return;
    /** @type {YearZeroRoll} */
    const roll = message.roll.duplicate();
    roll.maxPush = 0;
    await message.update({ roll: roll.toJSON() });
    return message;
  }

  /* ------------------------------------------ */
  /*  Update Actors after roll push             */
  /* ------------------------------------------ */

  /**
   * Handles health and resolve damage to the actor.
   * @param {YearZeroRoll} roll
   * @param {ActorData} speaker
   */
  static async updateActor(roll, speaker) {
    if (roll.baneCount) await this.applyDamage(roll, speaker);
  }

  /**
   * Applies health and resolve damage to the actor.
   * @param {YearZeroRoll} roll (destructured)
   * @param {ActorData} speaker
   * @returns {Promise.<number>} Remaining capacity value
   */
  static async applyDamage({ attributeTrauma, options: { attributeKey, damage } }, speaker) {
    const currentDamage = attributeTrauma; // TODO damage from weapon

    const nature = speaker?.nature;
    if (!nature) {
      return ui.notifications.error('WARNING.ApplyDamageNoNature', { localize: true });
    }

    // The nature & attribute key define which ActorCapacity (health or resolve) is affected.
    const cap = FLBR.pushTraumaMap[nature]?.[attributeKey];
    if (!cap) {
      console.error(`FLBR | ApplyDamageNoCapacityKey → nature: ${nature}, attributeKey: ${attributeKey}`);
      return ui.notifications.error('WARNING.ApplyDamageNoCapacityKey', { localize: true });
    }

    /** @type {import('@actor/actor-document').ActorCapacity} */
    const capacity = speaker?.data.data[cap];
    if (!capacity || foundry.utils.isObjectEmpty(capacity)) {
      return ui.notifications.error('WARNING.ApplyDamageNoActorCapacity', { localize: true });
    }

    // TODO await this.modifyWillpower(speaker, currentDamage)

    // eslint-disable-next-line prefer-const
    let { value, max } = capacity;
    value = Math.clamped(value - currentDamage, 0, max);

    if (value === 0) {
      ui.notifications.info('FLBR.YouAreBroken', { localize:true });
    }

    await speaker.update({ [`data.${cap}.value`]: value });
    return value;
  }

  /* ------------------------------------------ */
  /*  Form Listeners                            */
  /* ------------------------------------------ */

  /**
   * @param {JQuery} html
   * @override
   */
  activateListeners(html) {
    super.activateListeners(html);

    // (global) Listens to all inputs.
    html.find('input').on('change', ev => {
      ev.preventDefault();
      const elem = ev.currentTarget;
      const key = elem.name;
      if (key == undefined) return;
      let value = elem.type === 'checkbox' ? elem.checked : elem.value;
      if (elem.dataset.dtype === 'Number' || elem.type === 'number') value = Number(value);
      foundry.utils.setProperty(this, key, value);
      return this.render();
    });

    // Listens to add die button.
    html.find('.add-die').on('click', async ev => {
      ev.preventDefault();
      const elem = ev.currentTarget;
      const lowestDie = Math.min(...this.dice);

      elem.style.display = 'none';
      const die = await BRRollHandler.askDie(lowestDie);
      elem.style.display = 'flex';

      if (!die) return;
      this.modifiers.forEach(m => m.active = false);
      this.dice.push(die);
      return this.render();
    });

    // Listens to Modifier checkboxes.
    html.find('.modifiers input[type=checkbox]').on('click', ev => {
      ev.preventDefault();
      const elem = ev.currentTarget;
      const modifierId = elem.dataset.id;

      if (!modifierId) return;
      const mod = this.modifiers.find(m => m.id === modifierId);

      if (!mod) return;
      mod.active = elem.checked;

      return this.render();
    });

    // We need to bind the cancel button to the FormApplication's close method.
    // html.find('#cancel').click(() => {
    //   this.close({ submit: false });
    // });
  }

  /* ------------------------------------------ */
  /*  Dialogs                                   */
  /* ------------------------------------------ */

  /**
   * Displays a dialog for requesting a die size.
   * @see {@link Dialog}
   * @param {number} [lowest=6] Value of the lowest die
   * @returns {Promise.<number|boolean>} The desired die size. Returns `false` when cancelled.
   * @static
   * @async
   */
  static async askDie(lowest = 6) {
    const template = 'systems/blade-runner/templates/components/roll/roll-askdie-dialog.hbs';
    const content = await renderTemplate(template, { lowest });
    return new Promise(resolve => {
      const data = {
        title: game.i18n.localize('FLBR.ROLLER.AddDie'),
        content,
        buttons: {
          normal: {
            label: game.i18n.localize('FLBR.OK'),
            callback: html => resolve(html[0].querySelector('form').diesize.value),
          },
          cancel: {
            label: game.i18n.localize('FLBR.Cancel'),
            callback: () => resolve(false),
          },
        },
        default: 'normal',
        close: () => resolve(false),
      };
      const options = {
        width: 100,
        classes: ['blade-runner', 'dialog'],
        minimizable: false,
      };
      new Dialog(data, options).render(true);
    });
  }
}
