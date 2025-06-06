import { YearZeroRoll } from 'yzur';
import { FLBR } from '@system/config';
import { ACTOR_TYPES, ITEM_TYPES, SYSTEM_ID } from '@system/constants';
import { chooseActor, getActiveActor } from '@utils/get-actor';

/**
 * @typedef {Object} RollHandlerData
 * @property {string}              [title]        The title of the roll
 * @property {Actor}               [actor={}]     The actor who rolled the dice, if any
 * @property {Item|Item[]}         [items]        The item(s) used to roll the dice, if any
 * @property {string}              [attributeKey] The identifier of the attribute used (important for modifiers)
 * @property {string}              [skillKey]     The identifier of the skill used (important for modifiers)
 * @property {number|number[]}     [dice=[6]]     An array of die faces used to forge the roll
 * @property {number}              [modifier]     Additional value for the final numeric modifier
 * @property {Modifier|Modifier[]} [modifiers]    A group of modifiers that can also be applied to the roll
 * @property {number}              [maxPush=1]    The maximum number of pushes (default is 1)
 */

/**
 * @typedef {Object} RollHandlerOptions Additional options for the FormApplication instance
 * @property {number}  [damage]              Overriding damage quantity
 * @property {number}  [damageType]          Overriding damage type
 * @property {number}  [crit]                Overriding crit die
 * @property {string}  [rollMode]            The default roll mode to use
 * @property {boolean} [sendMessage=true]    Whether the message should be sent
 * @property {boolean} [unlimitedPush=false] Whether to allow unlimited roll pushes
 * @property {boolean} [disabledPush=false]  Whether to disable the ability to set the max. push
*/

/**
 * A Form Application that mimics Dialog,
 * but provides more functionality in terms of data binds and handling of a roll object.
 * Supports Blade Runner standard rolls.
 * @see Dialog
 * @extends {FormApplication}
 */
export default class BRRollHandler extends FormApplication {
  /**
   * The roll in this FormApplication.
   * @type {YearZeroRoll}
   */
  roll = {};

  /**
   * The ID of the message that contains the rolled result.
   * @type {string}
   */
  messageId;

  /**
   * @param {RollHandlerData} rollData
   * @param {RollHandlerOptions} options
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

    /** @typedef {import('@components/item-modifier').default} Modifier */

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
    this.dice = this.dice.filter(d => d > 0);

    /**
     * The maximum number of pushes (default is 1).
     * @type {number}
     */
    this.maxPush = maxPush ?? 1;

    /**
     * Quantity of damage brought with this roll.
     * @type {number}
     */
    this.damage = options.damage ?? this.item?.attacks?.[0]?.damage;

    /**
     * The type of damage.
     * @type {number}
     */
    this.damageType = options.damageType ?? this.item?.attacks?.[0]?.damageType;

    /**
     * The crit die
     * @type {number}
     */
    this.crit = options.crit ?? this.item?.attacks?.[0]?.crit;

    this.options.sendMessage = options.sendMessage ?? true;
    this.options.unlimitedPush = !!options.unlimitedPush;
    this.options.disabledPush = !!options.disabledPush;
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

  get message() {
    return game.messages.get(this.messageId);
  }

  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'roll-application'],
      width: '450',
      // height: '450',
      resizable: false,
    });
  }

  /** @override */
  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    return this.options.template || `systems/${sysId}/templates/components/roll/roller.hbs`;
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
      rollMode: this.options.rollMode ?? game.settings.get('core', 'rollMode'),
      attack: this.isAttack,
      damage: this.damage,
      damageType: this.damageType,
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
   * @param {RollHandlerData}    [data]
   * @param {RollHandlerOptions} [options]
   * @returns {BRRollHandler} Rendered instance of this FormApplication
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
    const nok = foundry.utils.isEmpty(formData)
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

  /**
   * Gets all the options that will be passed into the roll.
   * @returns {Object}
   */
  getRollOptions() {
    const speaker = this.createSpeaker();
    const unlimitedPush = this.options.unlimitedPush;
    return {
      name: this.actor
        ? this.title.replace(`${this.actor.name}: `, '')
        : this.title,
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
      damageType: this.damageType,
      damageTypeName: FLBR.damageTypes[this.damageType],
      crit: this.crit,
      isExplosive: this.item?.type === ITEM_TYPES.EXPLOSIVE,
      item: this.item?.name || this.items.map(i => i.name),
      itemId: this.item?.id || this.items.map(i => i.id),
      yzur: true,
    };
  }

  /* ------------------------------------------ */

  /**
   * Creates a roll from the dice pool and a modifier, evaluates the roll,
   * and then sends it to the chat log.
   * @param {number} [modifier] Modifier to the dice pool, if any
   * @returns {Promise.<ChatMessage|YearZeroRoll>}
   */
  async executeRoll(modifier = 0) {
    if (modifier) {
      const min = Math.min(...this.dice);
      if (modifier > 0) {
        this.dice.push(min);
      }
      else {
        const index = this.dice.indexOf(min);
        this.dice = this.dice.filter((_d, i) => i !== index);
      }
    }
    const dice = this.dice.map(d => ({ term: `${d}`, number: 1 }));
    this.roll = YearZeroRoll.forge(dice, {}, this.getRollOptions());

    await this.roll.roll();

    if (this.options.sendMessage) {
      const message = await this.roll.toMessage({
        speaker: this.createSpeaker(),
      }, {
        rollMode: this.options.rollMode,
      });
      this.messageId = message.id;
      return message;
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
   */
  static async pushRoll(message, { sendMessage = true } = {}) {
    if (!message || !message.rolls.length) return;

    /** @type {YearZeroRoll} */
    const roll = message.rolls[0].duplicate();

    // Checks whether to perform selective push.
    const doSelect = roll.dice.some(d =>
      d.faces >= 10 &&
      d.pushable &&
      d.values.some(v => v >= 6 && v < 10),
    );
    if (doSelect) {
      // 1. Ask for which dice to push and gets their indexes.
      const pushSelections = await BRRollHandler.selectPush(roll.dice);

      // 2. Processes the inputs (checkboxes).
      if (pushSelections) {
        for (const el of pushSelections) {
          const [x, y] = el.name.split('.');
          const result = roll.dice[x].results.find(r => r.active && r.indexResult === Number(y));
          if (!result) throw new Error(`Push Selection | No result found for index ${el.name}`);

          // 2.1. Finds the pushable dice the user don't want to push, and locks them.
          if (!el.disabled && !el.checked) {
            result.locked = true;
          }
          else if (result.locked) {
            result.locked = false;
          }
        }
      }
      else {
        // Refresh the message to reset the re-enable the push button.
        game.messages.directory.updateMessage(message);
        return roll;
      }
    }

    // Pushes the roll.
    await roll.push();

    // Prepares the message.
    const flavor = message.flavor;
    const speakerData = message.speaker;
    const speaker = this.getSpeaker(speakerData);

    // Updates the actor with damage & stress from banes.
    if (speaker) await this.updateActor(roll, speaker);

    // Sends the message.
    if (sendMessage) {
      await message.delete();
      return roll.toMessage({ flavor, speaker: speakerData });
    }
    return roll;
  }

  /* ------------------------------------------ */

  /**
   * Handles push cancellation.
   * @param {ChatMessage} message The message that contains the roll
   * @returns {Promise.<ChatMessage>} The updated message
   */
  static async cancelPush(message) {
    if (!message || !message.rolls.length) return;
    /** @type {YearZeroRoll} */
    const roll = message.rolls[0].duplicate();
    roll.maxPush = 0;
    await message.update({ rolls: [roll.toJSON()] });
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
  static async applyDamage({ attributeTrauma, options: { attributeKey } }, speaker) {
    const currentDamage = attributeTrauma;

    const nature = speaker?.system.nature;
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
    const capacity = speaker?.system[cap];
    if (!capacity || foundry.utils.isEmpty(capacity)) {
      return ui.notifications.error('WARNING.ApplyDamageNoActorCapacity', { localize: true });
    }

    // TODO await this.modifyWillpower(speaker, currentDamage)

    // eslint-disable-next-line prefer-const
    let { value, max } = capacity;
    value = Math.clamped(value - currentDamage, 0, max);

    if (value === 0) {
      ui.notifications.info('FLBR.YouAreBroken', { localize: true });
    }

    await speaker.update({ [`system.${cap}.value`]: value });
    return value;
  }

  /* ------------------------------------------ */

  /**
   * Applies a critical injury to an actor.
   * @param {YearZeroRoll} roll
   */
  static async applyCrit(roll) {
    let actor = await getActiveActor() || game.user.character;
    if (!actor) {
      const actors = game.actors.filter(a => a.type === ACTOR_TYPES.CHAR || a.isVehicle);
      actor = await chooseActor(actors, {
        title: game.i18n.localize('FLBR.CRIT.CriticalInjury'),
        notes: game.i18n.localize('FLBR.CRIT.ChooseActor'),
      });
    }
    if (!actor) return;

    return actor.drawCrit(
      roll.options.damageType,
      roll.successCount - 1,
      `D${roll.options.crit}`,
    );
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
   * Waits for the result of the handler.
   * @param {RollHandlerData}    data
   * @param {RollHandlerOptions} [options]
   * @returns {Promise.<YearZeroRoll>}
   */
  static async waitForRoll(data, options) {
    return new Promise((resolve, reject) => {
      const roller = new this(data, options);
      const originalClose = roller.close;
      roller.close = async opts => {
        await originalClose.bind(roller, opts)();
        const roll = roller.roll;
        if (roll instanceof Roll) {
          if (roller.message && game.dice3d && game.dice3d.isEnabled()) {
            await game.dice3d.waitFor3DAnimationByMessageID(roller.messageId);
            resolve(roll);
          }
        }
        else {
          reject(new Error('The dialog was closed without a choice being made.'));
        }
      };
      roller.render(true);
    });
  }

  /* ------------------------------------------ */

  /**
   * Displays a dialog for requesting a die size.
   * @see {@link Dialog}
   * @param {number} [lowest=6] Value of the lowest die
   * @returns {Promise.<number>} The desired die size
   */
  static async askDie(lowest = 6) {
    const template = 'systems/blade-runner/templates/components/roll/roll-askdie-dialog.hbs';
    const content = await renderTemplate(template, { lowest });
    return Dialog.prompt({
      title: game.i18n.localize('FLBR.ROLLER.AddDie'),
      content,
      label: game.i18n.localize('FLBR.OK'),
      callback: html => Number(html[0].querySelector('form').diesize.value),
      rejectClose: false,
      options: {
        width: 100,
        classes: ['blade-runner', 'dialog'],
        minimizable: false,
      },
    });
  }

  /* ------------------------------------------ */

  /**
   * Displays a dialog for choosing the dice to push.
   * @see {@link Dialog}
   * @param {Object.<string, DiceTerm>} dice
   * @returns {Promise.<HTMLInputElement[]>}
   */
  static async selectPush(dice) {
    return Dialog.wait({
      title: game.i18n.localize('FLBR.ROLLER.SelectDiceToPush'),
      content: await renderTemplate(
        'systems/blade-runner/templates/components/roll/roll-push-select-dialog.hbs',
        { dice },
      ),
      buttons: {
        ok: {
          label: game.i18n.localize('YZUR.CHAT.ROLL.Push'),
          icon: '<i class="fas fa-dice"></i>',
          callback: html => html[0].querySelector('form'),
        },
        cancel: {
          label: game.i18n.localize('FLBR.Cancel'),
          icon: '<i class="fas fa-times"></i>',
          callback: () => false,
        },
      },
    }, {}, {
      classes: ['blade-runner', 'dialog', 'dice-push-select'],
    });
  }
}
