import { FLBR } from '@system/config';

/**
 * @typedef {Object} ActorActionData
 * @property {string}  id         The reference for the action,
 *   added in the "data-action" field
 * @property {string}   actorType  The type of actor allowed to use this action
 * @property {string}   label      The label of the action
 * @property {string}  [hint]      Additional tooltip info
 * @property {string}  [attribute] Actor's attribute rolled by the action
 * @property {string}  [skill]     Actor's skill rolled by the action
 * @property {boolean} [onCrew]    Whether this action applies to a crew member
 *   or the vehicle itself
 * @property {(actor: import('@actor/actor-document').default) => {}} [callback]
 *   An callback run by the action in place of a skill roll,
 *   it takes the source actor as an argument
 */

/**
 * An action that can be executed by an actor.
 */
export class ActorAction {
  /**
   * @param {ActorActionData} actionData
   */
  constructor(actionData) {
    if (!actionData.id) {
      throw new SyntaxError('Missing ID for actor action');
    }
    this.id = actionData.id;
    this.actorType = actionData.actorType;
    this._label = actionData.label;
    this._hint = actionData.hint;
    this.attribute = actionData.attribute;
    this.skill = actionData.skill;
    this.onCrew = actionData.onCrew;
    this.callback = actionData.callback;
  }

  get label() {
    return game.i18n.localize(this._label);
  }

  get hint() {
    return game.i18n.localize(this._hint);
  }

  /**
   * Executes the action for a specified actor.
   * @see {BladeRunnerActor.rollStat}
   * @param {import('@actor/actor-document').default} actor
   * @returns {Promise.<import('@components/roll/roller').default|any>}
   */
  async execute(actor) {
    // if (actor.type !== this.actorType) return;
    if (typeof this.callback === 'function') return this.callback(actor);

    const attribute = this.attribute || FLBR.skillMap[this.skill];
    const title = `${this.label} (${game.i18n.localize(`FLBR.SKILL.${this.skill.capitalize()}`)})`;

    return actor.rollStat(attribute, this.skill, { title });
  }

  /** @returns {ActorActionData} */
  toObject() {
    return {
      id: this.id,
      actorType: this.actorType,
      label: this._label,
      hint: this._hint,
      attribute: this.attribute,
      skill: this.skill,
      onCrew: this.onCrew,
      callback: this.callback,
    };
  }
}

/**
 * A collection of actor actions.
 * @extends Collection
 */
export class ActionCollection extends foundry.utils.Collection {
  /** @param {[string, ActorActionData|ActorAction][]} entries */
  constructor(entries) {
    super(entries.map(([id, data]) => {
      if (data instanceof ActorAction) return [id, data];
      return [id, new ActorAction(data)];
    }));
  }

  /**
   * Adds an action to this collection.
   * @param {ActorActionData|ActorAction} actionData
   */
  add(actionData) {
    if (actionData instanceof ActorAction) return this.set(actionData.id, actionData);
    return this.set(actionData.id, new ActorAction(actionData));
  }
}
