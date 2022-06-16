import { FLBR } from './config';
import BRRollHandler from '@components/roll/roller';

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
  // Allows only this menu option if we have selected some tokens
  // & the message contains some damage.
  const canDefend = li => canvas.tokens.controlled.length && li.find('.chat-card[data-damage]').length;
  options.push({
    name: game.i18n.localize('FLBR.CHAT_ACTION.ApplyDamage'),
    icon: FLBR.Icons.buttons.attack,
    condition: canDefend,
    callback: li => _applyDamage(li[0]),
  });
  return options;
}

function _applyDamage(messageElem) {
  const messageId = messageElem.dataset.messageId;
  const message = game.messages.get(messageId);
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
  html.on('click', '.roll-button', _onRollAction);
}

/* ------------------------------------------- */

/**
 * Triggers an action on the ChatMessage's roll.
 * @param {Event} event
 * @returns {Promise.<import('@lib/yzur').YearZeroRoll|ChatMessage>}
 */
function _onRollAction(event) {
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