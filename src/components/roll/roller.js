import { YearZeroRoll } from '@lib/yzur';
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
   * @param {boolean} [options.askForOptions=true]  Whether to show a Dialog for roll options
   * @param {boolean} [options.skipDialog=false]    Whether to force skip the Dialog for roll options
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
  },
  options = {
    sendMessage: true,
    unlimitedPush: false,
  }) {
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
      // height: 'auto',
      resizable: false,
    });
  }

  /** @override */
  get template() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return this.options.template || `systems/${sysName}/templates/components/roll/roll-application.hbs`;
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
      advantage: this.advantage,
      disadvantage: this.disadvantage,
      // damage: this.damage,
      // attack: this.isAttack,
      // roll: this.roll,
      config: CONFIG.BLADE_RUNNER,
      options,
    };
  }

  /* ------------------------------------------ */
  /*  Form Methods                              */
  /* ------------------------------------------ */

  /**
   * Guesses the correct Actor making a roll.
   * @param {Object}  data        Object containing id references to the character making a roll
   * @param {string}  data.actor  ID of the actor
   * @param {string} [data.scene] ID of the scene
   * @param {string} [data.token] ID of its token
   * @returns {ActorData}
   */
  static getSpeaker({ actor, scene, token } = {}) {
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
   * @returns private RollHandler //TODO what does it returns?
   * @override Required
   * @async
   */
  async _updateObject(event, formData) {
    this._validateForm(event, formData);
    return this._handleFormData(formData);
  }

  /* ------------------------------------------ */

  /**
   * Validates whether a form is empty and contains a valid artifact string (if any).
   * @param {JQueryEventConstructor} event
   * @param {Object.<string|null>}   formData
   * @returns {boolean} `true` when OK
   * @throws {Error} When formData is empty
   */
  // TODO validateForm
  _validateForm(event, formData) {
    // const isEmpty = Object.values(formData).every(value => !value);
    // if (isEmpty) {
    //   const warning = game.i18n.localize('WARNING.NoDiceInput');
    //   // TODO clean
    //   // event.target.base.focus();
    //   ui.notifications.warn(warning);
    //   throw new Error(warning);
    // }
    return true;
  }

  /* ------------------------------------------ */

  _handleFormData(formData) {
    // TODO do some stuff on our variables.
    // this.modifier = formData.modifier;
    // this.options.unlimitedPush = formData['options.unlimitedPush'];
    return this.executeRoll();
  }

  /* ------------------------------------------ */
  /*  Roll Creation (YZUR)                      */
  /* ------------------------------------------ */

  getRollOptions() {
    const unlimitedPush = this.options.unlimitedPush;
    return {
      name: this.title,
      maxPush: unlimitedPush ? 1000 : this.maxPush,
      type: this.options.type,
      actorId: this.options.actorId || this.actor.id,
      actorType: this.options.actorType || this.actor.type,
      // alias: this.options.alias,
      // attribute: this.base.name,
      // chance: this.spell.chance,
      // isAttack: this.isAttack,
      // consumable: this.options.consumable,
      damage: this.damage,
      tokenId: this.options.tokenId,
      sceneId: this.options.sceneId,
      item: this.item?.name || this.items.map(i => i.name),
      itemId: this.item?.id || this.items.map(i => i.id),
      yzur: true,
    };
  }

  /* ------------------------------------------ */

  async executeRoll() {
    if (this.modifier) {
      const min = Math.min(...this.dice);
      if (this.modifier > 0) this.dice.push(min);
      else this.dice = this.dice.filter(d => d !== min);
    }
    const dice = this.dice.map(d => { return { term: `${d}`, number: 1 }; });
    this.roll = YearZeroRoll.forge(dice, {}, this.getRollOptions());
    // TODO remove // if (this.modifier) await this.roll.modify(this.modifier);

    await this.roll.roll({ async: true });

    if (this.options.sendMessage) return this.roll.toMessage();
    return this.roll;
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

  /* ------------------------------------------ */

  /**
   * Pushes a roll.
   * @param {ChatMessage} message           The message that contains the roll to push.
   * @param {boolean}    [sendMessage=true] Whether to send the pushed roll in a message.
   * @returns {Promise.<YearZeroRoll|ChatMessage>}
   * @static
   * @async
   */
  static async pushRoll(message, { sendMessage = true } = {}) {
    if (!message || !message.roll) return;

    /** @type {YearZeroRoll} */
    const roll = message.roll.duplicate();
    await roll.push({ async: true });
    await message.delete();

    if (sendMessage) return roll.toMessage();
    return roll;
  }

  /* ------------------------------------------ */

  /**
   * Cancel the push for a roll.
   * @param {ChatMessage} message The message that contains the roll
   * @returns {Promise.<ChatMessage>}
   */
  static async cancelPush(message) {
    if (!message || !message.roll) return;
    /** @type {YearZeroRoll} */
    const roll = message.roll.duplicate();
    roll.maxPush = 0;
    await message.update({ roll });
    return message;
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
      elem.style.display = 'block';

      if (!die) return;
      this.modifiers.forEach(m => m.active = false);
      this.dice.push(die);
      return this.render();
    });

    // Listens to Modifier checkboxes.
    html.find('input[type=checkbox].modifier').on('click', ev => {
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
    html.find('#cancel').click(() => {
      this.close();
    });
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
      // Sets the data of the dialog.
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
      new Dialog(data, { width: 100 }).render(true);
    });
  }
}
