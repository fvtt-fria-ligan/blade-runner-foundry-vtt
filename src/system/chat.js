import { ACTOR_TYPES, DAMAGE_TYPES } from './constants';
import { FLBR } from './config';
import BRRollHandler from '@components/roll/roller';
import BladeRunnerDialog from '@components/dialog/dialog';

/* ------------------------------------------- */
/*  Helper Methods                             */
/* ------------------------------------------- */

export function getChatCardActor(card) {
  // Case 1 - a synthetic actor from a Token
  const tokenKey = card.dataset.tokenId;
  if (tokenKey) {
    const [sceneId, tokenId] = tokenKey.split('.');
    const scene = game.scenes?.get(sceneId);
    if (!scene) return null;
    const token = scene.tokens.get(tokenId);
    if (!token) return null;
    return token.actor;
  }

  // Case 2 - use Actor ID directory
  const actorId = card.dataset.actorId;
  return game.actors.get(actorId);
}

/* ------------------------------------------- */
/*  Chat Context Actions                       */
/* ------------------------------------------- */

/**
 * Adds a context menu (right-clic) to Chat messages.
 * @param {JQuery} html
 * @param {Object} options Menu options
 * @link https://www.youtube.com/watch?v=uBC5DSci0NI
 */
export function addChatMessageContextOptions(_html, options) {
  // ? See Part 6, 6:55
  // Allows only this menu option if we have targeted some tokens
  // & the message contains some damage.
  // Note: <li> is the chat message HTML element in the sidebar.
  const canDefend = li => game.user.isGM
    // ? && canvas.tokens?.controlled?.length
    && game.user.targets.size
    && li.find('.chat-card[data-damage]').length;

  options.push({
    name: game.i18n.localize('FLBR.CHAT_ACTION.ApplyDamage'),
    icon: FLBR.Icons.buttons.attack,
    condition: canDefend,
    callback: li => distributeDamageFromMessage(li[0].dataset.messageId),
  });
  return options;
}

/* ------------------------------------------- */

export async function distributeDamageFromMessage(messageId) {
  // const messageId = messageElem.dataset.messageId;
  const message = game.messages.get(messageId);
  const roll = message.rolls[0];
  const damageType = roll.options.damageType;
  let s = roll.successCount;
  if (!s) return;

  // Explosives special case.
  const boom = roll.options.isExplosive;

  // For each targeted tokens.
  // ? const defenderTokens = canvas.tokens.controlled;
  const defenderTokens = game.user.targets;
  for (const defenderToken of defenderTokens) {
    if (defenderToken.actor.type === ACTOR_TYPES.LOOT) {
      ui.notifications.info(
        game.i18n.format('FLBR.COMBAT.SkippedDefender', {
          name: `<b>${defenderToken.name}</b>`,
        }) + ' <i>(' + game.i18n.localize('FLBR.COMBAT.CannotBeDamaged') + ')</i>',
      );
      continue;
    }
    if (!s) break;
    let n = s;
    // Prompts for assigning a qty of successes to tokens if more than one were targeted.
    // Note: skip for explosives.
    if(defenderTokens.size > 1 && !boom) {
      n = await BladeRunnerDialog.rangePicker({
        title: game.i18n.localize('FLBR.DIALOG.AssignSuccesses'),
        description: game.i18n.format('FLBR.DIALOG.AssignSuccessesHint', {
          name: `<b>${defenderToken.name}</b>`,
        }),
        value: s,
      });
      if (n) s -= n;
      else continue;
    }

    // Computes damage.
    /** @type {import('@actor/actor-document').default} */
    const actor = defenderToken.actor;
    const damage = n > 0 ? (roll.options.damage || 0) + 1 * (n - 1) : 0;
    await actor.applyDamage(damage);

    const brokenByDamage = actor.isBroken && [DAMAGE_TYPES.CRUSHING, DAMAGE_TYPES.PIERCING].includes(damageType);

    if (actor.type === ACTOR_TYPES.CHAR && (roll.successCount >= 2 || brokenByDamage)) {
      await actor.drawCrit(
        damageType,
        roll.successCount - 1,
        `D${roll.options.crit}`,
      );
    }
  }

}

/* ------------------------------------------- */
/*  Hiding Buttons                             */
/* ------------------------------------------- */

/**
 * Hides buttons of Chat messages for non-owners.
 * @param {JQuery} html
 */
export function hideChatActionButtons(html) {
  const chatCard = html.find('.yzur.chat-card');

  // Exits early if no chatCard were found.
  if (chatCard.length === 0) return;

  // Hides buttons.
  const actor = game.actors.get(chatCard.attr('data-actor-id'));
  const buttons = chatCard.find('button');
  for (const btn of buttons) {
    if (actor && !actor.isOwner) btn.style.display = 'none';
  }
}
/* ------------------------------------------- */
/*  Chat Event Listeners                       */
/* ------------------------------------------- */

/**
 * Adds Event Listeners to the Chat log.
 * @param {JQuery} html
 */
export function addChatListeners(html) {
  html.on('click', '.blade-runner-display-manual', game.bladerunner.macros.displayManual);
  html.on('click', '.roll-button', _onRollAction);
  html.on('click', '.crit-roll', _onCritRoll);
}

/* ------------------------------------------- */

/**
 * Triggers an action on the ChatMessage's roll.
 * @param {MouseEvent} event
 * @returns {Promise.<import('yzur').YearZeroRoll|ChatMessage>}
 */
async function _onRollAction(event) {
  event.preventDefault();

  // Disables the button to avoid any tricky double push.
  const button = event.currentTarget;
  button.disabled = true;

  // Gets infos and requires a push.
  const chatCard = event.currentTarget.closest('.chat-message');
  const messageId = chatCard.dataset.messageId;
  const message = game.messages.get(messageId);

  // Gets the desired action.
  const action = button.dataset.action;
  switch (action) {
    case 'push': return BRRollHandler.pushRoll(message);
    case 'cancel-push': return BRRollHandler.cancelPush(message);
    default: return null;
  }
}

/* ------------------------------------------- */

/**
 * Triggers a crit roll.
 * @param {MouseEvent} event
 */
function _onCritRoll(event) {
  event.preventDefault();
  const chatCard = event.currentTarget.closest('.chat-message');
  const messageId = chatCard.dataset.messageId;
  const message = game.messages.get(messageId);
  const roll = message?.rolls[0];
  return BRRollHandler.applyCrit(roll);
}
