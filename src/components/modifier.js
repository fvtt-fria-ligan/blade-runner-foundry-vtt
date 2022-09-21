/* eslint-disable no-shadow */
/**
 * A class representing a roll modifier with many properties and automatic label.
 * @class
 */
export default class Modifier {
  /**
   * @param {string}        key     The key that will be parsed to identify the modifier.
   * @param {number|string} value   The modification value of the modifier. (If a string, will be parsed)
   * @param {Item}         [item]   The item that is the source of the modifier.
   * @param {boolean}      [active] Whether the modifier is active.
   * @param {string}       [name]   Alternative name for the modifier, if you don't want to use the item's name.
   * @param {string}       [type]   Alternative type for the modifier, if you don't want to use the item's type.
   * @param {string}       [description]   Alternative description for the modifier.
   */
  constructor(key, value, item = {}, { active, name, type, description } = {}) {
    /**
     * Identifier for this modifier.
     * @type {string}
     * @constant
     */
    this.id = foundry.utils.randomID();
    // Object.defineProperty(this, 'id', {
    //   configurable: false,
    //   value: foundry.utils.randomID(),
    // });

    /**
     * The item that holds the modifier.
     * @type {Item}
     */
    this.item = item;

    this._name = name ?? item.name;
    this._type = type ?? item.type;
    this._description = description ?? item.system?.description;

    /**
     * The key that will be parsed to identify the modifier.
     * @type {string}
     * @private
     */
    this._key = key;

    /**
     * The modification value of the modifier.
     * @type {number}
     */
    this.value = +value || 0;

    const keys = key.split('.');
    if (keys.length !== 2) {
      throw new SyntaxError(`Modifier "${this.name}" | Key invalid → key#length not equal to 2: "${key}"`);
    }

    /**
     * The category of the target. Either "attribute", "skill", "action", or "constant".
     * @type {string}
     */
    this.category = keys[0];

    /**
     * The target that is modified by the modifier.
     * @type {string}
     */
    this.target = keys[1];

    /**
     * Whether the modifier is active.
     * @type {boolean}
     */
    this.active = active ?? this.value <= 0;
  }

  /* ------------------------------------------ */
  /*  Getters                                   */
  /* ------------------------------------------ */

  /**
   * The item's name that is the source of the modifier.
   * @type {string}
   * @readonly
   */
  get name() {
    return this._name ?? this.item?.name ?? this.target;
  }

  /**
   * The Item's type that was the source of the modifier.
   * Useful for sorting.
   * @type {string}
   * @readonly
   */
  get type() {
    return this._type ?? this.item?.type;
  }

  /**
   * The value, with a sign.
   * @type {string|null}
   * @readonly
   */
  get signedValue() {
    if (this.value !== 0 && !this.value) return null;
    return (this.value >= 0 ? '+' : '−') + Math.abs(this.value);
  }

  /**
   * The localized label of the modifier.
   * @type {string}
   * @readonly
   */
  get label() {
    return this.name + (this.value ? ` ${this.signedValue}` : '');
  }

  /**
   * The description of the item that is the source of the modifier.
   * @type {string}
   * @readonly
   */
  get description() {
    const str = this._description ?? this.item.system?.description ?? '';
    return str.replace(/<[^>]*>?/gm, '');
  }

  /* ------------------------------------------ */

  /**
   * Creates an array with all the modifiers in the corresponding item.
   * @param {Item}             item              The item containing the modifiers
   * @param {string}          [path='system.modifiers'] The path to the object within the item
   *   that contains the modifiers data
   * @param {string|string[]} [targets=[]]       Additional filter based on targets
   * @param {boolean}         [onlyActive=false] Whether to return only active modifiers
   * @returns {Modifier[]}
   * @static
   */
  static getModifiers(item, path = 'system.modifiers', { targets = [], onlyActive = false } = {}) {
    // Gets the modifiers.
    let out = [];
    const mods = foundry.utils.getProperty(item, path);
    if (!mods) return undefined;
    for (const mod of Object.values(mods)) {
      let m;
      try {
        m = new Modifier(mod.name, mod.value, item);
        out.push(m);
      }
      catch (error) {
        ui.notifications.error(error.message, { permanent: true });
        console.error(error);
      }
    }
    // Filters the modifiers.
    if (!Array.isArray(targets)) targets = [targets];
    if (onlyActive || targets.length > 0) {
      out = out.filter(m => {
        const a = onlyActive ? m.active : true;
        return (a && targets.includes(m.target));
      });
    }
    return out;
  }

  /* ------------------------------------------ */

  static getRangedCombatModifiers() {
    const category = 'combat';
    return [
      new Modifier(`${category}.outOfRange`, -1, {}, {
        active: false,
        name: game.i18n.localize('FLBR.RANGED_COMBAT.OutOfRange'),
      }),
      new Modifier(`${category}.smallTarget`, -1, {}, {
        active: false,
        name: game.i18n.localize('FLBR.RANGED_COMBAT.SmallTarget'),
      }),
      new Modifier(`${category}.largeTarget`, 1, {}, {
        active: false,
        name: game.i18n.localize('FLBR.RANGED_COMBAT.LargeTarget'),
      }),
      new Modifier(`${category}.targetBehindCover`, -1, {}, {
        active: false,
        name: game.i18n.localize('FLBR.RANGED_COMBAT.TargetBehindCover'),
      }),
      new Modifier(`${category}.unseenTarget`, -1, {}, {
        active: false,
        name: game.i18n.localize('FLBR.RANGED_COMBAT.UnseenTarget'),
      }),
    ];
  }
}
