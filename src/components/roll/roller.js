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
   * @param {boolean} [options.askForOptions=true] Whether to show a Dialog for roll options
   * @param {boolean} [options.skipDialog=false]   Whether to force skip the Dialog for roll options
   * @param {boolean} [options.sendMessage=true]   Whether the message should be sent
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
  options = {}) {
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
     * @type {Modifier|Modifier[]>}
     */
    this.modifiers = !Array.isArray(modifiers) ? [modifiers] : modifiers;
    // TODO
    // this.modifiers.push(this.items.flatMap(i => i.getModifiers({ targets: [attributeKey, skillKey] })));
    console.warn('FLBR | modifiers:', modifiers);

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

    // this.die1 = { value: this.dice[0] };
    // this.die2 = { value: this.dice[1] ?? 0 };
    // this.die2 = { value: this.dice[2] ?? 0 };

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
  }

  /* ------------------------------------------ */

  /**
   * Missing in foundry.
   */
  set title(str) {
    this.options.title = str;
  }

  /**
   * The final numeric modifier.
   * @type {number}
   */
  set modifier(val) {
    this._modifier = val;
  }

  get modifier() {
    return this._modifier + this.modifiers.reduce((sum, m) => sum + (m.active ? m.value : 0), 0);
  }

  get advantage() {
    return this.modifier > 0;
  }

  get disadvantage() {
    return this.modifier < 0;
  }

  get isAttack() {
    return !!this.damage || [ITEM_TYPES.WEAPON, ITEM_TYPES.EXPLOSIVE].includes(this.item?.type);
  }

  /* ------------------------------------------ */

  /** @override */
  static get defaultOptions() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysName, 'roll-dialog'],
      width: '450',
      height: 'auto',
      resizable: false,
    });
  }

  /** @override */
  get template() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return this.options.template || `systems/${sysName}/templates/components/roll/roll-dialog.hbs`;
  }

  /* ------------------------------------------ */
  /*  Data Preparation                          */
  /* ------------------------------------------ */

  /** @override */
  getData(options) {
    return {
      title: this.title,
      dice: this.dice,
      modifier: this.modifier,
      modifiers: this.modifiers,
      maxPus: this.maxPush,
      advantage: this.advantage,
      disadvantage: this.disadvantage,
      damage: this.damage,
      attack: this.isAttack,
      roll: this.roll,
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
    this.modifier = formData.modifier;
    this.options.unlimitedPush = formData['options.unlimitedPush'];
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
    };
  }

  /* ------------------------------------------ */

  async executeRoll() {
    // TODO
    const dice = this.dice.map(d => { return { term: `${d}`, number: 1 }; });

    this.roll = YearZeroRoll.forge(dice, {}, this.getRollOptions());

    if (this.modifier) await this.roll.modify(this.modifier);

    await this.roll.roll({ async: true });
    return this.roll.toMessage();
  }

  /* ------------------------------------------ */

  push() {}

  /* ------------------------------------------ */
  /*  Form Listeners                            */
  /* ------------------------------------------ */

  /**
   * @param {JQuery} html
   * @override
   */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('input[type=checkbox].modifier').on('change', function () {
      const modifierInput = html.find('input[name=modifier]')[0];
      let value = +modifierInput.value;
      if (this.checked) value += +this.dataset.value;
      else value -= +this.dataset.value;
      this.modifier = value;
      modifierInput.value = value >= 0 ? `+${value}` : value;
    });

    // We need to bind the cancel button to the FormApplication's close method.
    // html.find('#cancel').click(() => {
    //   this.close();
    // });
  }
}
