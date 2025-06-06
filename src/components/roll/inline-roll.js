import { ATTRIBUTES, SKILLS } from '@system/constants';
import { getActiveActor } from '@utils/get-actor';

export function overrideInlineRollListener() {
  const body = $('body');
  body.off('click', 'a.inline-roll'); // Disables Foundry listener.
  body.on('click', 'a.inline-roll', async event => {
    event.preventDefault();
    const a = event.currentTarget;
    const formula = a.dataset.formula;

    if (/np|p(?:\d+|@maxPush)/i.test(formula)) {
      const actor = await getActiveActor();
      const roll = Roll.create(formula, actor?.getRollData());
      await roll.roll();

      const dice = roll.terms
        .filter(t => t instanceof DiceTerm)
        .flatMap(t => new Array(t.number).fill(t.faces));

      const { attributeKey, skillKey } = _getAttributeAndSkillKeys(formula);

      return game.bladerunner.roller.create({
        title: _createTitle(formula, a.dataset.flavor, actor, attributeKey, skillKey),
        actor,
        dice,
        attributeKey,
        skillKey,
        modifiers: actor ? actor.getRollModifiers({ targets: [attributeKey, skillKey] }) : [],
        maxPush: roll.maxPush,
      }, {
        rollMode: a.dataset.mode,
      });
    }
    else {
      return foundry.applications.ux.TextEditor._onClickInlineRoll(event);
    }
  });
  console.log('Blade Runner RPG | Inline-roll listener overridden.');
}

/**
 * Gets the attribute and skill keys used in the formula.
 * @param {string} formula
 * @private
 */
function _getAttributeAndSkillKeys(formula) {
  const attributeRgx = new RegExp(`@(${Object.values(ATTRIBUTES).join('|')})`);
  const skillRgx = new RegExp(`@(${Object.values(SKILLS).join('|')})`);

  const attributeKey = attributeRgx.exec(formula)?.[1];
  const skillKey = skillRgx.exec(formula)?.[1];

  return { attributeKey, skillKey };
}

/**
 * Creates a title for the roll dialog triggered by the inline roll.
 * @param {string}  formula
 * @param {string} [flavor]
 * @param {Actor}  [actor]
 * @param {string} [attributeKey]
 * @param {string} [skillKey]
 * @private
 */
function _createTitle(formula, flavor, actor, attributeKey, skillKey) {
  let attr, skill;
  if (attributeKey) attr = game.i18n.localize(`FLBR.ATTRIBUTE.${attributeKey.toUpperCase()}`);
  if (skillKey) skill = game.i18n.localize(`FLBR.SKILL.${skillKey.capitalize()}`);

  let out = '';
  if (actor) out += actor.name;
  if (flavor) {
    if (actor) out += ': ';
    out += flavor;
  }
  if (attr || skill) {
    if (!flavor) out += ': ';
    else out += ' (';
    if (attr) out += attr;
    if (attr && skill) out += ' + ';
    if (skill) out += skill;
    if (flavor) out += ')';
  }
  // else {
  //   if (actor && !flavor) out += ': ';
  //   else if (flavor) out += ' | ';
  //   out += formula;
  // }
  if (!out) out = formula || 'Roll';
  return out;
}
